import _ from 'underscore'

module.exports = (g) => {
  const r = g.chai.request(g.baseurl)

  const p = {
    uid: 42,
    paths: 'pokus/.*',
  }

  return describe('ACLs', () => {
    //
    it('must not create a new acl without auth', async () => {
      const res = await r.post(`/acl/`).send(p)
      res.should.have.status(401)
    })

    it('must not create a new acl without mandatory item', async () => {
      const res = await r.post(`/acl/`).send(_.omit(p, 'paths'))
        .set('Authorization', 'Bearer f')
      res.should.have.status(400)
    })

    it('shall create a new acl', async () => {
      const res = await r.post(`/acl/`).send(p).set('Authorization', 'Bearer f')
      res.should.have.status(201)
      res.should.have.header('content-type', /^application\/json/)
    })

    it('shall update the item pok1', async () => {
      const change = {
        paths: 'pokus/.*,pokus2/settings.yaml'
      }
      const res = await r.put(`/acl/${p.uid}`).send(change)
        .set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    it('shall get all items', async () => {
      const res = await r.get(`/acl/`).set('Authorization', 'Bearer f')
      res.should.have.status(200)
      res.body.length.should.eql(1)
      res.body[0].paths.should.eql('pokus/.*,pokus2/settings.yaml')
    })

  })
}