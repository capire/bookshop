const https = require('https')
const requestToken = require('../http-utils/token')

const authorizedRequest = ({ method, uri, path, oa2, dataObj, token, attemptInfo, rejectString }) => {
  attemptInfo()
  return new Promise((resolve, reject) => {
    ;((token && Promise.resolve(token)) || requestToken(oa2))
      .catch(err => reject(err))
      .then(token => {
        const httpOptions = {
          host: uri.replace('https://', ''),
          path,
          headers: {
            Authorization: 'Bearer ' + token
          },
          method
        }

        let data
        if (dataObj) {
          data = JSON.stringify(dataObj)
          httpOptions.headers['Content-Type'] = 'application/json'
          httpOptions.headers['Content-Length'] = data.length
        }

        const req = https.request(httpOptions, res => {
          res.setEncoding('utf8')
          if (res.statusCode !== 200 && res.statusCode !== 201 && res.statusCode !== 204) {
            reject(new Error(rejectString))
          }

          res.on('data', () => {})
          res.on('end', () => {
            resolve(token)
          })
        })

        if (data) req.write(data)
        req.end()
      })
  })
}

module.exports = authorizedRequest
