import _ from 'underscore'

module.exports = (g) => {
  const r = g.chai.request(g.baseurl)

  const p = {
    filename: 'pok1.md',
    nazev: 'proj1',
    popis: 'popis proj1',
    tags: 'zivpros'
  }
  const p2 = {
    filename: 'pokus/pok2.md',
    nazev: 'proj2',
    popis: 'popis proj2',
    tags: 'zivpros'
  }

  return describe('files', () => {
    //
    it('must not create a new item without auth', async () => {
      const res = await r.post(`/`).send(p)
      res.should.have.status(401)
    })

    it('shall create a new item without mandatory item', async () => {
      const res = await r.post(`/`).send(_.omit(p, 'nazev'))
        .set('Authorization', 'Bearer f')
      res.should.have.status(400)
    })

    it('shall create a new item pok1', async () => {
      const res = await r.post(`/`).send(p).set('Authorization', 'Bearer f')
      res.should.have.status(201)
      res.should.have.header('content-type', /^application\/json/)
    })

    it('shall update the item pok1', async () => {
      const change = {
        nazev: 'pok1changed'
      }
      const res = await r.put(`/${p.filename}`)
        .send(change).set('Authorization', 'Bearer f')
      res.should.have.status(200)
    })

    it('shall get all items', async () => {
      const res = await r.get(`/`)
      res.body.length.should.eql(1)
      res.body[0].nazev.should.eql('pok1changed')
      res.should.have.status(200)
    })

    it('shall update filname withsubpath', async () => {
      const res = await r.post(`/`).send(p2).set('Authorization', 'Bearer f')
      res.should.have.status(201)
      const res2 = await r.put(`/${p2.filename}`)
        .send({ nazev: 'subpath' }).set('Authorization', 'Bearer f')
      res2.should.have.status(200)
    })

  })
}
