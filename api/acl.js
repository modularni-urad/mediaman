import entityMWBase from 'entity-api-base'
import jwt from 'jsonwebtoken'
import _ from 'underscore'
import { TABLE_NAMES } from '../consts'

const conf = {
  tablename: TABLE_NAMES.ACL,
  editables: ['paths', 'uid'],
  idattr: 'uid'
}

export default (ctx) => {
  const { knex, ErrorClass } = ctx
  const entityMW = entityMWBase(conf, knex, ErrorClass)

  return { create, list, update, createToken }
  
  async function create (body, schema) {
    return entityMW.create(body, schema)
  }

  async function update (filename, data, user, schema) {
    return entityMW.update(filename, data, schema)
  }

  async function list (query, schema) {
    return entityMW.list(query, schema)
  }

  async function createToken (user, schema) {
    const myAcl = await entityMW.get(user.id, schema)
    const paths = myAcl.paths.split(',').map(i => {
      return schema ? `/${schema}/${i}` : i
    })
    return jwt.sign({ paths }, process.env.STORAGE_SECRET, { 
      expiresIn: '1h' 
    })
  }
}