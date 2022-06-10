import entityMWBase from 'entity-api-base'
import axios from 'axios'
import { remove as removeDiacritics } from 'diacritics'
import _ from 'underscore'
import { TABLE_NAMES } from '../consts'

const FILESTORAGE_URL = process.env.FILESTORAGE_URL
const conf = {
  tablename: TABLE_NAMES.FILES,
  editables: ['filename', 'nazev', 'tags', 'popis'],
  idattr: 'filename'
}

export default (ctx) => {
  const { knex, ErrorClass } = ctx
  const entityMW = entityMWBase(conf, knex, ErrorClass)

  return { create, list, update, filename }

  async function getFileInfo (body, schema) {
    const fileUrl = `${FILESTORAGE_URL}${schema || ''}/${body.filename}`
    try {
      const dataReq = await axios.head(fileUrl)
      return {
        ctype: dataReq.headers['content-type'], 
        size: dataReq.headers['content-length'] 
      }
    } catch (err) {
      const filename = removeDiacritics(body.filename)
      const fileUrl = `${FILESTORAGE_URL}${schema || ''}/${filename}`
      const dataReq = await axios.head(fileUrl)
      return {
        ctype: dataReq.headers['content-type'], 
        size: dataReq.headers['content-length'] 
      }
    }
  }

  function filename (filename) {
    return removeDiacritics(filename).replace(/\s/, '_')
  }
  
  async function create (body, user, schema) {
    try {
      const fileInfo = await getFileInfo(body, schema)
      Object.assign(body, fileInfo, { owner: user.id })
    } catch (err) {
      if (err.response && err.response.status === 404) {
        throw new ErrorClass(404, `${err.config.url} not found in storage!`)
      }
      throw err
    }    
    return entityMW.create(body, schema)
  }

  async function update (filename, data, user, schema) {
    return entityMW.update(filename, data, schema)
  }

  async function list (query, schema) {
    return entityMW.list(query, schema)
  }
}