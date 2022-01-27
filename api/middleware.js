import fs from 'fs'
import path from 'path'
import entityMWBase from 'entity-api-base'
import _ from 'underscore'
import mkdirp from 'mkdirp'
import { TABLE_NAMES } from '../consts'

const DATA_FOLDER = path.resolve(process.env.DATA_FOLDER || './.data')
const conf = {
  tablename: TABLE_NAMES.FILES,
  editables: ['filename', 'nazev', 'tags', 'popis', 'ctype', 'size'],
  idattr: 'filename'
}

export default (ctx) => {
  const { knex, ErrorClass } = ctx
  const entityMW = entityMWBase(conf, knex, ErrorClass)

  return { create, list, update, upload }
  
  async function create (body, user, schema) {
    Object.assign(body, { owner: user.id })
    return entityMW.create(body, schema)
  }

  async function upload (name, body, domain) {
    if (name.indexOf('..') >= 0) throw new ErrorClass(400, 'wrong filename')
    const fileName = path.basename(name)
    const dirName = path.join(DATA_FOLDER, domain || '', path.dirname(name))
    try {
      await mkdirp(dirName)
    } catch (e) {
      throw new ErrorClass(400, e.toString())
    }
    const data = Buffer.from(body.content, 'base64')
    return fs.promises.writeFile(path.join(dirName, fileName), data)
  }

  async function update (filename, data, user, schema) {
    return entityMW.update(filename, data, schema)
  }

  async function list (query, schema) {
    return entityMW.list(query, schema)
  }
}