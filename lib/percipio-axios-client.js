const { v4: uuidv4, validate: uuidValidate } = require('uuid');
const jwtdecode = require('jwt-decode');
const validUrl = require('valid-url');
const _ = require('lodash');

const errors = require('./errors');
const axiosExtras = require('./axiosextras');

/**
 * An Axios Client that provides a consistent approach for making Percipio API requests.
 * @category Percipio Client
 */
class PercipioAxiosClient {
  /**
   * Creates an instance of PercipioAxiosClient.
   * @param {Object} configuration - The configuration
   * @param {String} configuration.baseURL - The base URL for the API
   * @param {String} configuration.orgId - The organization ID
   * @param {String} configuration.bearer - The bearer token
   * @param {Object} [configuration.instance] - The Axios instance to use,
   *  defaults to using {@link createAxiosInstance}.
   * @param {Object} [configuration.resourcePlaceholders={orgId: configuration.orgId}]
   *   Used to replace placeholders in the resource path.
   * @throws {PropertyRequiredError} baseURL is a required configuration property
   * @throws {PropertyInvalidError} baseURL is invalid, it must be a valid https URL
   * @throws {PropertyRequiredError} orgId is a required configuration property
   * @throws {PropertyInvalidError} orgId is invalid, it must be a uuid
   * @throws {PropertyRequiredError} bearer is a required configuration property
   * @throws {PropertyInvalidError} bearer is invalid, it must be a JWT
   * @throws {PropertyInvalidError} instance is invalid, it must be an instance of Axios
   * @memberof PercipioAxiosClient
   */
  constructor(configuration = {}) {
    this.configuration = _.merge({ resourcePlaceholders: {} }, _.cloneDeep(configuration));

    if (!('baseURL' in this.configuration)) {
      throw new errors.PropertyRequiredError('baseURL is a required configuration property');
    }

    if (!validUrl.isHttpsUri(this.configuration.baseURL)) {
      throw new errors.PropertyInvalidError('baseURL is invalid, it must be a valid https URL');
    }

    if (!('orgId' in this.configuration)) {
      throw new errors.PropertyRequiredError('orgId is a required configuration property');
    }

    if (!uuidValidate(this.configuration.orgId)) {
      throw new errors.PropertyInvalidError('orgId is invalid, it must be a uuid');
    }

    if (!('bearer' in this.configuration)) {
      throw new errors.PropertyRequiredError('bearer is a required configuration property');
    }

    try {
      jwtdecode(this.configuration.bearer);
    } catch (error) {
      throw new errors.PropertyInvalidError('bearer is invalid, it must be a JWT', error);
    }

    this.configuration = _.merge(this.configuration, {
      resourcePlaceholders: { orgId: this.configuration.orgId },
    });

    this.id = uuidv4();

    this.defaultHeaders = {
      'content-type': 'application/json',
      authorization: `Bearer ${this.configuration.bearer}`,
    };

    this.instance = this.configuration.instance || axiosExtras.createAxiosInstance();

    const check =
      typeof this.instance.create === 'function' &&
      typeof this.instance.request === 'function' &&
      typeof this.instance.interceptors === 'object';

    if (!check) {
      throw new errors.PropertyInvalidError('instance is invalid, it must be an instance of Axios');
    }
  }

  /**
   * Check if the passed object is a PercipioAxiosClientError.
   *
   * @static
   * @param {Object} obj
   * @return {Boolean}
   * @memberof PercipioAxiosClient
   */
  static isPercipioAxiosClientError(obj) {
    return obj !== null && typeof obj === 'object' && obj.isPercipioAxiosClientError === true;
  }

  /**
   * Builds the path for the resource, replacing any placeholders
   * with the values from configuration.resourcePlaceholders and the
   * extraPlaceholders. Values in configuration.resourcePlaceholders
   * take precedence.
   *
   * @param {String} resource - The resource path template
   * @param {Object} [extraPlaceholders = {}] - Additional placeholders to replace.
   * @return {String}
   * @throws {PropertyRequiredError} {placeHolder} is a required
   *                                 configuration.resourcePlaceholders property
   * @memberof PercipioAxiosClient
   */
  buildPath(resource, extraPlaceholders = {}) {
    const placeholders = _.merge({}, extraPlaceholders, this.configuration.resourcePlaceholders);

    return resource.replace(/{([-_a-zA-Z0-9[\]]+)}/g, (original, placeHolder) => {
      if (placeHolder in placeholders) {
        return placeholders[placeHolder];
      }

      throw new errors.PropertyRequiredError(
        `${placeHolder} is a required configuration.resourcePlaceholders property`
      );
    });
  }

