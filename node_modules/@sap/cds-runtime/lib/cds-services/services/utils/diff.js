/* istanbul ignore file */

// REVISIT: probably needed for personal data handling

const _getDiff = (data, status) => {
  const diffs = []

  for (const key of Object.keys(data)) {
    if (!key.startsWith('*@odata.')) {
      diffs.push({ name: key, [status]: data[key] })
    }
  }

  return diffs
}

const _getDiffForUpdate = (oldData, newData) => {
  const diffs = []

  // Diff added if field in newData is not present or has a different value in oldData.
  // No diff added if a field is not present in newData.
  for (const key of Object.keys(newData)) {
    if (!key.startsWith('*@odata.') && oldData[key] !== newData[key]) {
      diffs.push({ name: key, old: oldData[key], new: newData[key] })
    }
  }

  return diffs
}

/**
 * Compare to objects on first level.
 * Returns a list of changes like {name: 'key', old: 'val', new: 'val'}
 * @param {String} event
 * @param {Object} oldData
 * @param {Object} newData
 * @returns {Array}
 */
const diff = (event, oldData = {}, newData = {}) => {
  switch (event) {
    case 'CREATE':
      return _getDiff(newData, 'new')
    case 'UPDATE':
      return _getDiffForUpdate(oldData, newData)
    case 'DELETE':
      return _getDiff(oldData, 'old')
    default:
      return []
  }
}

module.exports = diff
