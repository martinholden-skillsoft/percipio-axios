const { PercipioAxiosClientError } = require('./percipioaxiosclienterror');

/**
 * PropertyRequiredError error object.
 * @category Errors
 */
class PropertyRequiredError extends PercipioAxiosClientError {
  /**
   * Creates an instance of PropertyRequiredError.
   * @param {String} message - descriptive error message.
   * @param {Object} [options={}] - additional data.
   * @memberof PropertyRequiredError
   */
  constructor(message, options = {}) {
    super(message, options);
  }
}

module.exports = {
  PropertyRequiredError,
};
