import fs from 'fs'
import path from 'path'
import { TABLE_NAMES } from '../consts'
const conf = {
  tablename: TABLE_NAMES.FILES,
  editables: ['filename', 'nazev', 'tags', 'popis', 'ctype', 'size'],
  idattr: 'filename'
}

export default (ctx) => {
  const { knex, ErrorClass } = ctx
  const _ = ctx.require('underscore')
  const entityMWBase = ctx.require('entity-api-base').default
  const entityMW = entityMWBase(conf, knex, ErrorClass)
  const DATA_FOLDER = path.resolve(process.env.DATA_FOLDER || './.data')

  return { create, list, update, upload }
  
  async function create (body, user, schema) {
    Object.assign(body, { owner: user.id })
    return entityMW.create(body, schema)
  }

  async function upload (name, body, domain) {
    const fileName = path.join(DATA_FOLDER, domain, name)
    try {
      await fs.promises.mkdir(path.dirname(fileName))
    } catch (e) {

    }
    return fs.promises.writeFile(fileName, Buffer.from(body.content, 'base64'))
  }

  async function update (filename, data, user, schema) {
    return entityMW.update(filename, data, schema)
  }

  async function list (query, schema) {
    return entityMW.list(query, schema)
  }
}