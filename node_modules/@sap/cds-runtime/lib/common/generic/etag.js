const uuid = require('../utils/uuid')

const {
  ql: { SELECT }
} = global.cds || require('@sap/cds/lib')

// REVISIT: draft should not be handled here, e.g., target.name should be adjusted before
const { isDraftEnabled } = require('../utils/draft')
const {
  isActiveEntityRequested,
  removeIsActiveEntityRecursively
} = require('../../cds-services/services/utils/draftWhereUtils')
const { ensureDraftsSuffix } = require('../../cds-services/services/utils/draftUtils')
const cqn2cqn4sql = require('../../common/utils/cqn2cqn4sql')

const _getETagElement = target => Object.values(target.elements).find(element => element['@odata.etag'])

const getSelectCQN = (query, target, model) => {
  // REVISIT DRAFT HANDLING: this function is a hack until we solve drafts properly
  let requestTarget
  if (query.SELECT) {
    requestTarget = query.SELECT.from
  } else if (query.UPDATE) {
    requestTarget = query.UPDATE.entity
  } else {
    requestTarget = query.DELETE.from
  }
  const cqn = cqn2cqn4sql(SELECT.from(requestTarget), model)
  cqn.SELECT.from.ref[0] = isActiveEntityRequested(cqn.SELECT.where) ? target.name : ensureDraftsSuffix(target.name)
  cqn.columns([_getETagElement(target).name])
  cqn.SELECT.where = removeIsActiveEntityRecursively(cqn.SELECT.where)

  return cqn
}

/**
 * Generic handler for @odata.etag-enabled entities
 */
const _handler = async req => {
  if (req._.odataReq && req._.odataReq.getConcurrentResource() !== null) {
    const etagElement = _getETagElement(req.target)

    // validate
    if (req._.odataReq.isConditional() && !req.query.INSERT) {
      const result = await req.run(getSelectCQN(req.query, req.target, req[Symbol.for('sap.cds.model')]))

      if (result.length === 1) {
        req._.odataReq.validateEtag(Object.values(result[0])[0])
      } else {
        req._.odataReq.validateEtag('*')
      }
    }

    // generate new etag, if UUID
    if (['CREATE', 'UPDATE'].includes(req.event) && etagElement.type === 'cds.UUID') {
      req.data[etagElement.name] = uuid()
    }
  }
}

/*
 * handler registration
 */
/* istanbul ignore next */
module.exports = function () {
  _handler._initial = true

  for (const k in this.entities) {
    const entity = this.entities[k]

    if (!Object.values(entity.elements).some(ele => ele['@odata.etag'])) {
      // entity not @odata.etag-enabled
      continue
    }

    // Handler for CREATE is registered for backwards compatiblity w.r.t. ETag generation
    let events = ['CREATE', 'READ', 'UPDATE', 'DELETE']
    // if odata and fiori is separated, this will not be needed in the odata version
    if (isDraftEnabled(entity)) {
      events = ['READ', 'NEW', 'DELETE', 'PATCH', 'EDIT', 'CANCEL']
    }

    this.before(events, entity, _handler)

    for (const action in entity.actions) {
      this.before(action, entity, _handler)
    }
  }
}

/*
 * export handler for use in old stack
 */
module.exports.handler = _handler
