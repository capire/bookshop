const _asyncReturn = returned => {
  if (returned && returned.then) {
    return returned
  }

  return resolvedThenable(returned)
}

const rejectedThenable = err => {
  return {
    then (resolve, reject) {
      try {
        return reject ? _asyncReturn(reject(err)) : this
      } catch (e) {
        return rejectedThenable(e)
      }
    },
    catch (reject) {
      try {
        return reject ? _asyncReturn(reject(err)) : this
      } catch (e) {
        return rejectedThenable(e)
      }
    }
  }
}

const resolvedThenable = value => {
  return {
    then (resolve) {
      try {
        return _asyncReturn(resolve(value))
      } catch (err) {
        return rejectedThenable(err)
      }
    },
    catch () {
      return this
    }
  }
}

const all = arr => {
  return arr.length ? Promise.all(arr) : resolvedThenable([])
}

module.exports = {
  reject: rejectedThenable,
  resolve: resolvedThenable,
  all: all
}
