import express from 'express'
import path from 'path'
import { attachPaginate } from 'knex-paginate'
import initErrorHandlers from 'modularni-urad-utils/error_handlers'
import { 
  required, requireMembership, isMember, getUID 
} from 'modularni-urad-utils/auth'
import initDB from 'modularni-urad-utils/db'
import initRoutes from './api/routes.js'

export default async function init (mocks = null) {
  const migrationsDir = path.join(__dirname, 'migrations')
  const knex = mocks
    ? await mocks.dbinit(migrationsDir)
    : await initDB(migrationsDir)
  attachPaginate()
  
  const ctx = {
    express, knex,
    auth: { required, requireMembership, isMember, getUID },
    JSONBodyParser: express.json()
  }
  const app = express()

  app.use(initRoutes(ctx))

  initErrorHandlers(app) // ERROR HANDLING
  return app
}