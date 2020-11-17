const _checkRequiredCredentials = options => {
  if (!options || !options.credentials || !options.credentials.management || !options.credentials.amqp10) {
    throw new Error(
      'No messaging credentials found. Hint: You need to bind your app to a Message-Queuing service or provide the necessary credentials through environment variables.'
    )
  }
}

const _optionsClient = options => {
  _checkRequiredCredentials(options)

  const prefix = `amqps://${options.credentials.amqp10.auth.basic.userName}:${
    options.credentials.amqp10.auth.basic.password
  }@`
  const uri = prefix + options.credentials.amqp10.url.replace(/^amqps:\/\//, '')

  return {
    amqp: { uri },
    management: options.credentials.management
  }
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
