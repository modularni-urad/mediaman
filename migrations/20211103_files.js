import { TABLE_NAMES } from '../consts'

exports.up = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema

  return builder.createTable(TABLE_NAMES.FILES, (table) => {
    table.string('filename').notNullable().primary()
    table.string('nazev', 64).notNullable()
    table.string('tags', 64)
    table.string('popis', 256)
    table.string('ctype', 128).notNullable()
    table.integer('size').notNullable()
    table.string('owner', 64).notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
  })
}

exports.down = (knex, Promise) => {
  const builder = process.env.CUSTOM_MIGRATION_SCHEMA
    ? knex.schema.withSchema(process.env.CUSTOM_MIGRATION_SCHEMA)
    : knex.schema

  return builder.dropTable(TABLE_NAMES.FILES)
}


