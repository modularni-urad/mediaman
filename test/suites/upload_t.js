import _ from 'underscore'
import path from 'path'
import fs from 'fs'
import { doUpload } from '../utils'

module.exports = (g) => {
  const r = g.chai.request(g.baseurl)

  return describe('upload', () => {
    //
    // it('must not upload without token', async () => {
    //   const res = await r.post(`/`).send(p)
    //   res.should.have.status(401)
    // })

    // it('shall upload with appropriate token', async () => {
    //   const res = await r.post(`/`).send(_.omit(p, 'nazev'))
    //     .set('Authorization', 'Bearer f')
    //   res.should.have.status(400)
    // })

    it('shall upload', async () => {
      const tokenRes = await r.get(`/acl/token`).set('Authorization', 'Bearer f')
      tokenRes.should.have.status(200)
      const token = tokenRes.body.token
      const filename = '/README.md'
      const file2upload = path.resolve(path.join(__dirname, '../../README.md'))
      await doUpload(file2upload, filename, token, g)

      const uploadedFile = path.join(process.env.DATA_FOLDER, filename)
      const uploadedContent = fs.readFileSync(uploadedFile, 'utf-8')
      const origContent = fs.readFileSync(file2upload, 'utf-8')
      uploadedContent.should.eql(origContent)
    })

  })
}
