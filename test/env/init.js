import express from 'express'
import dbinit from './dbinit'
import fs from 'fs'
import rimraf from 'rimraf'
import { APIError } from 'modularni-urad-utils'
import { attachPaginate } from 'knex-paginate'
const SessionServiceMock = require('modularni-urad-utils/test/mocks/sessionService')

module.exports = (g) => {
  process.env.DATABASE_URL = ':memory:'
  process.env.NODE_ENV = 'test'
  process.env.TRUSTED_IPS = '127.0.0.1'
  process.env.SESSION_SERVICE_PORT = 24000
  process.env.STORAGE_SERVICE_PORT = 24001
  process.env.SESSION_SERVICE = `http://localhost:${process.env.SESSION_SERVICE_PORT}`
  process.env.DATA_FOLDER = './.testdata'
  try { fs.mkdirSync(process.env.DATA_FOLDER) } catch (_) {}
  process.env.SERVER_SECRET = process.env.STORAGE_SECRET = 'secret'

  const port = process.env.PORT || 3333
  Object.assign(g, {
    port,
    baseurl: `http://localhost:${port}`,
    mockUser: { id: 42 },
    sessionBasket: [],
    storagePort: process.env.STORAGE_SERVICE_PORT,
    storageHost: '127.0.0.1'
  })
  g.sessionSrvcMock = SessionServiceMock.default(process.env.SESSION_SERVICE_PORT, g)
  const StorageServer = require('modularni-urad-filestorage')

  g.InitApp = async function (ApiModule) {
    const auth = require('modularni-urad-utils/auth').default
    const knex = await dbinit()
    attachPaginate()
    await ApiModule.migrateDB(knex)

    const app = express()
    const appContext = { 
      express, knex, auth, 
      bodyParser: express.json(),
      ErrorClass: APIError
    }
    const mwarez = ApiModule.init(appContext)
    app.use(mwarez)

    app.use((error, req, res, next) => {
      if (error instanceof APIError) {
        return res.status(error.name).send(error.message)
      }
      res.status(500).send(error.message || error.toString())
    })

    return new Promise((resolve, reject) => {
      g.server = app.listen(port, '127.0.0.1', (err) => {
        if (err) return reject(err)
        g.storserver = StorageServer.listen(g.storagePort, g.storageHost, err => {
          if (err) throw err
          console.log(`tusuploader listens on ${g.storageHost}:${g.storagePort}`)
        })
        resolve()
      })
    })
  }

  g.close = async function() {
    return new Promise((resolve, reject) => {
      g.sessionSrvcMock.close()
      g.storserver.close()
      g.server.close()
      rimraf(process.env.DATA_FOLDER, (err) => {
        if (err) return reject(err)
        rimraf('./chunks', (err) => {
          if (err) return reject(err)
          resolve()
        })
      })
    })
  }
}