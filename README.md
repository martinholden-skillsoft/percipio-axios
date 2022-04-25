[![Percipio Axios CI](https://github.com/martinholden-skillsoft/percipio-axios/actions/workflows/main.yml/badge.svg)](https://github.com/martinholden-skillsoft/percipio-axios/actions/workflows/main.yml)

# percipio-axios

Axios-based client for the Percipio API, and generated SDK Clients for eachAPI

## Quickstart

- You should familiarize yourself with the Percipio services. A good place to begin is [Skillsoft Rest APIs](https://documentation.skillsoft.com/en_us/pes/Integration/int_api_overview.htm)

- Next, add `percipio-axios` and `dotenv` to your project.

  ```
  npm install martinholden-skillsoft/percipio-axios dotenv --save
  ```

- Create a .ENV file with the three pieces of information the client needs.

  ```
  BASE_URL=https://api.percipio.com
  ORG_ID=b001e4aa-7ac9-4d15-8ddc-b0c58f6982dd
  BEARER_TOKEN=eyJhbGciOi.....qWPBgDkPU
  ```

### Use percipio-axios client
- Create code to call your chosen API using the base code, here we will call the [Get Users](https://api.percipio.com/user-management/api-docs/#/%2Fv1/getUsers) and display the response in the console.

  ```javascript
  const { PercipioAxiosClient } = require('percipio-axios');
  const { Agent: HttpAgent } = require('http');
  const { Agent: HttpsAgent } = require('https');
  const axios = require('axios');
  const { v4: uuidv4 } = require('uuid');
  const asciitable = require('asciitable');
  const consola = require('consola');

  require('dotenv').config();

  // Check the environment variables are configured in the .env file
  if (!process.env.ORG_ID || !process.env.BEARER_TOKEN || !process.env.BASE_URL) {
    consola.error(
      'Missing critical env vars. Make sure all variables are defined in .env file. Aborting. '
    );
    process.exit(1);
  }

  /**
  * Create a new Axios client with interceptors to add timing data
  * and a correlation id.
  *
  * @return {Axios} The Axios Instance
  */
  const getAxiosInstance = () => {
    const httpAgent = new HttpAgent({ keepAlive: true });
    const httpsAgent = new HttpsAgent({ keepAlive: true });

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

  /**
  * Create a new PercipioAxiosClient
  *
  * @param {Object} config
  * @return {PercipioAxiosClient} The client
  */
  const getPercipioClient = (config) => {
    return new Promise((resolve, reject) => {
      try {
        const client = new PercipioAxiosClient(config);
        resolve(client);
      } catch (error) {
        reject(error);
      }
    });
  };

  // ------------------------------------------------------------------------------------

  // Create a new Percipio Axios Client demonstrates
  // Passing custom resourcePlaceholders used in the resource URL
  // Passing a custom axios instance return by getAxiosInstance()
  getPercipioClient({
    baseURL: process.env.BASE_URL,
    orgId: process.env.ORG_ID,
    bearer: process.env.BEARER_TOKEN,
    instance: getAxiosInstance(),
  })
    .then((client) => {
      // This uses the Percipio User Managament API getUsers method.
      // https://api.percipio.com/user-management/api-docs/#/%2Fv1/getUsers

      // {orgId} will be replaced by the orgId passed to the PercipioAxiosClient
      //
      // {version} will be replaced by the version passed to the PercipioAxiosClient in
      // the resourcePlaceholders configuration option
      const resource = '/user-management/v1/organizations/{orgId}/users';

      client
        .get({
          resource,
          extraPlaceholders: { version: 'v1' },
          params: {},
          data: {},
          headers: { 'User-Agent': 'Percipio-Node-TestClient' },
          timeout: 2000, // This is a standard Axios Request Config value
        })
        .then((response) => {
          consola.log('******** Timing Data ********\n');
          consola.log(asciitable([response.timings]));
          consola.log('********** Results **********\n');
          consola.log(asciitable(Array.isArray(response.data) ? response.data : [response.data]));
        })
        .catch((err) => {
          consola.error(err);
        });
    })
    .catch((err) => {
      consola.error(err);
    });

  ```

### Use PercipioAxiosUserManagementServiceClient client
- Create code to call the generated SDK PercipioAxiosUserManagementServiceClient for [Get Users](https://api.percipio.com/user-management/api-docs/#/%2Fv1/getUsers) and display the response in the console.

  ```javascript
  const { PercipioAxiosUserManagementServiceClient } = require('percipio-axios');
  const { Agent: HttpAgent } = require('http');
  const { Agent: HttpsAgent } = require('https');
  const axios = require('axios');
  const { v4: uuidv4 } = require('uuid');
  const asciitable = require('asciitable');
  const consola = require('consola');

  require('dotenv').config();

  // Check the environment variables are configured in the .env file
  if (!process.env.ORG_ID || !process.env.BEARER_TOKEN || !process.env.BASE_URL) {
    consola.error(
      'Missing critical env vars. Make sure all variables are defined in .env file. Aborting. '
    );
    process.exit(1);
  }

  /**
  * Create a new Axios client with interceptors to add timing data
  * and a correlation id.
  *
  * @return {Axios} The Axios Instance
  */
  const getAxiosInstance = () => {
    const httpAgent = new HttpAgent({ keepAlive: true });
    const httpsAgent = new HttpsAgent({ keepAlive: true });

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

  /**
  * Create a new PercipioAxiosUserManagementServiceClient
  *
  * @param {Object} config
  * @return {PercipioAxiosUserManagementServiceClient} The client
  */
  const getPercipioClient = (config) => {
    return new Promise((resolve, reject) => {
      try {
        const client = new PercipioAxiosUserManagementServiceClient(config);
        resolve(client);
      } catch (error) {
        reject(error);
      }
    });
  };

  // ------------------------------------------------------------------------------------

  // Create a new Percipio Axios Client demonstrates
  // Passing custom resourcePlaceholders used in the resource URL
  // Passing a custom axios instance return by getrAxiosInstance()
  getPercipioClient({
    baseURL: process.env.BASE_URL,
    orgId: process.env.ORG_ID,
    bearer: process.env.BEARER_TOKEN,
    resourcePlaceholders: { version: 'v1' },
    instance: getAxiosInstance(),
  })
    .then((client) => {
      // This uses the Percipio User Managament API getUsers method.
      // https://api.percipio.com/user-management/api-docs/#/%2Fv1/getUsers

      client
        .getUsers({
          headers: { 'User-Agent': 'Percipio-Node-SDK' }, // This is an additional custom header
          timeout: 2000, // This is a standard Axios Request Config value
        })
        .then((response) => {
          consola.log('******** Timing Data ********\n');
          consola.log(asciitable([response.timings]));
          consola.log('********** Results **********\n');
          consola.log(asciitable(Array.isArray(response.data) ? response.data : [response.data]));
        })
        .catch((err) => {
          consola.error(err);
        });
    })
    .catch((err) => {
      consola.error(err);
    });
  ```

## Documentation

Please see [documentation](https://martinholden-skillsoft.github.io/percipio-axios/PercipioAxiosClient.html)

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## License

MIT © [martinholden-skillsoft](12408585+martinholden-skillsoft@users.noreply.github.com)
