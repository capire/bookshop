/* istanbul ignore file */
// REVISIT: remove istanbul ignore once re-enabled

const { getAuditLogNotWrittenError } = require('../../util/errors')
const getColumns = require('./columns')
const { all } = require('../../../common/utils/thenable')
const eventMap = new Map([
  ['CREATE', '@AuditLog.Operation.Insert'],
  ['READ', '@AuditLog.Operation.Read'],
  ['UPDATE', '@AuditLog.Operation.Update'],
  ['DELETE', '@AuditLog.Operation.Delete']
])

const { ensureNoDraftsSuffix } = require('./draftUtils')

/**
 * Checks if entity has annotation '@PersonalData.EntitySemantics' and value is either 'DataSubject' or
 * 'DataSubjectDetails'.
 * @param entity
 * @returns {boolean}
 * @private
 */
const isPersonalDataRelevant = entity => {
  const allowedAnnotations = ['DataSubject', 'DataSubjectDetails']
  return entity['@PersonalData.EntitySemantics'] && allowedAnnotations.includes(entity['@PersonalData.EntitySemantics'])
}

const isRelevantOperation = (event, entity) => {
  return entity[eventMap.get(event)]
}

const _relevantColumns = target => {
  const columns = getColumns(target)

  const relevantColumns = {
    keys: {},
    sensitive: {},
    fieldSemantics: {
      keys: {}
    }
  }

  for (const column of columns) {
    if (column.key) {
      relevantColumns.keys[column.name] = column
    }

    if (column['@PersonalData.FieldSemantics']) {
      switch (column['@PersonalData.FieldSemantics']) {
        case 'DataSubjectRole':
          relevantColumns.fieldSemantics.role = column
          break
        case 'DataSubjectType':
          relevantColumns.fieldSemantics.type = column
          break
        case 'DataSubjectId':
          relevantColumns.fieldSemantics.keys[column.name] = column
          break
      }
    }

    if (column['@PersonalData.IsSensitive']) {
      relevantColumns.sensitive[column.name] = column
    }
  }

  return relevantColumns
}

const _isRelevantAttribute = (context, row, attribute) => {
  if (context.event === 'UPDATE') {
    return context.diff.some(d => d.name === attribute)
  }

  // no audit logging for creating, reading, deleting sensitive fields which are not set
  return row[attribute] !== null
}

const _getAuditLogData = (context, columns, row) => {
  const auditLogData = {
    attributes: {},
    dataSubject: {
      keys: {}
    },
    diff: context.diff,
    auditObject: {
      type: ensureNoDraftsSuffix(context.target.name),
      keys: {}
    },
    tenant: context.user.tenant || 'unknown',
    user: context.user.id
  }
  const properties = Object.keys(row)

  for (const property of properties) {
    if (columns.keys[property]) {
      auditLogData.auditObject.keys[property] = row[property].toString()
    }

    if (columns.sensitive[property] && _isRelevantAttribute(context, row, property)) {
      auditLogData.attributes[property] = row[property]
    }
  }

  if (context.target['@PersonalData.EntitySemantics'] === 'DataSubject') {
    auditLogData.dataSubject.type = ensureNoDraftsSuffix(context.target.name)
    auditLogData.dataSubject.keys = auditLogData.auditObject.keys
  } else {
    auditLogData.dataSubject.type = row[columns.fieldSemantics.type.name]
    auditLogData.dataSubject.role = row[columns.fieldSemantics.role.name]

    const fieldSemanticsKeys = Object.keys(columns.fieldSemantics.keys)

    for (const key of fieldSemanticsKeys) {
      auditLogData.dataSubject.keys[key] = row[key].toString()
    }
  }

  return auditLogData
}

const logReadAccess = (auditLogger, context) => {
  let auditLogData

  const promises = []
  const relevantColumns = _relevantColumns(context.target)

  for (const row of context.result) {
    auditLogData = _getAuditLogData(context, relevantColumns, row)
    if (Object.keys(auditLogData.attributes).length > 0) {
      promises.push(auditLogger.logReadAccess(auditLogData))
    }
  }

  return all(promises)
}

const logDataChange = (auditLogger, context, phase) => {
  const relevantColumns = _relevantColumns(context.target)

  const auditLogData = _getAuditLogData(context, relevantColumns, context.oldData || context.data)
  if (Object.keys(auditLogData.attributes).length > 0) {
    return auditLogger.logDataChange({
      context,
      auditLogData,
      phase: phase
    })
  }
}

const callAuditLogContinuation = (context, phase) => {
  return new Promise((resolve, reject) => {
    const status = phase === 'after commit' && context.success ? 'logSuccess' : 'logFailure'
    context._.auditLogContinuation[status](err => {
      if (err) {
        return reject(getAuditLogNotWrittenError(err, phase))
      }

      resolve()
    })
  })
}

module.exports = { callAuditLogContinuation, isPersonalDataRelevant, isRelevantOperation, logDataChange, logReadAccess }
