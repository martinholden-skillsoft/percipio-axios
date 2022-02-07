const { Agent: HttpAgent } = require('http');
const { Agent: HttpsAgent } = require('https');
const axios = require('axios');

const httpAgent = new HttpAgent({ keepAlive: true });
const httpsAgent = new HttpsAgent({ keepAlive: true });

const createAxiosInstance = () => {
  const axiosInstance = axios.create({ httpAgent, httpsAgent });
  return axiosInstance;
};

module.exports = createAxiosInstance;
