const { PercipioAxiosClientError } = require('./percipioaxiosclienterror');

/**
 * PropertyInvalidError error object.
 * @category Errors
 */
class PropertyInvalidError extends PercipioAxiosClientError {
  /**
   * Creates an instance of PropertyInvalidError.
   * @param {String} message - descriptive error message.
   * @param {Object} [options={}] - additional data.
   * @memberof PropertyInvalidError
   */
  constructor(message, options = {}) {
    super(message, options);
  }
}

module.exports = {
  PropertyInvalidError,
};
