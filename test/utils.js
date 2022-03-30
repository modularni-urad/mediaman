var tus = require('tus-js-client')
var fs = require('fs')

export async function doUpload (file2upload, filename, token, g) {
  var file = fs.createReadStream(file2upload)
  var size = fs.statSync(file2upload).size

  return new Promise((resolve, reject) => {
    var options = {
      endpoint: `http://${g.storageHost}:${g.storagePort}`,
      metadata: {
        filename: filename,
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