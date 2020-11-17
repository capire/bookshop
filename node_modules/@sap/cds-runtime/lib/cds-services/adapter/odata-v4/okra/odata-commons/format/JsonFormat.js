'use strict'

/**
 * Stores information specific to the JSON format.
 */
class JsonFormat {}
/**
 * Annotations
 *
 * @enum {string}
 * @readonly
 */
JsonFormat.Annotations = {
  CONTEXT: '@odata.context',
  COUNT: '@odata.count',
  ETAG: '@odata.etag',
  METADATA_ETAG: '@odata.metadataEtag',
  BIND: '@odata.bind',
  ID: '@odata.id',
  DELTA: '@odata.delta',
  REMOVED: '@odata.removed',
  TYPE: '@odata.type',
  NEXT_LINK: '@odata.nextLink',
  DELTA_LINK: '@odata.deltaLink',
  EDIT_LINK: '@odata.editLink',
  READ_LINK: '@odata.readLink',
  NAVIGATION_LINK: '@odata.navigationLink',
  ASSOCIATION_LINK: '@odata.associationLink',
  MEDIA_EDIT_LINK: '@odata.mediaEditLink',
  MEDIA_READ_LINK: '@odata.mediaReadLink',
  MEDIA_CONTENT_TYPE: '@odata.mediaContentType',
  MEDIA_ETAG: '@odata.mediaEtag',
  getMetaProperty (annotation) {
    switch (annotation) {
      case JsonFormat.Annotations.CONTEXT:
        return JsonFormat.MetaProperties.CONTEXT
      case JsonFormat.Annotations.COUNT:
        return JsonFormat.MetaProperties.COUNT
      case JsonFormat.Annotations.ETAG:
        return JsonFormat.MetaProperties.ETAG
      case JsonFormat.Annotations.METADATA_ETAG:
        return JsonFormat.MetaProperties.METADATA_ETAG
      case JsonFormat.Annotations.BIND:
        return JsonFormat.MetaProperties.BIND
      case JsonFormat.Annotations.ID:
        return JsonFormat.MetaProperties.ID
      case JsonFormat.Annotations.TYPE:
        return JsonFormat.MetaProperties.TYPE
      case JsonFormat.Annotations.NEXT_LINK:
        return JsonFormat.MetaProperties.NEXT_LINK
      case JsonFormat.Annotations.DELTA_LINK:
        return JsonFormat.MetaProperties.DELTA_LINK
      case JsonFormat.Annotations.EDIT_LINK:
        return JsonFormat.MetaProperties.EDIT_LINK
      case JsonFormat.Annotations.READ_LINK:
        return JsonFormat.MetaProperties.READ_LINK
      case JsonFormat.Annotations.NAVIGATION_LINK:
        return JsonFormat.MetaProperties.NAVIGATION_LINK
      case JsonFormat.Annotations.ASSOCIATION_LINK:
        return JsonFormat.MetaProperties.ASSOCIATION_LINK
      case JsonFormat.Annotations.MEDIA_EDIT_LINK:
        return JsonFormat.MetaProperties.MEDIA_EDIT_LINK
      case JsonFormat.Annotations.MEDIA_READ_LINK:
        return JsonFormat.MetaProperties.MEDIA_READ_LINK
      case JsonFormat.Annotations.MEDIA_CONTENT_TYPE:
        return JsonFormat.MetaProperties.MEDIA_CONTENT_TYPE
      case JsonFormat.Annotations.MEDIA_ETAG:
        return JsonFormat.MetaProperties.MEDIA_ETAG
      default:
        return null
    }
  }
}

/**
 * Internal meta properties
 *
 * @enum {string}
 * @readonly
 */
JsonFormat.MetaProperties = {
  CONTEXT: '*@odata.context',
  COUNT: '*@odata.count',
  ETAG: '*@odata.etag',
  METADATA_ETAG: '*@odata.metadataEtag',
  BIND: '*@odata.bind',
  ID: '*@odata.id',
  TYPE: '*@odata.type',
  NEXT_LINK: '*@odata.nextLink',
  DELTA_LINK: '*@odata.deltaLink',
  EDIT_LINK: '*@odata.editLink',
  READ_LINK: '*@odata.readLink',
  NAVIGATION_LINK: '*@odata.navigationLink',
  ASSOCIATION_LINK: '*@odata.associationLink',
  MEDIA_EDIT_LINK: '*@odata.mediaEditLink',
  MEDIA_READ_LINK: '*@odata.mediaReadLink',
  MEDIA_CONTENT_TYPE: '*@odata.mediaContentType',
  MEDIA_ETAG: '*@odata.mediaEtag',
  getAnnotation (metaProperty) {
    switch (metaProperty) {
      case JsonFormat.MetaProperties.CONTEXT:
        return JsonFormat.Annotations.CONTEXT
      case JsonFormat.MetaProperties.COUNT:
        return JsonFormat.Annotations.COUNT
      case JsonFormat.MetaProperties.ETAG:
        return JsonFormat.Annotations.ETAG
      case JsonFormat.MetaProperties.METADATA_ETAG:
        return JsonFormat.Annotations.METADATA_ETAG
      case JsonFormat.MetaProperties.BIND:
        return JsonFormat.Annotations.BIND
      case JsonFormat.MetaProperties.ID:
        return JsonFormat.Annotations.ID
      case JsonFormat.MetaProperties.TYPE:
        return JsonFormat.Annotations.TYPE
      case JsonFormat.MetaProperties.NEXT_LINK:
        return JsonFormat.Annotations.NEXT_LINK
      case JsonFormat.MetaProperties.DELTA_LINK:
        return JsonFormat.Annotations.DELTA_LINK
      case JsonFormat.MetaProperties.EDIT_LINK:
        return JsonFormat.Annotations.EDIT_LINK
      case JsonFormat.MetaProperties.READ_LINK:
        return JsonFormat.Annotations.READ_LINK
      case JsonFormat.MetaProperties.NAVIGATION_LINK:
        return JsonFormat.Annotations.NAVIGATION_LINK
      case JsonFormat.MetaProperties.ASSOCIATION_LINK:
        return JsonFormat.Annotations.ASSOCIATION_LINK
      case JsonFormat.MetaProperties.MEDIA_EDIT_LINK:
        return JsonFormat.Annotations.MEDIA_EDIT_LINK
      case JsonFormat.MetaProperties.MEDIA_READ_LINK:
        return JsonFormat.Annotations.MEDIA_READ_LINK
      case JsonFormat.MetaProperties.MEDIA_CONTENT_TYPE:
        return JsonFormat.Annotations.MEDIA_CONTENT_TYPE
      case JsonFormat.MetaProperties.MEDIA_ETAG:
        return JsonFormat.Annotations.MEDIA_ETAG
      default:
        return null
    }
  }
}

module.exports = JsonFormat
