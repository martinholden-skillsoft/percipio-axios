const { PercipioAxiosClient } = require('./percipio-axios-client');

/**
 * An Axios Client that provides a consistent approach
 * for making Percipio Content Discovery Service requests.
 * @category Percipio Client
 */
class PercipioAxiosContentDiscoveryServiceClient extends PercipioAxiosClient {
  constructor(options) {
    super(options);

    this.description = 'Calls the Content Discovery Service API.';
  }
  /**
   * Type Definitions
   */

  /**
   * Represents a CreateShareLinkBody object
   * @typedef {object} CreateShareLinkBody
   * @property {string} [localeCode] - Locale code value that need to be saved and sent back wh
   * ile launching the sharelink
   *
   */

  /**
   * Relative URL used to create share link
   * @typedef {object} Url
   * @property {string} [path] - Percipio URL for which share link should be created
   *
   */

  /**
   * Returns licensed content associated with an organization with metadata sufficient to popul
   * ate courses into a catalog
   *
   * @param {Object} config  - Configuration object for request
   * @property {Object} [config.params={}] - The params to send with the request, any unsupport
   * ed params will be silently ignored.
   * @property {string} [config.params.transformName] - Value to identify a transform that will
   *  map Percipio data into a client specific format
   * @property {string} [config.params.updatedSince] - Filter criteria that returns catalog con
   * tent changes since the date specified in GMT with an ISO format.  Items will be included i
   * n the response if the content metadata has changed since the date specified but may also b
   * e included if there have been configuration changes that have increased or decreased the n
   * umber of content items that the organization has access to.
   * @property {integer} [config.params.offset=0] - Used in conjunction with 'max' to specify w
   * hich set of 'max' content items should be returned. The default is 0 which returns 1 throu
   * gh max content items. If offset is sent as 1, then content items 2 through max+1 are retur
   * ned.
   * @property {integer} [config.params.max=1000] - The maximum number of content items to retu
   * rn in a response. The default is 1000. Valid values are between 1 and 1000.
   * @property {string} [config.params.pagingRequestId] - Used to access the unique dataset to
   * be split among pages of results
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosContentDiscoveryServiceClient
   */
  getCatalogContentV2({ params = {}, ...other }) {
    const resourceToUse = '/content-discovery/v2/organizations/{orgId}/catalog-content';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, data, extraPlaceholders, ...rest } = other;
    // Remove unsupported params, and ensure default params are set.
    const paramsToUse = (({
      transformName,
      updatedSince,
      offset = 0,
      max = 1000,
      pagingRequestId,
    }) => ({ transformName, updatedSince, offset, max, pagingRequestId }))(params);

