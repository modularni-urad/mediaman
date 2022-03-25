import MWare from './middleware'
import ACLRoutes from './acl_routes'

export default function (ctx) {
  const { auth, express } = ctx
  const bodyParser = express.json()
  const MW = MWare(ctx)
  const app = express()

  app.use('/acl', ACLRoutes(ctx))

  app.get('/', (req, res, next) => {
    req.query.filter = req.query.filter ? JSON.parse(req.query.filter) : {}
    MW.list(req.query, req.tenantid).then(result => {
      res.json(result)
    }).catch(next)
  })

  app.post('/', auth.session, auth.required, bodyParser, (req, res, next) => {
    MW.create(req.body, req.user, req.tenantid).then(result => {
      res.status(201).json(result)
    }).catch(next)
  })

  app.put('/:filename*', auth.session, auth.required, bodyParser, (req, res, next) => {
    const filename = req.params.filename + req.params[0]
    MW.update(filename, req.body, req.user, req.tenantid).then(result => {
      res.json(result)
    }).catch(next)
  })

  return app
}