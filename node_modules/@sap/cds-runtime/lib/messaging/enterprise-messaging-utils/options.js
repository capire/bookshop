const _checkRequiredCredentials = options => {
  if (!options || !options.credentials || !options.credentials.management || !options.credentials.messaging) {
    throw new Error(
      'No messaging credentials found. Hint: You need to bind your app to an Enterprise-Messaging service or provide the necessary credentials through environment variables.'
    )
  }
}

const _getOAuth2 = oa2 => {
  return {
    client: oa2.client || oa2.clientid,
    secret: oa2.secret || oa2.clientsecret,
    endpoint: oa2.endpoint || oa2.tokenendpoint,
    granttype: oa2.granttype
  }
}

const _optionsClient = options => {
  _checkRequiredCredentials(options)
  const optionsClient = {
    namespace: options.credentials.namespace,
    amqp: options.credentials.messaging.filter(entry => entry.protocol.includes('amqp10ws'))[0],
    management: options.credentials.management[0]
  }
  optionsClient.amqp.oa2 = _getOAuth2(optionsClient.amqp.oa2)
  return optionsClient
}

const _optionsApp = () => {
  const vcapApplication = process.env.VCAP_APPLICATION && JSON.parse(process.env.VCAP_APPLICATION)
  return {
    appName: vcapApplication && vcapApplication.application_name,
    appID: vcapApplication && vcapApplication.application_id
  }
}

module.exports = options => ({
  optionsClient: _optionsClient(options),
  optionsApp: _optionsApp()
})
