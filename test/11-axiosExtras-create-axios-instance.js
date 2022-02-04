const chai = require('chai');
const nock = require('nock');
const chaiMatch = require('chai-match');
const chaiNock = require('chai-nock');

const qs = require('qs');
const url = require('url');
const { parseObject } = require('query-types');

chai.use(chaiMatch);
chai.use(chaiNock);

const { expect, Assertion } = require('chai');

const {
  PercipioAxiosClient,
  PropertyRequiredError,
  PropertyInvalidError,
  PercipioAxiosClientError,
} = require('../index');

const testutils = require('./helpers/utils');
const { default: axios } = require('axios');

/**
 * ### .param
 *
 * Assert that an Axios `Request` object path has a params string parameter with a given
 * key, (optionally) equal to value
 *
 * ```js
 * expect(req).to.have.param('orderby');
 * expect(req).to.have.param('orderby', 'date');
 * expect(req).to.not.have.param('limit');
 * ```
 *
 * @param {String} parameter name
 * @param {String} parameter value
 * @name param
 * @api public
 */

Assertion.addMethod('param', function (name, value) {
  var assertion = new Assertion();
  chai.util.transferFlags(this, assertion);
  assertion._obj = parseObject(
    qs.parse(new URL(this._obj.path, 'https://localhost').search.slice(1))
  );
  assertion.property.apply(assertion, arguments);
});

/**
 * ### .data
 *
 * Assert that an Axios `Request` object has the JSONPayload parameter with a given
 * key, (optionally) equal to value
 *
 * ```js
 * expect(req).to.have.data('orderby');
 * expect(req).to.have.data('orderby', 'date');
 * expect(req).to.not.have.data('limit');
 * ```
 *
 * @param {String} parameter name
 * @param {String} parameter value
 * @name data
 * @api public
 */

Assertion.addMethod('data', function (name, value) {
  var assertion = new Assertion();
  chai.util.transferFlags(this, assertion);
  assertion._obj = JSON.parse(Buffer.concat(this._obj.requestBodyBuffers).toString());
  assertion.property.apply(assertion, arguments);
});

describe('axiosExtras', function () {
  describe('createAxiosInstance', function () {
    let mainconfig;
    let requestConfig;
    let requestNock;

    this.timeout(5000);
    this.slow(2000);

    function setupConfigs() {
      mainconfig = {
        baseURL: 'https://example.com',
        orgId: 'b001e4aa-7ac9-4d15-8ddc-b0c58f6982dd',
        bearer:
          'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXJ2aWNlX2FjY291bnRfaWQiOiIzYzZjMDMxMS03NmRhLTRkMjktYmZkOS1mYTQ0NzZkNmFkNTYiLCJvcmdhbml6YXRpb25faWQiOiJiMDAxZTRhYS03YWM5LTRkMTUtOGRkYy1iMGM1OGY2OTgyZGQiLCJpc3MiOiJhcGkucGVyY2lwaW8uY29tIiwiaWF0IjoxNTk5MDUxMjMwLCJzdWIiOiIyMTIzNDUzOTFkNDIyMmEzZDUyNzVmZGIwMWEyODU0ZDllYTNkYjFlIiwicG9saWN5LWlkIjoicGVyY2lwaW8tYXBpLXN0YW5kYXJkLXBvbGljeSJ9.Eb-tv43j39qphGrUmoL9147SfqVBY2jkiF-yJDLYtKkb6rfDioSGsGRRni8hh0paXRvxRufZYadBw4idnH3i2CriMmhLa1NGutWJR3iH1fuquGNtab0B4qoT76kzLqc7p6CU3zsc7gRLdFqQ8AD7msRuljPc3B7xUPnU4OV11_3kagb2UXvtIoJYI-RegYyUk13_VeplSlZNEIUDhgnkH5N8pmy7VkKaJaMlV6QS410WY3eTFofme2Z9XwoYxk3pTg-yMCzPspm90Tns0B3M_nKUaMrtZ-v1iyhbuiyo6DwyC1Xm0DZm2uuPKh_hheNu7aYlemROHp9Sg2an-_cemx80wcZ9DuAmkLgXxleqmiBD2usL2BjUUF-W2f4DHJhP3l5GUQtOl7XnaoSnSEyJ0m99VE8jU39295PMa5Eg6NFBChUbTaXGVo8efrSzP2lKDAOQS5Qqz25eIRBUYHwBtfpxREl3kj3qWcrcr-WPAd5TD_B61HrWWxCm9U9D74pha2gu5Bz6vwQzyq45duoaVeCM0otcgAKiGK0ndU1CUZLLIo4IUQG9cUVbgRYKNfM_WQCN1Wew-rCDoBcaIbg8hPbRwCvyNNsy525BFbMPuwULQnOw8eLMtOUop2Gr1S_gimDXUeW5wAhdjgh1Jp_sAkwfopizl4WTQpqWPBgDkPU',
      };

      requestConfig = {
        method: 'get',
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

      return client.sendRequest(requestConfig).then((response) => {
        expect(requestNock).to.have.been.requestedWithHeadersMatch({
          authorization: `Bearer ${mainconfig.bearer}`,
          'content-type': 'application/json',
        });
      });
    });

    it('confirm response contains timing data', async function () {
      const client = new PercipioAxiosClient(mainconfig);

      return client.sendRequest(requestConfig).then((response) => {
        expect(response).to.have.property('timings');
        expect(response.timings).to.have.property('sent').that.is.a('date');
        expect(response.timings).to.have.property('received').that.is.a('date');
        expect(response.timings).to.have.property('durationms').that.is.a('number');
      });
    });

    it('throw an error if timings key exists in request config', function () {
      const client = new PercipioAxiosClient(mainconfig);

      // Make request interceptor throw because timings key is not allowed
      requestConfig.timings = {};

      return client.sendRequest(requestConfig).catch((err) => {
        expect(err).to.be.instanceOf(Error);
      });
    });

    it('confirm response contains requestCorrelationId data', async function () {
      const client = new PercipioAxiosClient(mainconfig);

      return client.sendRequest(requestConfig).then((response) => {
        expect(response).to.have.property('requestCorrelationId').that.is.a('string');
      });
    });

    it('confirm response contains specified requestCorrelationId data', async function () {
      const client = new PercipioAxiosClient(mainconfig);
      requestConfig.requestCorrelationId = '12345';
      return client.sendRequest(requestConfig).then((response) => {
        expect(response).to.have.property('requestCorrelationId', '12345');
      });
    });

    it('throw an error', function () {
      const client = new PercipioAxiosClient(mainconfig);

      // Make request interceptor throw because maxBodyLength is to large.
      requestConfig.maxBodyLength = 1;
      requestConfig.data = { maximimlength: 1 };

      return client.sendRequest(requestConfig).catch((err) => {
        expect(err).to.be.instanceOf(Error);
      });
    });

    it('throw error due to timeout', function () {
      const client = new PercipioAxiosClient(mainconfig);

      // Make request interceptor throw because request timesout.
      requestConfig.timeout = 250;
      return client.sendRequest(requestConfig).catch((err) => {
        expect(err).to.be.instanceOf(Error);
      });
    });
  });
});
