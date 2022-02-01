const { Agent: HttpAgent } = require('http');
const { Agent: HttpsAgent } = require('https');
const axios = require('axios');
const { v4: uuidv4, validate: uuidValidate } = require('uuid');
const jwtdecode = require('jwt-decode');
const validUrl = require('valid-url');
const _ = require('lodash');

const httpAgent = new HttpAgent({ keepAlive: true });
const httpsAgent = new HttpsAgent({ keepAlive: true });

const errors = require('../errors');
const axiosExtras = require('./axiosextras');

/**
 * An Axios Client that provides a consistent approach for making Percipio API requests.
 * @category Percipio Client
 */
class PercipioAxiosClient {
  /**
   * Creates an instance of PercipioAxiosClient.
   * @param {Object} configuration - The configuration
   * @param {String} configuration.baseUrl - The base URL for the API
   * @param {String} configuration.orgId - The organization ID
   * @param {String} configuration.bearer - The bearer token
   * @param {Object} [configuration.instance] - The Axios instance to use,
   *                                     defaults to axios with timingAdapter
   * @param {Object} [configuration.resourcePlaceholders={orgId: config.OrgId}]
   *                  - Used to replace placeholders in the resource path.
   * @throws {PropertyRequiredError} baseUrl is a required configuration property
   * @throws {PropertyInvalidError} baseUrl is invalid, it must be a valid https URL
   * @throws {PropertyRequiredError} orgId is a required configuration property
   * @throws {PropertyInvalidError} orgId is invalid, it must be a uuid
   * @throws {PropertyRequiredError} bearer is a required configuration property
   * @throws {PropertyInvalidError} bearer is invalid, it must be a JWT
   * @throws {PropertyInvalidError} instance is invalid, it must be an instance of Axios
   * @memberof PercipioAxiosClient
   */
  constructor(configuration = {}) {
    this.configuration = _.merge({ resourcePlaceholders: {} }, _.cloneDeep(configuration));

    if (!('baseUrl' in this.configuration)) {
      throw new errors.PropertyRequiredError('baseUrl is a required configuration property');
    }

    if (!validUrl.isHttpsUri(this.configuration.baseUrl)) {
      throw new errors.PropertyInvalidError('baseUrl is invalid, it must be a valid https URL');
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

    const axiosInstanceConfig = {
      httpAgent,
      httpsAgent,
      adapter: axiosExtras.timingAdapter,
    };

    this.instance = this.configuration.instance || axios.create(axiosInstanceConfig);

    const check =
      typeof this.instance.create === 'function' &&
      typeof this.instance.request === 'function' &&
      typeof this.instance.interceptors === 'object';

    if (!check) {
      throw new errors.PropertyInvalidError('instance is invalid, it must be an instance of Axios');
    }
  }

  /**
   * Builds the path for the resource, replacing any placeholders
   * with the values from configuration.resourcePlaceholders.
   *
   * @param {String} resource - The resource path template
   * @return {String}
   * @throws {PropertyRequiredError} {placeHolder} is a required
   *                                 configuration.resourcePlaceholders property
   * @memberof PercipioAxiosClient
   */
  buildPath(resource) {
    return resource.replace(/{([-_a-zA-Z0-9[\]]+)}/g, (original, placeHolder) => {
      if (placeHolder in this.configuration.resourcePlaceholders) {
        return this.configuration.resourcePlaceholders[placeHolder];
      }

      throw new errors.PropertyRequiredError(
        `${placeHolder} is a required configuration.resourcePlaceholders property`
      );
    });
  }

  /**
   * Builds the headers for the request, combining the default headers with the extra headers.
   *
   * @param {Object} extraHeaders - The extra headers to send with the request, as key/value pairs.
   * @return {Object}
   * @memberof PercipioAxiosClient
   */
  buildHeaders(extraHeaders) {
    return _.merge({}, this.defaultHeaders, extraHeaders);
  }

  /**
   * Sends the request to the API.
   *
   * @param {Object} config
   * @param {String} config.method - The HTTP method.
   * @param {String} config.resource - The resource path to send the request to.
   * @param {Object} [config.query={}] - The query paramerters to send with the request.
   * @param {Object} [config.body={}] - The body to send with the request.
   * @param {Object} [config.extraHeaders={}] - The extra headers to send with the request.
   * @param {*} [config.rest] - Any other valid Axios arguments to pass to the request.
   * @return {Promise}
   * @throws {PropertyRequiredError} method is a required configuration property
   * @throws {PropertyRequiredError} resource is a required configuration property
   * @memberof PercipioAxiosClient
   */
  sendRequest(config) {
    const { method, resource, query, body, extraHeaders, ...rest } = config;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new errors.PropertyRequiredError('method is a required configuration property'));
      }

