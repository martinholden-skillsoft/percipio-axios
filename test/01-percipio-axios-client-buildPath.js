const chai = require('chai');
const chaiMatch = require('chai-match');

chai.use(chaiMatch);

const { expect } = require('chai');

const { PercipioAxiosClient } = require('../index');
const errors = require('../lib/errors');

describe('PercipioAxiosClient', function () {
  describe('buildPath function', function () {
    const mainconfig = {
      baseURL: 'https://example.com',
      orgId: 'b001e4aa-7ac9-4d15-8ddc-b0c58f6982dd',
      bearer:
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXJ2aWNlX2FjY291bnRfaWQiOiIzYzZjMDMxMS03NmRhLTRkMjktYmZkOS1mYTQ0NzZkNmFkNTYiLCJvcmdhbml6YXRpb25faWQiOiJiMDAxZTRhYS03YWM5LTRkMTUtOGRkYy1iMGM1OGY2OTgyZGQiLCJpc3MiOiJhcGkucGVyY2lwaW8uY29tIiwiaWF0IjoxNTk5MDUxMjMwLCJzdWIiOiIyMTIzNDUzOTFkNDIyMmEzZDUyNzVmZGIwMWEyODU0ZDllYTNkYjFlIiwicG9saWN5LWlkIjoicGVyY2lwaW8tYXBpLXN0YW5kYXJkLXBvbGljeSJ9.Eb-tv43j39qphGrUmoL9147SfqVBY2jkiF-yJDLYtKkb6rfDioSGsGRRni8hh0paXRvxRufZYadBw4idnH3i2CriMmhLa1NGutWJR3iH1fuquGNtab0B4qoT76kzLqc7p6CU3zsc7gRLdFqQ8AD7msRuljPc3B7xUPnU4OV11_3kagb2UXvtIoJYI-RegYyUk13_VeplSlZNEIUDhgnkH5N8pmy7VkKaJaMlV6QS410WY3eTFofme2Z9XwoYxk3pTg-yMCzPspm90Tns0B3M_nKUaMrtZ-v1iyhbuiyo6DwyC1Xm0DZm2uuPKh_hheNu7aYlemROHp9Sg2an-_cemx80wcZ9DuAmkLgXxleqmiBD2usL2BjUUF-W2f4DHJhP3l5GUQtOl7XnaoSnSEyJ0m99VE8jU39295PMa5Eg6NFBChUbTaXGVo8efrSzP2lKDAOQS5Qqz25eIRBUYHwBtfpxREl3kj3qWcrcr-WPAd5TD_B61HrWWxCm9U9D74pha2gu5Bz6vwQzyq45duoaVeCM0otcgAKiGK0ndU1CUZLLIo4IUQG9cUVbgRYKNfM_WQCN1Wew-rCDoBcaIbg8hPbRwCvyNNsy525BFbMPuwULQnOw8eLMtOUop2Gr1S_gimDXUeW5wAhdjgh1Jp_sAkwfopizl4WTQpqWPBgDkPU',
    };

    beforeEach(function () {
      // runs before each test in this block
    });

    it('is a function', function () {
      const client = new PercipioAxiosClient(mainconfig);
      expect(client.buildPath).to.be.instanceOf(Function);
    });

    it('handles path without placeHolder(s)', function () {
      const client = new PercipioAxiosClient(mainconfig);
      expect(client.buildPath('/test')).to.equal('/test');
    });

    it('handles path with placeHolder(s)', function () {
      const client = new PercipioAxiosClient(mainconfig);
      expect(client.buildPath('/test/{orgId}')).to.equal(`/test/${mainconfig.orgId}`);
    });

    it('handles path with additional placeHolder(s)', function () {
      const client = new PercipioAxiosClient(mainconfig);

      const additionalPlaceholders = {
        testPlaceholder: 'testresult',
      };
      const testResource = '/test/{orgId}/{testPlaceholder}';
      const expectedResult = `/test/${mainconfig.orgId}/${additionalPlaceholders.testPlaceholder}`;

      expect(client.buildPath(testResource, additionalPlaceholders)).to.equal(expectedResult);
    });

    it('ensures additional placeHolder(s) do not take precedence', function () {
      const client = new PercipioAxiosClient(mainconfig);

      const additionalPlaceholders = {
        testPlaceholder: 'testresult',
        orgId: 'thisShouldNotBeUsed',
      };
      const testResource = '/test/{orgId}/{testPlaceholder}';
      const expectedResult = `/test/${mainconfig.orgId}/${additionalPlaceholders.testPlaceholder}`;

      expect(client.buildPath(testResource, additionalPlaceholders)).to.equal(expectedResult);
    });

    it('throws PropertyRequiredError if placeHolder not present', function () {
      const key = 'orgId1';

      const client = new PercipioAxiosClient(mainconfig);
      expect(() => client.buildPath(`/test/{${key}}`)).to.throw(errors.PropertyRequiredError);
    });
  });
});
