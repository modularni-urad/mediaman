var tus = require('tus-js-client')
var fs = require('fs')

export async function doUpload (file, filename, token, g) {
  var path = `${__dirname}/${file}`
  var file = fs.createReadStream(path)
  var size = fs.statSync(path).size

  return new Promise((resolve, reject) => {
    var options = {
      endpoint: `http://${g.storageHost}:${g.storagePort}`,
      metadata: {
        filename: filename,
        filetype: 'text/plain',
        Bearer: token
      },
      uploadSize: size,
      onError (error) {
        reject(error)
      },
      onSuccess () {
        resolve()
      }
    }
    
    var upload = new tus.Upload(file, options)
    upload.start()
  })
}