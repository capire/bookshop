const https = require('https')

const requestToken = ({ clientid, clientsecret, tokenendpoint }) =>
  new Promise((resolve, reject) => {
    const options = {
      host: tokenendpoint.replace('/oauth/token', '').replace('https://', ''),
      path: '/oauth/token?grant_type=client_credentials&response_type=token',
      headers: {
        Authorization: 'Basic ' + Buffer.from(clientid + ':' + clientsecret).toString('base64')
      }
    }

    https.get(options, res => {
      res.setEncoding('utf8')
      let result = ''
      res.on('data', chunk => {
        result += chunk
      })
      res.on('end', () => {
        const json = JSON.parse(result)
        if (!json.access_token) {
          reject(new Error('Authorization failed'))
        }
        resolve(json.access_token)
      })
    })
  })

module.exports = requestToken
