import MWare from './middleware'
import _ from 'underscore'

export default function (ctx) {
  const { knex, auth, express, JSONBodyParser } = ctx
  const app = express()

  app.get('/', (req, res, next) => {
    req.query.filter = req.query.filter ? JSON.parse(req.query.filter) : {}
    MWare.list(req.query, req.orgconfig.orgid, knex).then(result => {
      res.json(result)
    }).catch(next)
  })

  app.post('/', auth.session, auth.required, JSONBodyParser, (req, res, next) => {
    MWare.create(req.body, req.orgconfig.orgid, req.user, knex).then(result => {
      res.status(201).json(result)
    }).catch(next)
  })

  app.put('/:id', auth.session, auth.required, JSONBodyParser, (req, res, next) => {
    MWare.update(req.params.id, req.body, req.orgconfig.orgid, req.user, knex)
    .then(result => {
      res.json(result)
    }).catch(next)
  })

  return app
}