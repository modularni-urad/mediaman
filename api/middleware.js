import _ from 'underscore'
import { APIError } from 'modularni-urad-utils'
import { TABLE_NAMES, MULTITENANT } from '../consts'
import entity from 'entity-api-base'
const conf = {
  tablename: TABLE_NAMES.FILES,
  editables: ['filename', 'nazev', 'tags', 'popis', 'ctype', 'size']
}

export default { create, list, update }
  
async function create (body, orgid, user, knex) {
  try {
    Object.assign(body, { owner: user.id })
    MULTITENANT && Object.assign(body, { orgid })
    const newitem = await entity.create(body, conf, knex)
    return newitem
  } catch(err) {
    throw new APIError(400, err.toString())
  }
}

async function update (filename, data, orgid, user, knex) {
  try {
    const cond = MULTITENANT ? { orgid, filename } : { filename }
    data = _.pick(data, conf.editables)
    return await knex(conf.tablename).where(cond).update(data).returning('*')
  } catch(err) {
    throw new APIError(400, err.toString())
  }
}

async function list (query, orgid, knex) {
  MULTITENANT && Object.assign(query.filter, { orgid })
  return entity.list(query, conf, knex)
}