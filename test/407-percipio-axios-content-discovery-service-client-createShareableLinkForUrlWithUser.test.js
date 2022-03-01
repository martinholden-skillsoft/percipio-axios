const chai = require('chai');
const nock = require('nock');
const chaiMatch = require('chai-match');
const chaiNock = require('chai-nock');
const { expect } = require('chai');
const _ = require('lodash');
const { default: axios } = require('axios');

const {
  PercipioAxiosContentDiscoveryServiceClient,
  PropertyRequiredError,
  PropertyInvalidError,
  PercipioAxiosClientError,
} = require('../index');

const testutils = require('./helpers/utils');

chai.use(chaiMatch);
chai.use(chaiNock);

describe(' PercipioAxiosContentDiscoveryServiceClient', function () {
  describe('createShareableLinkForUrlWithUser function', function () {
    let mainconfig;
    let requestConfig;
    let requestNock;
    let pathPlaceHoldersConfig;

    this.timeout(5000);
    this.slow(500);

    function setupConfigs() {
      mainconfig = {
        baseURL: 'https://example.com',
        orgId: 'b001e4aa-7ac9-4d15-8ddc-b0c58f6982dd',
        bearer:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXJ2aWNlX2FjY291bnRfaWQiOiIzYzZjMDMxMS03NmRhLTRkMjktYmZkOS1mYTQ0NzZkNmFkNTYiLCJvcmdhbml6YXRpb25faWQiOiJiMDAxZTRhYS03YWM5LTRkMTUtOGRkYy1iMGM1OGY2OTgyZGQiLCJpc3MiOiJhcGkucGVyY2lwaW8uY29tIiwiaWF0IjoxNTk5MDUxMjMwLCJzdWIiOiIyMTIzNDUzOTFkNDIyMmEzZDUyNzVmZGIwMWEyODU0ZDllYTNkYjFlIiwicG9saWN5LWlkIjoicGVyY2lwaW8tYXBpLXN0YW5kYXJkLXBvbGljeSJ9.Eb-tv43j39qphGrUmoL9147SfqVBY2jkiF-yJDLYtKkb6rfDioSGsGRRni8hh0paXRvxRufZYadBw4idnH3i2CriMmhLa1NGutWJR3iH1fuquGNtab0B4qoT76kzLqc7p6CU3zsc7gRLdFqQ8AD7msRuljPc3B7xUPnU4OV11_3kagb2UXvtIoJYI-RegYyUk13_VeplSlZNEIUDhgnkH5N8pmy7VkKaJaMlV6QS410WY3eTFofme2Z9XwoYxk3pTg-yMCzPspm90Tns0B3M_nKUaMrtZ-v1iyhbuiyo6DwyC1Xm0DZm2uuPKh_hheNu7aYlemROHp9Sg2an-_cemx80wcZ9DuAmkLgXxleqmiBD2usL2BjUUF-W2f4DHJhP3l5GUQtOl7XnaoSnSEyJ0m99VE8jU39295PMa5Eg6NFBChUbTaXGVo8efrSzP2lKDAOQS5Qqz25eIRBUYHwBtfpxREl3kj3qWcrcr-WPAd5TD_B61HrWWxCm9U9D74pha2gu5Bz6vwQzyq45duoaVeCM0otcgAKiGK0ndU1CUZLLIo4IUQG9cUVbgRYKNfM_WQCN1Wew-rCDoBcaIbg8hPbRwCvyNNsy525BFbMPuwULQnOw8eLMtOUop2Gr1S_gimDXUeW5wAhdjgh1Jp_sAkwfopizl4WTQpqWPBgDkPU',
      };

      requestConfig = {};
      pathPlaceHoldersConfig = {};
      pathPlaceHoldersConfig.userId = 'fa164acc-f1b9-4a26-a95c-330bc0f2fe18';
      requestConfig.extraPlaceholders = pathPlaceHoldersConfig;
    }

    setupConfigs();

    before(function () {
      // runs once before the first test in this block
    });

    beforeEach(function () {
      // runs before each test in this block
      setupConfigs();
      requestNock = testutils.getOperationNock(
        mainconfig.baseURL,
        '/content-discovery/v1/organizations/{orgId}/users/{userId}/share-link/url',
        _.extend({}, mainconfig, pathPlaceHoldersConfig)
      );
    });

    afterEach(function () {
      // runs after each test in this block
      nock.cleanAll();
    });

    after(function () {
      // runs once after the last test in this block
    });

    it('confirm it has default headers', async function () {
      const client = new PercipioAxiosContentDiscoveryServiceClient(mainconfig);
      return client.createShareableLinkForUrlWithUser(requestConfig).then((response) => {
        expect(requestNock).to.have.been.requestedWithHeadersMatch({
          authorization: `Bearer ${mainconfig.bearer}`,
          'content-type': 'application/json',
        });
      });
    });

    it('confirm axios instance can be overridden', async function () {
      // Override Axios instance
      const message = 'Hello World';
      const axiosInstance = axios.create();

      // Add a response interceptor to add timings to the response
      // and a correlation id.
      axiosInstance.interceptors.response.use((response) => {
        response.testMessage = message;
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
      });

      mainconfig.instance = axiosInstance;
      const client = new PercipioAxiosContentDiscoveryServiceClient(mainconfig);

      return client.createShareableLinkForUrlWithUser(requestConfig).then((response) => {
        expect(response).to.have.property('testMessage', message);
      });
    });

    it('confirm other Axios request configs sent', async function () {
      const client = new PercipioAxiosContentDiscoveryServiceClient(mainconfig);

      requestConfig.xsrfCookieName = 'TEST-XSRF-TOKEN';
      return client.createShareableLinkForUrlWithUser(requestConfig).then((response) => {
        expect(response.config).to.have.property('xsrfCookieName', 'TEST-XSRF-TOKEN');
      });
    });

    it('confirm data sent', async function () {
      const client = new PercipioAxiosContentDiscoveryServiceClient(mainconfig);

      requestConfig.data = { a: 1, b: 2, c: 'mystring' };
      return client.createShareableLinkForUrlWithUser(requestConfig).then((response) => {
        expect(response.request).to.have.property('requestBodyBuffers');
        const requestBody = testutils.getAxiosRequestBody(response);
        expect(requestBody).to.have.property('a', 1);
        expect(requestBody).to.have.property('b', 2);
        expect(requestBody).to.have.property('c', 'mystring');
      });
    });
  });
});