      if (!resource) {
        reject(new errors.PropertyRequiredError('resource is a required configuration property'));
      }

      const url = this.buildPath(resource);
      const headers = this.buildHeaders(extraHeaders);

      let params = query || {};
      params = _.omitBy(params, _.isNil);

      let data = body || {};
      data = _.omitBy(data, _.isNil);

      const requestConfig = {
        baseURL: this.configuration.baseUrl,
        url,
        headers,
        method,
        ...rest,
      };

      if (!_.isEmpty(data)) {
        requestConfig.data = data;
      }

      if (!_.isEmpty(params)) {
        requestConfig.params = params;
      }

      this.instance
        .request(requestConfig)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Sends a delete request to the API.
   *
   * @param {Object} config
   * @param {String} config.resource - The resource path to send the request to.
   * @param {Object} [config.query={}] - The query paramerters to send with the request.
   * @param {Object} [config.body={}] - The body to send with the request.
   * @param {Object} [config.extraHeaders={}] - The extra headers to send with the request.
   * @param {*} [config.rest] - Any other valid Axios arguments to pass to the request.
   * @return {Promise}
   * @throws {PropertyInvalidError} method cannot be overridden
   * @memberof PercipioAxiosClient
   */
  delete({ resource, query, body, extraHeaders, ...rest }) {
    return new Promise((resolve, reject) => {
      const method = 'delete';
      if (rest.method && rest.method !== method) {
        reject(new errors.PropertyInvalidError('method cannot be overridden'));
      }

      this.sendRequest({ method, resource, query, body, extraHeaders, ...rest })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Sends a get request to the API.
   *
   * @param {Object} config
   * @param {String} config.resource - The resource path to send the request to.
   * @param {Object} [config.query={}] - The query paramerters to send with the request.
   * @param {Object} [config.body={}] - The body to send with the request.
   * @param {Object} [config.extraHeaders={}] - The extra headers to send with the request.
   * @param {*} [config.rest] - Any other valid Axios arguments to pass to the request.
   * @throws {PropertyInvalidError} method cannot be overridden
   * @return {Promise}
   * @memberof PercipioAxiosClient
   */
  get({ resource, query, body, extraHeaders, ...rest }) {
    return new Promise((resolve, reject) => {
      const method = 'get';
      if (rest.method && rest.method !== method) {
        reject(new errors.PropertyInvalidError('method cannot be overridden'));
      }

      this.sendRequest({ method, resource, query, body, extraHeaders, ...rest })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Sends a head request to the API.
   *
   * @param {Object} config
   * @param {String} config.resource - The resource path to send the request to.
   * @param {Object} [config.query={}] - The query paramerters to send with the request.
   * @param {Object} [config.body={}] - The body to send with the request.
   * @param {Object} [config.extraHeaders={}] - The extra headers to send with the request.
   * @param {*} [config.rest] - Any other valid Axios arguments to pass to the request.
   * @throws {PropertyInvalidError} method cannot be overridden
   * @return {Promise}
   * @memberof PercipioAxiosClient
   */
  head({ resource, query, body, extraHeaders, ...rest }) {
    return new Promise((resolve, reject) => {
      const method = 'head';
      if (rest.method && rest.method !== method) {
        reject(new errors.PropertyInvalidError('method cannot be overridden'));
      }

      this.sendRequest({ method, resource, query, body, extraHeaders, ...rest })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Sends an options request to the API.
   *
   * @param {Object} config
   * @param {String} config.resource - The resource path to send the request to.
   * @param {Object} [config.query={}] - The query paramerters to send with the request.
   * @param {Object} [config.body={}] - The body to send with the request.
   * @param {Object} [config.extraHeaders={}] - The extra headers to send with the request.
   * @param {*} [config.rest] - Any other valid Axios arguments to pass to the request.
   * @throws {PropertyInvalidError} method cannot be overridden
   * @return {Promise}
   * @memberof PercipioAxiosClient
   */
  options({ resource, query, body, extraHeaders, ...rest }) {
    return new Promise((resolve, reject) => {
      const method = 'options';
      if (rest.method && rest.method !== method) {
        reject(new errors.PropertyInvalidError('method cannot be overridden'));
      }

      this.sendRequest({ method, resource, query, body, extraHeaders, ...rest })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Sends a patch request to the API.
   *
   * @param {Object} config
   * @param {String} config.resource - The resource path to send the request to.
   * @param {Object} [config.query={}] - The query paramerters to send with the request.
   * @param {Object} [config.body={}] - The body to send with the request.
   * @param {Object} [config.extraHeaders={}] - The extra headers to send with the request.
   * @param {*} [config.rest] - Any other valid Axios arguments to pass to the request.
   * @throws {PropertyInvalidError} method cannot be overridden
   * @return {Promise}
   * @memberof PercipioAxiosClient
   */
  patch({ resource, query, body, extraHeaders, ...rest }) {
    return new Promise((resolve, reject) => {
      const method = 'patch';
      if (rest.method && rest.method !== method) {
        reject(new errors.PropertyInvalidError('method cannot be overridden'));
      }

      this.sendRequest({ method, resource, query, body, extraHeaders, ...rest })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Sends a post request to the API.
   *
   * @param {Object} config
   * @param {String} config.resource - The resource path to send the request to.
   * @param {Object} [config.query={}] - The query paramerters to send with the request.
   * @param {Object} [config.body={}] - The body to send with the request.
   * @param {Object} [config.extraHeaders={}] - The extra headers to send with the request.
   * @param {*} [config.rest] - Any other valid Axios arguments to pass to the request.
   * @throws {PropertyInvalidError} method cannot be overridden
   * @return {Promise}
   * @memberof PercipioAxiosClient
   */
  post({ resource, query, body, extraHeaders, ...rest }) {
    return new Promise((resolve, reject) => {
      const method = 'post';
      if (rest.method && rest.method !== method) {
        reject(new errors.PropertyInvalidError('method cannot be overridden'));
      }

      this.sendRequest({ method, resource, query, body, extraHeaders, ...rest })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Sends a put request to the API.
   *
   * @param {Object} config
   * @param {String} config.resource - The resource path to send the request to.
   * @param {Object} [config.query={}] - The query paramerters to send with the request.
   * @param {Object} [config.body={}] - The body to send with the request.
   * @param {Object} [config.extraHeaders={}] - The extra headers to send with the request.
   * @param {*} [config.rest] - Any other valid Axios arguments to pass to the request.
   * @throws {PropertyInvalidError} method cannot be overridden
   * @return {Promise}
   * @memberof PercipioAxiosClient
   */
  put({ resource, query, body, extraHeaders, ...rest }) {
    return new Promise((resolve, reject) => {
      const method = 'put';
      if (rest.method && rest.method !== method) {
        reject(new errors.PropertyInvalidError('method cannot be overridden'));
      }

      this.sendRequest({ method, resource, query, body, extraHeaders, ...rest })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = {
  PercipioAxiosClient,
};
