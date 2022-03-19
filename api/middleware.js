import entityMWBase from 'entity-api-base'
import _ from 'underscore'
import { TABLE_NAMES } from '../consts'

const conf = {
  tablename: TABLE_NAMES.FILES,
  editables: ['filename', 'nazev', 'tags', 'popis'],
  idattr: 'filename'
}

export default (ctx) => {
  const { knex, ErrorClass } = ctx
  const entityMW = entityMWBase(conf, knex, ErrorClass)

  return { create, list, update }
  
  async function create (body, user, schema) {
    Object.assign(body, { owner: user.id })
    return entityMW.create(body, schema)
  }

  async function update (filename, data, user, schema) {
    return entityMW.update(filename, data, schema)
  }

  async function list (query, schema) {
    return entityMW.list(query, schema)
  }
}