  /**
   * Builds the headers for the request, combining the default headers with the extra headers.
   * All keys are normalized to lowercase.
   *
   * @param {Object} headers - The extra headers to send with the request, as key/value pairs.
   * @return {Object}
   * @throws {PropertyInvalidError} The authorization header is not valid. Value: {authorization}
   *                                if the authorization header does not start with 'Bearer'
   * @memberof PercipioAxiosClient
   */
  buildHeaders(headers) {
    const lowercaseKeys = (obj) =>
      Object.keys(obj).reduce((acc, key) => {
        acc[key.toLowerCase()] = obj[key];
        return acc;
      }, {});

    const result = _.merge({}, this.defaultHeaders, headers ? lowercaseKeys(headers) : {});

    if ('authorization' in result && !result.authorization.startsWith('Bearer ')) {
      throw new errors.PropertyInvalidError(
        `The authorization header is not valid. Value: ${result.authorization}`
      );
    }

    return result;
  }

  /**
   * Sends the request to the API.
   *
   * @param {Object} config
   * @param {String} config.method - The HTTP method.
   * @param {String} config.resource - The resource path to send the request to.
   * @param {Object} [config.extraPlaceholders = {}] - Additional placeholders to replace.
   * @param {Object} [config.params={}] - The params to send with the request.
   * @param {Object} [config.data={}] - The data to send with the request.
   * @param {Object} [config.headers={}] - The headers to send with the request,
   *                                       these will be merged with the default
   *                                       headers (authorization and content-type)
   * @param {*} [config.other] - Any other Axios Request Config properties to pass to the request.
   *                      See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @throws {PropertyRequiredError} method is a required configuration property
   * @throws {PropertyRequiredError} resource is a required configuration property
   * @memberof PercipioAxiosClient
   */
  sendRequest(config) {
    const {
      method,
      resource,
      extraPlaceholders = {},
      params = {},
      data = {},
      headers,
      ...other
    } = config;

    if (!method) {
      return Promise.reject(
        new errors.PropertyRequiredError('method is a required configuration property')
      );
    }

    if (!resource) {
      return Promise.reject(
        new errors.PropertyRequiredError('resource is a required configuration property')
      );
    }

    const requestConfig = {
      baseURL: this.configuration.baseURL,
      method,
      ...other,
    };

    try {
      requestConfig.url = this.buildPath(resource, extraPlaceholders);
    } catch (error) {
      return Promise.reject(error);
    }

    try {
      requestConfig.headers = this.buildHeaders(headers);
    } catch (error) {
      return Promise.reject(error);
    }

    if (!_.isEmpty(data)) {
      requestConfig.data = _.omitBy(data, _.isNil);
    }

    if (!_.isEmpty(params)) {
      requestConfig.params = _.omitBy(params, _.isNil);
    }

    return this.instance.request(requestConfig);
  }

  /**
   * Sends a delete request to the API.
   *
   * @param {Object} config
   * @param {String} config.resource - The resource path to send the request to.
   * @param {Object} [config.extraPlaceholders = {}] - Additional placeholders to replace.
   * @param {Object} [config.params={}] - The params to send with the request.
   * @param {Object} [config.data={}] - The data to send with the request.
   * @param {Object} [config.headers={}] - The headers to send with the request,
   *                                       these will be merged with the default
   *                                       headers (authorization and content-type)
   * @param {*} [config.other] - Any other Axios Request Config properties to pass to the request.
   *                      See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @throws {PropertyInvalidError} method cannot be overridden
   * @memberof PercipioAxiosClient
   */
  delete({ resource, extraPlaceholders, params, data, headers, ...other }) {
    const method = 'delete';
    if (other.method && other.method !== method) {
      return Promise.reject(new errors.PropertyInvalidError('method cannot be overridden'));
    }

    return this.sendRequest({
      method,
      resource,
      extraPlaceholders,
      params,
      data,
      headers,
      ...other,
    });
  }

  /**
   * Sends a get request to the API.
   *
   * @param {Object} config
   * @param {String} config.resource - The resource path to send the request to.
   * @param {Object} [config.extraPlaceholders = {}] - Additional placeholders to replace.
   * @param {Object} [config.params={}] - The params to send with the request.
   * @param {Object} [config.data={}] - The data to send with the request.
   * @param {Object} [config.headers={}] - The headers to send with the request,
   *                                       these will be merged with the default
   *                                       headers (authorization and content-type)
   * @param {*} [config.other] - Any other Axios Request Config properties to pass to the request.
   *                      See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @throws {PropertyInvalidError} method cannot be overridden
   * @return {Promise}
   * @memberof PercipioAxiosClient
   */
  get({ resource, extraPlaceholders, params, data, headers, ...other }) {
    const method = 'get';
    if (other.method && other.method !== method) {
      return Promise.reject(new errors.PropertyInvalidError('method cannot be overridden'));
    }

    return this.sendRequest({
      method,
      resource,
      extraPlaceholders,
      params,
      data,
      headers,
      ...other,
    });
  }

