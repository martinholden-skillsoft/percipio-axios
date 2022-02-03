const chai = require('chai');
const nock = require('nock');
const chaiMatch = require('chai-match');
const chaiNock = require('chai-nock');
const { expect } = require('chai');
const { default: axios } = require('axios');

const {
  PercipioAxiosClient,
  PropertyRequiredError,
  PropertyInvalidError,
  PercipioAxiosClientError,
} = require('../index');

const testutils = require('./helpers/utils');

chai.use(chaiMatch);
chai.use(chaiNock);

const convenienceMethods = ['delete', 'get', 'head', 'options', 'patch', 'post', 'put'];
const alternateMethodMap = {
  delete: 'get',
  get: 'post',
  head: 'get',
  options: 'get',
  patch: 'get',
  post: 'get',
  put: 'get',
};

describe('PercipioAxiosClient', function () {
  convenienceMethods.forEach(function (functionName) {
    describe(`${functionName} convenience function`, function () {
      let mainconfig;
      let getRequestConfig;
      let requestNock;

      this.timeout(5000);
      this.slow(500);

      function setupConfigs() {
        mainconfig = {
          baseURL: 'https://example.com',
          orgId: 'b001e4aa-7ac9-4d15-8ddc-b0c58f6982dd',
          bearer:
            'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXJ2aWNlX2FjY291bnRfaWQiOiIzYzZjMDMxMS03NmRhLTRkMjktYmZkOS1mYTQ0NzZkNmFkNTYiLCJvcmdhbml6YXRpb25faWQiOiJiMDAxZTRhYS03YWM5LTRkMTUtOGRkYy1iMGM1OGY2OTgyZGQiLCJpc3MiOiJhcGkucGVyY2lwaW8uY29tIiwiaWF0IjoxNTk5MDUxMjMwLCJzdWIiOiIyMTIzNDUzOTFkNDIyMmEzZDUyNzVmZGIwMWEyODU0ZDllYTNkYjFlIiwicG9saWN5LWlkIjoicGVyY2lwaW8tYXBpLXN0YW5kYXJkLXBvbGljeSJ9.Eb-tv43j39qphGrUmoL9147SfqVBY2jkiF-yJDLYtKkb6rfDioSGsGRRni8hh0paXRvxRufZYadBw4idnH3i2CriMmhLa1NGutWJR3iH1fuquGNtab0B4qoT76kzLqc7p6CU3zsc7gRLdFqQ8AD7msRuljPc3B7xUPnU4OV11_3kagb2UXvtIoJYI-RegYyUk13_VeplSlZNEIUDhgnkH5N8pmy7VkKaJaMlV6QS410WY3eTFofme2Z9XwoYxk3pTg-yMCzPspm90Tns0B3M_nKUaMrtZ-v1iyhbuiyo6DwyC1Xm0DZm2uuPKh_hheNu7aYlemROHp9Sg2an-_cemx80wcZ9DuAmkLgXxleqmiBD2usL2BjUUF-W2f4DHJhP3l5GUQtOl7XnaoSnSEyJ0m99VE8jU39295PMa5Eg6NFBChUbTaXGVo8efrSzP2lKDAOQS5Qqz25eIRBUYHwBtfpxREl3kj3qWcrcr-WPAd5TD_B61HrWWxCm9U9D74pha2gu5Bz6vwQzyq45duoaVeCM0otcgAKiGK0ndU1CUZLLIo4IUQG9cUVbgRYKNfM_WQCN1Wew-rCDoBcaIbg8hPbRwCvyNNsy525BFbMPuwULQnOw8eLMtOUop2Gr1S_gimDXUeW5wAhdjgh1Jp_sAkwfopizl4WTQpqWPBgDkPU',
        };

        getRequestConfig = {
          resource: 'test/{orgId}/path',
          params: null,
          headers: null,
        };
      }

      setupConfigs();

      before(function () {
        // runs once before the first test in this block
      });

      beforeEach(function () {
        // runs before each test in this block
        setupConfigs();
        requestNock = testutils.getNock(mainconfig.baseURL, `/test/${mainconfig.orgId}/path`);
      });

      afterEach(function () {
        // runs after each test in this block
        nock.cleanAll();
      });

      after(function () {
        // runs once after the last test in this block
      });

      it('confirm it has default headers', async function () {
        const client = new PercipioAxiosClient(mainconfig);

        return client[functionName](getRequestConfig).then((response) => {
          expect(requestNock).to.have.been.requestedWithHeadersMatch({
            authorization: `Bearer ${mainconfig.bearer}`,
            'content-type': 'application/json',
          });
        });
      });

      it('attempt to overide method should throw PropertyInvalidError', async function () {
        const client = new PercipioAxiosClient(mainconfig);

        getRequestConfig.method = alternateMethodMap[functionName];
        return client[functionName](getRequestConfig).catch((err) => {
          expect(err).to.be.instanceOf(PropertyInvalidError);
        });
      });

      it('confirm response contains timing data', async function () {
        const client = new PercipioAxiosClient(mainconfig);

        return client[functionName](getRequestConfig).then((response) => {
          expect(response).to.have.property('timings');
          expect(response.timings).to.have.property('sent').that.is.a('date');
          expect(response.timings).to.have.property('received').that.is.a('date');
          expect(response.timings).to.have.property('durationms').that.is.a('number');
        });
      });

      it('confirm response does not contain timing data, when instance overridden', async function () {
        // Override Axios instance for one without timingAdapter
        mainconfig.instance = axios.create();
        const client = new PercipioAxiosClient(mainconfig);

        return client[functionName](getRequestConfig).then((response) => {
          expect(response).to.not.have.property('timings');
        });
      });

      it('confirm params sent', async function () {
        const client = new PercipioAxiosClient(mainconfig);

        getRequestConfig.params = { a: 1, b: 2, c: 'mystring' };
        return client[functionName](getRequestConfig).then((response) => {
          const requestQS = testutils.getAxiosRequestQuerystring(response);
          expect(requestQS).to.have.property('a', 1);
          expect(requestQS).to.have.property('b', 2);
          expect(requestQS).to.have.property('c', 'mystring');
        });
      });

      it('confirm data sent', async function () {
        const client = new PercipioAxiosClient(mainconfig);

        getRequestConfig.data = { a: 1, b: 2, c: 'mystring' };
        return client[functionName](getRequestConfig).then((response) => {
          expect(response.request).to.have.property('requestBodyBuffers');
          const requestBody = testutils.getAxiosRequestBody(response);
          expect(requestBody).to.have.property('a', 1);
          expect(requestBody).to.have.property('b', 2);
          expect(requestBody).to.have.property('c', 'mystring');
        });
      });

      it('confirm other Axios request configs sent', async function () {
        const client = new PercipioAxiosClient(mainconfig);

        getRequestConfig.xsrfCookieName = 'TEST-XSRF-TOKEN';
        return client[functionName](getRequestConfig).then((response) => {
          expect(response.config).to.have.property('xsrfCookieName', 'TEST-XSRF-TOKEN');
        });
      });

      it('throws PropertyRequiredError if resource is not included', function () {
        const client = new PercipioAxiosClient(mainconfig);
        // remove resource from config
        getRequestConfig.resource = null;
        return client[functionName](getRequestConfig).catch((err) => {
          expect(err).to.be.instanceOf(PropertyRequiredError);
        });
      });
    });
  });
});
