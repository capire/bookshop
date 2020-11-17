const _removeMultipleBrackets = (index, whereCondition) => {
  let resIndex = index
  if (whereCondition[index - 1] === '(') {
    while (resIndex - 2 >= 0 && whereCondition[resIndex - 2] === '(') {
      const indexClose = whereCondition.findIndex((element, elementIndex) => element === ')' && elementIndex > index)

      if (whereCondition[indexClose + 1] === ')') {
        whereCondition.splice(indexClose + 1, 1)
        whereCondition.splice(resIndex - 2, 1)
        resIndex--
      } else {
        break
      }
    }
  }

  return resIndex
}

const _calculateSpliceArgs = (index, whereCondition) => {
  const AND_OR = ['and', 'or']
  if (AND_OR.includes(whereCondition[index - 1])) {
    return { index: index - 1, count: 4 }
  }
  if (AND_OR.includes(whereCondition[index + 3])) {
    return { index: index, count: 4 }
  }
  if (whereCondition[index - 1] === '(' && whereCondition[index + 3] === ')') {
    if (AND_OR.includes(whereCondition[index - 2])) {
      return { index: index - 2, count: 6 }
    }
    if (AND_OR.includes(whereCondition[index + 4])) {
      return { index: index - 1, count: 6 }
    }

    return { index: index - 1, count: 5 }
  }
  return { index: index, count: 3 }
}

const _isActiveEntity = entry => entry.ref && entry.ref[entry.ref.length - 1] === 'IsActiveEntity'

const _removeIsActiveEntityCondition = where => {
  const newWhere = []
  const length = where.length
  let i = 0

  while (i < length) {
    if (_isActiveEntity(where[i])) {
      i = i + 3
    } else if (where[i] === 'and' && _isActiveEntity(where[i + 1])) {
      i = i + 4
    } else if (where[i] === 'and' && where[i + 1] === '(' && _isActiveEntity(where[i + 2])) {
      i = i + 6
    } else {
      newWhere.push(where[i])
      i++
    }
  }

  if (newWhere[0] === 'and') {
    newWhere.splice(0, 1)
  } else if (newWhere[0] === '(' && newWhere[1] === 'and') {
    newWhere.splice(0, 2)
  }

  return newWhere
}

const _isKeyValue = (i, keys, where) => {
  if (!where[i].ref || !keys.includes(where[i].ref[0])) {
    return false
  }

  return where[i + 1] === '=' && 'val' in where[i + 2]
}

const deleteCondition = (index, whereCondition) => {
  index = _removeMultipleBrackets(index, whereCondition)
  const spliceArgs = _calculateSpliceArgs(index, whereCondition)
  whereCondition.splice(spliceArgs.index, spliceArgs.count)
}

const readAndDeleteKeywords = (keywords, whereCondition, toDelete = true) => {
  let index = whereCondition.findIndex(({ ref }) => {
    if (!ref) {
      return false
    }

    const refLastIndex = ref.length - 1

    if (keywords.length === 1) {
      return ref[refLastIndex] === keywords[0]
    }

    if (keywords.length === 2 && ref.length >= 2) {
      return ref[refLastIndex - 1] === keywords[0] && ref[refLastIndex] === keywords[1]
    }
  })

  if (index === -1) {
    return
  }

  const result = {
    op: whereCondition[index + 1],
    value: whereCondition[index + 2]
  }

  if (toDelete) {
    if (keywords[0] === 'DraftAdministrativeData' && keywords[1] === 'InProcessByUser' && result.op === '!=') {
      // Here, the OData query 'column NE something' was replaced by '(column != something or column is null)
      whereCondition.splice(index - 1, 1)
      whereCondition.splice(index + 2, 4)
      index = index - 1
    }
    deleteCondition(index, whereCondition)
  }

  return result
}

const removeIsActiveEntityRecursively = where => {
  for (const entry of where) {
    if (entry.SELECT && entry.SELECT.where && entry.SELECT.from.ref && !entry.SELECT.from.ref[0].endsWith('_drafts')) {
      entry.SELECT.where = _removeIsActiveEntityCondition(entry.SELECT.where)

      if (entry.SELECT.where.length === 0) {
        delete entry.SELECT.where
      }
    }
  }

  return _removeIsActiveEntityCondition(where)
}

const isActiveEntityRequested = where => {
  let i = 0

  while (where[i]) {
    if (
      where[i].ref &&
      where[i].ref[where[i].ref.length - 1] === 'IsActiveEntity' &&
      where[i + 1] === '=' &&
      'val' in where[i + 2]
    ) {
      return where[i + 2].val === 'true' || where[i + 2].val === true
    }
    i++
  }

  return true
}

const getKeyData = (keys, where) => {
  if (!where) {
    return {}
  }

  const data = {}
  let i = 0

  while (where[i]) {
    if (_isKeyValue(i, keys, where)) {
      data[where[i].ref[0]] = where[i + 2].val
      i = i + 3
    } else {
      i++
    }
  }

  return data
}

const extractKeyConditions = whereCondition => {
  const result = {
    keyList: []
  }

  const newWhere = [...whereCondition]
  const readKeywords = readAndDeleteKeywords(['IsActiveEntity'], newWhere)
  result.IsActiveEntity = readKeywords && readKeywords.value && readKeywords.value.val !== false
  result.keyList = newWhere

  return result
}

module.exports = {
  deleteCondition,
  readAndDeleteKeywords,
  removeIsActiveEntityRecursively,
  isActiveEntityRequested,
  getKeyData,
  extractKeyConditions
}