  /**
   * Sends a head request to the API.
   *
   * @param {Object} config
   * @param {String} config.resource - The resource path to send the request to.
   * @param {Object} [config.extraPlaceholders = {}] - Additional placeholders to replace.
   * @param {Object} [config.params={}] - The params to send with the request.
   * @param {Object} [config.data={}] - The data to send with the request.
   * @param {Object} [config.headers={}] - The headers to send with the request,
   *                                       these will be merged with the default
   *                                       headers (authorization and content-type)
   * @param {*} [config.other] - Any other Axios Request Config properties to pass to the request.
   *                      See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @throws {PropertyInvalidError} method cannot be overridden
   * @return {Promise}
   * @memberof PercipioAxiosClient
   */
  head({ resource, extraPlaceholders, params, data, headers, ...other }) {
    const method = 'head';
    if (other.method && other.method !== method) {
      return Promise.reject(new errors.PropertyInvalidError('method cannot be overridden'));
    }

    return this.sendRequest({
      method,
      resource,
      extraPlaceholders,
      params,
      data,
      headers,
      ...other,
    });
  }

  /**
   * Sends an options request to the API.
   *
   * @param {Object} config
   * @param {String} config.resource - The resource path to send the request to.
   * @param {Object} [config.params={}] - The params to send with the request.
   * @param {Object} [config.extraPlaceholders = {}] - Additional placeholders to replace.
   * @param {Object} [config.data={}] - The data to send with the request.
   * @param {Object} [config.headers={}] - The headers to send with the request,
   *                                       these will be merged with the default
   *                                       headers (authorization and content-type)
   * @param {*} [config.other] - Any other Axios Request Config properties to pass to the request.
   *                      See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @throws {PropertyInvalidError} method cannot be overridden
   * @return {Promise}
   * @memberof PercipioAxiosClient
   */
  options({ resource, extraPlaceholders, params, data, headers, ...other }) {
    const method = 'options';
    if (other.method && other.method !== method) {
      return Promise.reject(new errors.PropertyInvalidError('method cannot be overridden'));
    }

    return this.sendRequest({
      method,
      resource,
      extraPlaceholders,
      params,
      data,
      headers,
      ...other,
    });
  }

  /**
   * Sends a patch request to the API.
   *
   * @param {Object} config
   * @param {String} config.resource - The resource path to send the request to.
   * @param {Object} [config.params={}] - The params to send with the request.
   * @param {Object} [config.extraPlaceholders = {}] - Additional placeholders to replace.
   * @param {Object} [config.data={}] - The data to send with the request.
   * @param {Object} [config.headers={}] - The headers to send with the request,
   *                                       these will be merged with the default
   *                                       headers (authorization and content-type)
   * @param {*} [config.other] - Any other Axios Request Config properties to pass to the request.
   *                      See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @throws {PropertyInvalidError} method cannot be overridden
   * @return {Promise}
   * @memberof PercipioAxiosClient
   */
  patch({ resource, extraPlaceholders, params, data, headers, ...other }) {
    const method = 'patch';
    if (other.method && other.method !== method) {
      return Promise.reject(new errors.PropertyInvalidError('method cannot be overridden'));
    }

    return this.sendRequest({
      method,
      resource,
      extraPlaceholders,
      params,
      data,
      headers,
      ...other,
    });
  }

  /**
   * Sends a post request to the API.
   *
   * @param {Object} config
   * @param {String} config.resource - The resource path to send the request to.
   * @param {Object} [config.extraPlaceholders = {}] - Additional placeholders to replace.
   * @param {Object} [config.params={}] - The params to send with the request.
   * @param {Object} [config.data={}] - The data to send with the request.
   * @param {Object} [config.headers={}] - The headers to send with the request,
   *                                       these will be merged with the default
   *                                       headers (authorization and content-type)
   * @param {*} [config.other] - Any other Axios Request Config properties to pass to the request.
   *                      See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @throws {PropertyInvalidError} method cannot be overridden
   * @return {Promise}
   * @memberof PercipioAxiosClient
   */
  post({ resource, extraPlaceholders, params, data, headers, ...other }) {
    const method = 'post';
    if (other.method && other.method !== method) {
      return Promise.reject(new errors.PropertyInvalidError('method cannot be overridden'));
    }

    return this.sendRequest({
      method,
      resource,
      extraPlaceholders,
      params,
      data,
      headers,
      ...other,
    });
  }

  /**
   * Sends a put request to the API.
   *
   * @param {Object} config
   * @param {String} config.resource - The resource path to send the request to.
   * @param {Object} [config.extraPlaceholders = {}] - Additional placeholders to replace.
   * @param {Object} [config.params={}] - The params to send with the request.
   * @param {Object} [config.data={}] - The data to send with the request.
   * @param {Object} [config.headers={}] - The headers to send with the request,
   *                                       these will be merged with the default
   *                                       headers (authorization and content-type)
   * @param {*} [config.other] - Any other Axios Request Config properties to pass to the request.
   *                      See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @throws {PropertyInvalidError} method cannot be overridden
   * @return {Promise}
   * @memberof PercipioAxiosClient
   */
  put({ resource, extraPlaceholders, params, data, headers, ...other }) {
    const method = 'put';
    if (other.method && other.method !== method) {
      return Promise.reject(new errors.PropertyInvalidError('method cannot be overridden'));
    }

    return this.sendRequest({
      method,
      resource,
      extraPlaceholders,
      params,
      data,
      headers,
      ...other,
    });
  }
}

module.exports = {
  PercipioAxiosClient,
};
