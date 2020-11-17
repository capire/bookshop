/**
 * @param {object} req - the request object
 * @returns {string} - the client user as string
 * @private
 */
const getUserFromRequest = req => {
  if (req.headers['authorization']) {
    const [type, value] = req.headers['authorization'].split(' ')

    if (type.toLowerCase() === 'basic' && value) {
      const [user, ...parts] = Buffer.from(value, 'base64')
        .toString()
        .split(':')
      return parts.length === 1 ? user : undefined
    }
  }
}

const { getIpFromRequest } = require('../../../common/utils/req')

module.exports = { getIpFromRequest, getUserFromRequest }
