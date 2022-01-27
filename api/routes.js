import MWare from './middleware'

export default function (ctx) {
  const { auth, express } = ctx
  const bodyParser = express.json({limit: '50mb'})
  const MW = MWare(ctx)
  const app = express()

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

  app.post('/upload/:fname*', auth.session, auth.required, bodyParser, (req, res, next) => {
    const fname = `${req.params.fname}${req.params[0]}`
    MW.upload(fname, req.body, req.tenantid).then(result => {
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