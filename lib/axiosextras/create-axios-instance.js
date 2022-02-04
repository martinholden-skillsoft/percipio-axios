const { Agent: HttpAgent } = require('http');
const { Agent: HttpsAgent } = require('https');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const httpAgent = new HttpAgent({ keepAlive: true });
const httpsAgent = new HttpsAgent({ keepAlive: true });

const createAxiosInstance = () => {
  const axiosInstance = axios.create({ httpAgent, httpsAgent });

  // Add a request interceptor to add timings
  // and a correlation id to the config object.
  axiosInstance.interceptors.request.use((config) => {
    const updatedConfig = config;
    // Add timing key to the config
    if ('timings' in updatedConfig) {
      throw Error('timings already exist in the config object');
    }

    updatedConfig.timings = {
      sent: null,
      received: null,
      durationms: null,
    };

    if (!('requestCorrelationId' in updatedConfig)) {
      updatedConfig.requestCorrelationId = uuidv4();
    }
    updatedConfig.timings.sent = new Date();
    return updatedConfig;
  });

  // Add a response interceptor to add timings to the response
  // and a correlation id.
  axiosInstance.interceptors.response.use(
    (response) => {
      // Add timing key to the config
      if ('timings' in response.config) {
        response.config.timings.received = new Date();
        response.config.timings.durationms =
          response.config.timings.received - response.config.timings.sent;
        response.timings = response.config.timings;
      }
      if ('requestCorrelationId' in response.config) {
        response.requestCorrelationId = response.config.requestCorrelationId;
      }
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    },
    (error) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

module.exports = createAxiosInstance;
