/**
 * PercipioAxiosClient error object.
 * @category Errors
 */
class PercipioAxiosClientError extends Error {
  /**
   * Creates an instance of PercipioAxiosClientError.
   * @param {String} message - descriptive error message.
   * @param {Object} [options={}] - additional data.
   * @memberof PercipioAxiosClientError
   */
  constructor(message, options = {}) {
    super(message, options);
    this.name = this.constructor.name;
    this.isPercipioAxiosClientError = true;
  }
}

module.exports = {
  PercipioAxiosClientError,
};
