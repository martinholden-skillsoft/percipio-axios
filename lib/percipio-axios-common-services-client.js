const { PercipioAxiosClient } = require('./percipio-axios-client');

/**
 * An Axios Client that provides a consistent approach
 * for making Percipio Common Services requests.
 * @category Percipio Client
 */
class PercipioAxiosCommonServicesClient extends PercipioAxiosClient {
  constructor(options) {
    super(options);

    this.description = 'Calls the Common Services API.';
  }

  /**
   * Returns all the collections licensed by an organization.
   *
   * @param {Object} config  - Configuration object for request
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosCommonServicesClient
   */
  getCollections({ ...other }) {
    const resourceToUse = '/common/v1/organizations/{orgId}/collections';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, data, params, extraPlaceholders, ...rest } = other;
    return this.get({ resource: resourceToUse, ...rest });
  }

  /**
   * Returns the list of custom attributes associated with the organization.
   *
   * @param {Object} config  - Configuration object for request
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosCommonServicesClient
   */
  getCustomAttributes({ ...other }) {
    const resourceToUse = '/common/v1/organizations/{orgId}/custom-attributes';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, data, params, extraPlaceholders, ...rest } = other;
    return this.get({ resource: resourceToUse, ...rest });
  }

  /**
   * Returns all the license pools associated with an organization.
   *
   * @param {Object} config  - Configuration object for request
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosCommonServicesClient
   */
  getLicensePoolsV1({ ...other }) {
    const resourceToUse = '/common/v1/organizations/{orgId}/license-pools';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, data, params, extraPlaceholders, ...rest } = other;
    return this.get({ resource: resourceToUse, ...rest });
  }

  /**
   * Returns the entire list of audiences defined for an organization.
   *
   * @param {Object} config  - Configuration object for request
   * @property {Object} [config.params={}] - The params to send with the request, any unsupport
   * ed params will be silently ignored.
   * @property {integer} [config.params.offset=0] - Used in conjunction with 'max' to specify w
   * hich set of 'max' audiences should be returned.  The default is 0 which returns 1 through
   * max audiences.  If offset is sent as 1, then audiences 2 through max+1 are returned.
   * @property {integer} [config.params.max=1000] - The maximum number of audiences to return i
   * n a response.  The default is 1000.  Valid values are between 1 and 1000.
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosCommonServicesClient
   */
  fetchAudiences({ params = {}, ...other }) {
    const resourceToUse = '/common/v2/organizations/{orgId}/audiences';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, data, extraPlaceholders, ...rest } = other;
    // Remove unsupported params, and ensure default params are set.
    const paramsToUse = (({ offset = 0, max = 1000 }) => ({ offset, max }))(params);

    return this.get({ resource: resourceToUse, params: paramsToUse, ...rest });
  }
}

module.exports = { PercipioAxiosCommonServicesClient };