    return this.get({ resource: resourceToUse, params: paramsToUse, ...rest });
  }

  /**
   * Returns licensed content associated with an organization with metadata sufficient to imple
   * ment a federated search
   *
   * @param {Object} config  - Configuration object for request
   * @property {Object} [config.params={}] - The params to send with the request, any unsupport
   * ed params will be silently ignored.
   * @property {string} config.params.q - The search query
   * @property {string} [config.params.localeCode] - Locale expressed as RFC 5646 language tag
   * (such as 'en', 'fr', 'pt-BR', etc.).  Defaults to 'en' if not provided.
   * @property {array} [config.params.typeFilter] - Array of types to restrict filter results w
   * ith
   * @property {array} [config.params.modality] - Modality for filtering results
   * @property {array} [config.params.expertiseLevel] - Expertise Level for filtering results
   * @property {array} [config.params.licensePoolIds] - Array of License pool IDs to which to r
   * estrict content.
   * @property {integer} [config.params.offset=0] - Used in conjunction with 'max' to specify w
   * hich set of 'max' content items should be returned. The default is 0 which returns 1 throu
   * gh max content items. If offset is sent as 1, then content items 2 through max+1 are retur
   * ned.
   * @property {integer} [config.params.max=25] - The maximum number of content items to return
   *  in a response. The default is 25. Valid values are between 1 and 1000.
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosContentDiscoveryServiceClient
   */
  getSearchContent({ params = {}, ...other }) {
    const resourceToUse = '/content-discovery/v1/organizations/{orgId}/search-content';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, data, extraPlaceholders, ...rest } = other;
    // Remove unsupported params, and ensure default params are set.
    const paramsToUse = (({
      q,
      localeCode,
      typeFilter,
      modality,
      expertiseLevel,
      licensePoolIds,
      offset = 0,
      max = 25,
    }) => ({ q, localeCode, typeFilter, modality, expertiseLevel, licensePoolIds, offset, max }))(
      params
    );

    return this.get({ resource: resourceToUse, params: paramsToUse, ...rest });
  }

  /**
   * Returns the catalog structure for licensed content associated with an organization
   *
   * @param {Object} config  - Configuration object for request
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosContentDiscoveryServiceClient
   */
  getCatalogStructure({ ...other }) {
    const resourceToUse = '/content-discovery/v1/organizations/{orgId}/catalog-structure';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, data, params, extraPlaceholders, ...rest } = other;
    return this.get({ resource: resourceToUse, ...rest });
  }

  /**
   * Creates shareable link for specified organization and content
   *
   * @param {Object} config  - Configuration object for request
   * @property {Object} [config.extraPlaceholders={}] - Additional placeholders to replace in r
   * esource path
   * @property {string} config.extraPlaceholders.contentId - Content UUID
   * @property {CreateShareLinkBody} [config.data={}] - The request body to be sent to the API
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosContentDiscoveryServiceClient
   */
  createShareableLinkForOrg({ extraPlaceholders = {}, data = {}, ...other }) {
    const resourceToUse =
      '/content-discovery/v1/organizations/{orgId}/content/{contentId}/share-link';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, params, ...rest } = other;
    return this.post({ resource: resourceToUse, extraPlaceholders, data, ...rest });
  }

  /**
   * Creates shareable link for specified organization, content and user
   *
   * @param {Object} config  - Configuration object for request
   * @property {Object} [config.extraPlaceholders={}] - Additional placeholders to replace in r
   * esource path
   * @property {string} config.extraPlaceholders.userId - User UUID
   * @property {string} config.extraPlaceholders.contentId - Content UUID
   * @property {CreateShareLinkBody} [config.data={}] - The request body to be sent to the API
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosContentDiscoveryServiceClient
   */
  createShareableLinkForUser({ extraPlaceholders = {}, data = {}, ...other }) {
    const resourceToUse =
      '/content-discovery/v1/organizations/{orgId}/users/{userId}/content/{contentId}/share-link';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, params, ...rest } = other;
    return this.post({ resource: resourceToUse, extraPlaceholders, data, ...rest });
  }

  /**
   * Creates shareable link for Percipio url for an organization
   *
   * @param {Object} config  - Configuration object for request
   * @property {Url} [config.data={}] - The request body to be sent to the API
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosContentDiscoveryServiceClient
   */
  createShareableLinkForUrlWithOrg({ data = {}, ...other }) {
    const resourceToUse = '/content-discovery/v1/organizations/{orgId}/share-link/url';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, params, extraPlaceholders, ...rest } = other;
    return this.post({ resource: resourceToUse, data, ...rest });
  }

  /**
   * Creates shareable link for Percipio url for an organization and user
   *
   * @param {Object} config  - Configuration object for request
   * @property {Object} [config.extraPlaceholders={}] - Additional placeholders to replace in r
   * esource path
   * @property {string} config.extraPlaceholders.userId - User UUID
   * @property {Url} [config.data={}] - The request body to be sent to the API
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosContentDiscoveryServiceClient
   */
  createShareableLinkForUrlWithUser({ extraPlaceholders = {}, data = {}, ...other }) {
    const resourceToUse =
      '/content-discovery/v1/organizations/{orgId}/users/{userId}/share-link/url';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, params, ...rest } = other;
    return this.post({ resource: resourceToUse, extraPlaceholders, data, ...rest });
  }

  /**
   * Returns licensed Compliance content associated with an organization with metadata sufficie
   * nt to populate courses into a catalog
   *
   * @param {Object} config  - Configuration object for request
   * @property {Object} [config.params={}] - The params to send with the request, any unsupport
   * ed params will be silently ignored.
   * @property {integer} [config.params.offset=0] - Used in conjunction with 'max' to specify w
   * hich set of 'max' content items should be returned. The default is 0 which returns 1 throu
   * gh max content items. If offset is sent as 1, then content items 2 through max+1 are retur
   * ned.
   * @property {integer} [config.params.max=1000] - The maximum number of content items to retu
   * rn in a response. The default is 1000. Valid values are between 1 and 1000.
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosContentDiscoveryServiceClient
   */
  getComplianceContent({ params = {}, ...other }) {
    const resourceToUse = '/content-discovery/v1/organizations/{orgId}/compliance-content';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, data, extraPlaceholders, ...rest } = other;
    // Remove unsupported params, and ensure default params are set.
    const paramsToUse = (({ offset = 0, max = 1000 }) => ({ offset, max }))(params);

    return this.get({ resource: resourceToUse, params: paramsToUse, ...rest });
  }
}

module.exports = { PercipioAxiosContentDiscoveryServiceClient };
