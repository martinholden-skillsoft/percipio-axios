const httpAdapter = require('axios/lib/adapters/http');
const settle = require('axios/lib/core/settle');

/**
 * Axios Adapter thats adds timing metrics to the default Axios httpAdapter
 * @category Axios Extras
 * @param {*} config axios request configuration
 * @return {Promise}
 */
const timingAdapter = (config) => {
  const sendTime = new Date();

  return new Promise((resolve, reject) => {
    httpAdapter(config)
      .then((response) => {
        // Always use machine time instead of response.headers.date as this ensures skew
        // Doesnt affect timings
        const receivedTime = new Date();
        response.timings = {
          sent: sendTime,
          received: receivedTime,
          durationms: receivedTime - sendTime,
        };
        settle(resolve, reject, response);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = {
  timingAdapter,
};
