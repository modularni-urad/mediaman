import _ from 'underscore'
import { MULTITENANT, TABLE_NAMES } from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TABLE_NAMES.FILES, (table) => {
    table.string('filename').notNullable()
    MULTITENANT && table.integer('orgid').notNullable()
    table.string('nazev', 64).notNullable()
    table.string('tags', 64)
    table.string('popis', 256)
    table.string('ctype', 16).notNullable()
    table.integer('size').notNullable()
    table.string('owner', 64).notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    
    table.primary(MULTITENANT ? ['filename', 'orgid'] : 'filename')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TABLE_NAMES.FILES)
}


