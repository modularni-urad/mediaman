import MWare from './acl'
const TRUSTED_IPS = (process.env.TRUSTED_IPS || '').split(',')

export default function (ctx) {
  const { auth, express, ErrorClass } = ctx
  const bodyParser = express.json()
  const MW = MWare(ctx)
  const app = express()

  app.get('/', auth.session, auth.required, (req, res, next) => {
    req.query.filter = req.query.filter ? JSON.parse(req.query.filter) : {}
    MW.list(req.query, req.tenantid).then(result => {
      res.json(result)
    }).catch(next)
  })

  app.get('/token', auth.session, bodyParser, (req, res, next) => {
    const paths = TRUSTED_IPS.indexOf(req.ip) >= 0 && req.body && req.body.paths
    if (!paths && !req.user) return next(ErrorClass(401, 'unauhtorized'))
    MW.createToken(req.user, paths, req.tenantid).then(result => {
      res.json(result)
    }).catch(next)
  })

  app.post('/', auth.session, auth.required, bodyParser, (req, res, next) => {
    MW.create(req.body, req.tenantid).then(result => {
      res.status(201).json(result)
    }).catch(next)
  })

  app.put('/:id', auth.session, auth.required, bodyParser, (req, res, next) => {
    MW.update(req.params.id, req.body, req.user, req.tenantid).then(result => {
      res.json(result)
    }).catch(next)
  })

  return app
}