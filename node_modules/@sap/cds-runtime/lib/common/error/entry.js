/**
 * @param {number} [code] - The numeric code. Only if typeof msg === 'string'.
 * @param {string|object} msg - The message or text key (string), or entry object (if more details are needed)
 * @param {number|string} [msg.code] - The numeric or text code.
 * @param {string} [msg.message] - The message or text key.
 * @param {string} [msg.target] - The target of the message.
 * @param {Array|object} [msg.args] - The placeholder values for messages with placeholders.
 * @param {any} [msg.<key>] - Additonal properties, e.g., for processing in custom logging (will not reach client).
 * @param {string} [target] - The target of the message. Only if typeof msg === 'string'.
 * @param {Array|object} [args] - The placeholder values for messages with placeholders. Only if typeof msg === 'string'.
 * @returns {object} - The normalized entry
 */
module.exports = (code, msg, target, args) => {
  if (typeof code === 'object') {
    // > params: msg
    return code
  }

  // sort out params
  if (typeof code !== 'number') {
    // > params: msg, target?, args?
    ;[code, msg, target, args] = [undefined, code, msg, target]
  }
  if (target && typeof target === 'object') {
    // > params: code?, msg, args?
    ;[args, target] = [target]
  }

  return { code, message: msg || (code && String(code)), target, args }
}
