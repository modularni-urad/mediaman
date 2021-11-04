import _ from 'underscore'
import { TABLE_NAMES } from '../../consts'
const Knex = require('knex')

export default async function initDB (migrationsDir) {
  const opts = {
    client: 'sqlite3',
    connection: {
      filename: process.env.DATABASE_URL
    },
    useNullAsDefault: true,
    debug: true,
    migrations: {
      directory: migrationsDir
    }
  }
  const knex = Knex(opts)
  
  await knex.migrate.latest()

  return knex
}
