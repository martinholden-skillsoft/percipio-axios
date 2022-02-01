/**
 * Helper function to check if an error is a PercipioAxiosClientError.
 * @category Errors
 * @param {Object} obj
 * @return {Boolean}
 */
const isPercipioAxiosClientError = (obj) => {
  return obj !== null && typeof obj === 'object' && obj.isPercipioAxiosClientError === true;
};

module.exports = {
  isPercipioAxiosClientError,
};
