/* istanbul ignore file */

const { getAuditLogNotWrittenError } = require('./errors')

const _getCredentials = auditlog => {
  return require('./xsenv')('auditlog', auditlog)
}

const _keysToString = keys => {
  const strings = []
  for (const key in keys) {
    strings.push(`${key}: ${keys[key]}`)
  }

  return strings.join(', ')
}

const _logAttributes = (log, attributes) => {
  for (const attribute in attributes) {
    log = log.attribute({ name: attribute })
  }
}

const _logTenant = (log, tenant) => {
  log = tenant ? log.tenant(tenant) : log
}

/**
 * Logs securityMessage that user is not authorized.
 *
 * @param auditLogger - the audit logger
 * @param credentials - credentials for audit log instance
 * @param logger - logger object
 * @param user - user if provided via basic auth, if not  => ip address
 * @param ip - ip address of the user
 * @private
 */
const _logUnauthorized = (auditLogger, credentials, logger, { user, ip }) => {
  auditLogger.v2(credentials, function (err, auditlog) {
    if (err) {
      // TODO: Decide for a more meaningful error message
      return logger.error(`Error occurred while writing audit log: ${err}`)
    }

    let log = auditlog.securityMessage('Unsuccessful login attempt').by(user)

    log = ip ? log.externalIP(ip) : log

    log.log(function (err) {
      if (err) {
        return logger.error(`Error occurred while writing audit log: ${err}`)
      }
    })
  })
}

/**
 * Logs securityMessage that user does not have sufficient permissions.
 *
 * @param auditLogger - the audit logger
 * @param credentials - credentials for audit log instance
 * @param logger - logger object
 * @param user - user that has not sufficient privileges
 * @param ip - ip address of the user
 * @param tenant - tenant of the user
 * @private
 */
const _logMissingPermissions = (auditLogger, credentials, logger, { user, ip, tenant }) => {
  auditLogger.v2(credentials, function (err, auditlog) {
    if (err) {
      return logger.error(`Error occurred while writing audit log: ${err}`)
    }

    let log = auditlog.securityMessage('User does not have required permissions').by(user)

    log = ip ? log.externalIP(ip) : log

    log = tenant ? log.tenant(tenant) : log

    log.log(function (err) {
      if (err) {
        return logger.error(`Error occurred while writing audit log: ${err}`)
      }
    })
  })
}

/**
 *
 * Logs data read access.
 *
 * @param auditLogger - the audit logger
 * @param credentials - credentials for audit log instance
 * @param auditLogData - audit log input like dataSubject, the changed sensitive attributes or the user and tenant
 * @returns {Promise} which rejects if audit log cannot be written
 * @private
 */
const _logReadAccess = (auditLogger, credentials, auditLogData) => {
  return new Promise((resolve, reject) => {
    auditLogger.v2(credentials, function (err, auditlog) {
      if (err) {
        return reject(getAuditLogNotWrittenError(err, 'before commit', 'READ'))
      }

      const { dataSubject, attributes, auditObject, user, tenant } = auditLogData

      try {
        let log = auditlog.read({
          type: auditObject.type,
          id: { key: _keysToString(auditObject.keys) }
        })

        _logAttributes(log, attributes)

        log = log.dataSubject({
          type: dataSubject.type,
          id: dataSubject.keys,
          role: dataSubject.role
        })

        _logTenant(log, tenant)

        log = log.by(user)

        log.log(function (err) {
          if (err) {
            return reject(getAuditLogNotWrittenError(err, 'before commit', 'READ'))
          }
          resolve()
        })
      } catch (err) {
        return reject(getAuditLogNotWrittenError(err, 'before commit', 'READ'))
      }
    })
  })
}

/**
 *
 * Logs diff of a data manipulation event.
 *
 * @param auditLogger - the audit logger
 * @param credentials - credentials for audit log instance
 * @param context - the context object
 * @param auditLogData - audit log input like dataSubject, the changed sensitive attributes or the user and tenant
 * @param phase - the phase the logDataChange handler was triggered in
 * @returns {Promise}
 * @private
 */
const _logDataChange = (auditLogger, credentials, { context, auditLogData, phase }) => {
  const { dataSubject, attributes, auditObject, diff, user, tenant } = auditLogData
  return new Promise((resolve, reject) => {
    auditLogger.v2(credentials, function (err, auditlog) {
      if (err) {
        return reject(getAuditLogNotWrittenError(err, phase))
      }

      try {
        let log = auditlog.update({
          type: auditObject.type,
          id: { key: _keysToString(auditObject.keys) }
        })

        for (const difference of diff) {
          if (attributes[difference.name]) {
            log = log.attribute(Object.assign({ new: 'null', old: 'null' }, difference))
          }
        }

        log = log.dataSubject({
          type: dataSubject.type,
          id: dataSubject.keys,
          role: dataSubject.role
        })

        log = tenant ? log.tenant(tenant) : log

        log = log.by(user)

        log.logPrepare(function (err) {
          if (err) {
            return reject(getAuditLogNotWrittenError(err, phase))
          }
          context._.auditLogContinuation = log
          resolve()
        })
      } catch (err) {
        return reject(getAuditLogNotWrittenError(err, phase))
      }
    })
  })
}

/**
 * Initializes the audit log object.
 * If options.auditlog provided, it looks via xsenv for a configured audit log instance.
 * If not, logs the audit events to the logger object (if provided via options, if not to console).
 * @param {Object} auditlog - the service options
 * @param {Object} logger - the logger object
 * @returns {Object} - with convenience methods logUnauthorized and logMissingPermissions to write audit logs
 */
const initialize = (auditlog, logger) => {
  let auditLogConfig = _getCredentials(auditlog)
  try {
    const auditLogger = require('@sap/audit-logging')
    if (!auditLogConfig) {
      auditLogConfig = { logToConsole: true }
    }

    return {
      logDataChange: info => {
        return _logDataChange(auditLogger, auditLogConfig, info)
      },
      logReadAccess: info => {
        return _logReadAccess(auditLogger, auditLogConfig, info)
      },
      logUnauthorized: info => {
        return _logUnauthorized(auditLogger, auditLogConfig, logger, info)
      },
      logMissingPermissions: info => {
        return _logMissingPermissions(auditLogger, auditLogConfig, logger, info)
      }
    }
  } catch (err) {
    if (auditLogConfig) {
      // this should crash the app if audit log was defined in VCAP and module could not be loaded
      setImmediate(() => {
        throw err
      })
    }

    return {
      logDataChange: info => {
        logger.log(info)
        return Promise.resolve()
      },
      logReadAccess: info => {
        logger.log(info)
        return Promise.resolve()
      },
      logUnauthorized: logger.warn,
      logMissingPermissions: logger.warn
    }
  }
}

module.exports = initialize
