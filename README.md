# percipio-axios

Axios-based client for the Percipio API

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

- Create code to call your chosen API, here we will call the [Get Collections](https://api.percipio.com/common/api-docs/#/%2Fv1/getCollections) and display the response in the console.

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
      console.log(JSON.stringify(response.data, null, 2));
    })
    .catch((err) => {
      if (PercipioAxiosClient.isPercipioAxiosClientError(err)) {
        console.error("PercipoAxiosClient Error. ", err);
      } else {
        console.error(err);
      }
    });
  ```

## Documentation

Please see [documentation](https://martinholden-skillsoft.github.io/percipio-axios/PercipioAxiosClient.html)

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## License

MIT © [martinholden-skillsoft](12408585+martinholden-skillsoft@users.noreply.github.com)
