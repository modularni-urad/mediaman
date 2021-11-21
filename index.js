import express from 'express'
import cors from 'cors'
import path from 'path'
import { attachPaginate } from 'knex-paginate'
import {
  auth,
  initDB,
  initErrorHandlers,
  initConfigManager,
  CORSconfigCallback,
  createLoadOrgConfigMW
} from 'modularni-urad-utils'
import initRoutes from './api/routes.js'

export default async function init (mocks = null) {
  const migrationsDir = path.join(__dirname, 'migrations')
  const knex = mocks
    ? await mocks.dbinit(migrationsDir)
    : await initDB(migrationsDir)
  attachPaginate()
  await initConfigManager(process.env.CONFIG_FOLDER)

  const app = express()
  process.env.NODE_ENV !== 'test' && app.use(cors(CORSconfigCallback))

  const ctx = {
    express, knex, auth, JSONBodyParser: express.json({limit: '50mb'})
  }
  const api = initRoutes(ctx)

  const loadOrgConfig = createLoadOrgConfigMW(req => {
    req.orgdomain = req.params.domain
    return req.params.domain
  })
  app.use('/:domain/', loadOrgConfig, api)

  initErrorHandlers(app) // ERROR HANDLING
  return app
}