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
- Create code to call your chosen API using the base code, here we will call the [Get Collections](https://api.percipio.com/common/api-docs/#/%2Fv1/getCollections) and display the response in the console.

  ```javascript
  const { PercipioAxiosClient } = require("percipio-axios");

  require("dotenv").config();

  if (!process.env.ORG_ID || !process.env.BEARER_TOKEN || !process.env.BASE_URL) {
    console.error(
      "Missing critical env vars. Make sure all variables are defined in .env file. Aborting. "
    );
    process.exit(1);
  }

  // Create the Percipio Client
  let client = null;
  try {
    client = new PercipioAxiosClient({
      baseURL: process.env.BASE_URL,
      orgId: process.env.ORG_ID,
      bearer: process.env.BEARER_TOKEN,
      resourcePlaceholders: { version: "v1" },
    });
  } catch (error) {
    console.error(error);
  }

  // {orgId} will be replaced by the orgId passed to the PercipioAxiosClient
  //
  // {version} will be replaced by the version passed to the PercipioAxiosClient in
  // the resourcePlaceholders configuration option
  const resource = "/common/{version}/organizations/{orgId}/collections";

  client
    .get({
      resource,
      params: {},
      data: {},
      headers: { 'User-Agent': 'Percipio-Node-TestClient' },
      timeout: 2000, //This is a standard Axios Request Config value
    })
    .then((response) => {
      consola.log('********** Results **********\n');
      consola.log(asciitable(Array.isArray(response.data) ? response.data : [response.data]));
    })
    .catch((err) => {
      if (PercipioAxiosClient.isPercipioAxiosClientError(err)) {
        consola.error("PercipoAxiosClient Error. ", err);
      } else {
        consola.error(err);
      }
    });
  ```

### Use PercipioAxiosCommonServicesClient client
- Create code to call your chosen API using the base code, here we will call the [Get Collections](https://api.percipio.com/common/api-docs/#/%2Fv1/getCollections) and display the response in the console.

  ```javascript
  const asciitable = require('asciitable');
  const consola = require('consola');
  const { PercipioAxiosCommonServicesClient } = require("percipio-axios");

  require("dotenv").config();

  if (!process.env.ORG_ID || !process.env.BEARER_TOKEN || !process.env.BASE_URL) {
    console.error(
      "Missing critical env vars. Make sure all variables are defined in .env file. Aborting. "
    );
    process.exit(1);
  }

  /**
  * Create a new PercipioAxiosClient
  *
  * @param {Object} config
  * @return {PercipioAxiosClient} The PercipioAxiosClient Instance
  */
  const getPercipioClient = (config) => {
    return new Promise((resolve, reject) => {
      try {
        const client = new PercipioAxiosCommonServiceClient(config);
        resolve(client);
      } catch (error) {
        reject(error);
      }
    });
  };

  getPercipioClient({
    baseURL: process.env.BASE_URL,
    orgId: process.env.ORG_ID,
    bearer: process.env.BEARER_TOKEN,
    resourcePlaceholders: { version: 'v1' },
  })
  .then((client) => {
    // This uses the Percipio Common API getCollections method.
    // https://api.percipio.com/common/api-docs/#/%2Fv1/getCollections

    client
      .getCollections({
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
