import _ from 'underscore'
import { TABLE_NAMES, MULTITENANT } from '../consts'
import entity from 'entity-api-base'
const conf = {
  tablename: TABLE_NAMES.FILES,
  editables: ['filename', 'nazev', 'tags', 'popis', 'ctype', 'size']
}

export default { create, list, update }
  
async function create (body, orgid, user, knex) {
  Object.assign(body, { owner: user.id })
  MULTITENANT && Object.assign(body, { orgid })
  return entity.create(body, conf, knex)
}

async function update (filename, data, orgid, user, knex) {
  const cond = MULTITENANT ? { orgid, filename } : { filename }
  data = _.pick(data, conf.editables)
  return knex(conf.tablename).where(cond).update(data).returning('*')
}

async function list (query, orgid, knex) {
  MULTITENANT && Object.assign(query.filter, { orgid })
  return entity.list(query, conf, knex)
}