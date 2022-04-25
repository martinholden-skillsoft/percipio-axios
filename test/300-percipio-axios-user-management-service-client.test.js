const chai = require('chai');
const chaiMatch = require('chai-match');

chai.use(chaiMatch);

const { expect } = require('chai');

const {
  PercipioAxiosUserManagementServiceClient,
  PropertyRequiredError,
  PropertyInvalidError,
  PercipioAxiosClientError,
} = require('../index');

describe('PercipioAxiosUserManagementServiceClient', function () {
  describe('constructors', function () {
    const mainconfig = {
      baseURL: 'https://example.com',
      orgId: 'b001e4aa-7ac9-4d15-8ddc-b0c58f6982dd',
      bearer:
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXJ2aWNlX2FjY291bnRfaWQiOiIzYzZjMDMxMS03NmRhLTRkMjktYmZkOS1mYTQ0NzZkNmFkNTYiLCJvcmdhbml6YXRpb25faWQiOiJiMDAxZTRhYS03YWM5LTRkMTUtOGRkYy1iMGM1OGY2OTgyZGQiLCJpc3MiOiJhcGkucGVyY2lwaW8uY29tIiwiaWF0IjoxNTk5MDUxMjMwLCJzdWIiOiIyMTIzNDUzOTFkNDIyMmEzZDUyNzVmZGIwMWEyODU0ZDllYTNkYjFlIiwicG9saWN5LWlkIjoicGVyY2lwaW8tYXBpLXN0YW5kYXJkLXBvbGljeSJ9.Eb-tv43j39qphGrUmoL9147SfqVBY2jkiF-yJDLYtKkb6rfDioSGsGRRni8hh0paXRvxRufZYadBw4idnH3i2CriMmhLa1NGutWJR3iH1fuquGNtab0B4qoT76kzLqc7p6CU3zsc7gRLdFqQ8AD7msRuljPc3B7xUPnU4OV11_3kagb2UXvtIoJYI-RegYyUk13_VeplSlZNEIUDhgnkH5N8pmy7VkKaJaMlV6QS410WY3eTFofme2Z9XwoYxk3pTg-yMCzPspm90Tns0B3M_nKUaMrtZ-v1iyhbuiyo6DwyC1Xm0DZm2uuPKh_hheNu7aYlemROHp9Sg2an-_cemx80wcZ9DuAmkLgXxleqmiBD2usL2BjUUF-W2f4DHJhP3l5GUQtOl7XnaoSnSEyJ0m99VE8jU39295PMa5Eg6NFBChUbTaXGVo8efrSzP2lKDAOQS5Qqz25eIRBUYHwBtfpxREl3kj3qWcrcr-WPAd5TD_B61HrWWxCm9U9D74pha2gu5Bz6vwQzyq45duoaVeCM0otcgAKiGK0ndU1CUZLLIo4IUQG9cUVbgRYKNfM_WQCN1Wew-rCDoBcaIbg8hPbRwCvyNNsy525BFbMPuwULQnOw8eLMtOUop2Gr1S_gimDXUeW5wAhdjgh1Jp_sAkwfopizl4WTQpqWPBgDkPU',
    };

    beforeEach(function () {
      // runs before each test in this block
    });

    it('throws PropertyRequiredError if baseURL is not supplied', function () {
      // clone and then remove baseURL from config
      const config = (({ baseURL, ...o }) => o)(mainconfig);

      expect(() => new PercipioAxiosUserManagementServiceClient(config)).to.throw(
        PropertyRequiredError
      );
    });

    it('throws PropertyInvalidError if baseURL is not url', function () {
      // clone and then remove baseURL from config
      const config = (({ baseURL, ...o }) => o)(mainconfig);
      config.baseURL = 'example.com';

      expect(() => new PercipioAxiosUserManagementServiceClient(config)).to.throw(
        PropertyInvalidError
      );
    });

    it('throws PropertyInvalidError if baseURL is not https', function () {
      // clone and then remove baseURL from config
      const config = (({ baseURL, ...o }) => o)(mainconfig);
      config.baseURL = 'http://example.com';

      expect(() => new PercipioAxiosUserManagementServiceClient(config)).to.throw(
        PropertyInvalidError
      );
    });

    it('throws PropertyRequiredError if orgId is not supplied', function () {
      // clone and then remove orgId from config
      const config = (({ orgId, ...o }) => o)(mainconfig);

      expect(() => new PercipioAxiosUserManagementServiceClient(config)).to.throw(
        PropertyRequiredError
      );
    });

    it('throws PropertyInvalidError if orgId is not uuid', function () {
      // clone and then remove orgId from config
      const config = (({ orgId, ...o }) => o)(mainconfig);
      config.orgId = 'not-a-uuid';

      expect(() => new PercipioAxiosUserManagementServiceClient(config)).to.throw(
        PropertyInvalidError
      );
    });

    it('throws PropertyRequiredError if bearer is not supplied', function () {
      // clone and then remove bearer from config
      const config = (({ bearer, ...o }) => o)(mainconfig);

      expect(() => new PercipioAxiosUserManagementServiceClient(config)).to.throw(
        PropertyRequiredError
      );
    });

    it('throws PropertyInvalidError if bearer is not a JWT', function () {
      // clone and then remove orgId from config
      const config = (({ bearer, ...o }) => o)(mainconfig);
      config.bearer = 'not-a-jwt';

      expect(() => new PercipioAxiosUserManagementServiceClient(config)).to.throw(
        PropertyInvalidError
      );
    });

    it('throws PropertyInvalidError if instance is not an Axios Instance', function () {
      // clone and then remove orgId from config
      const config = (({ ...o }) => o)(mainconfig);
      config.instance = {};

      expect(() => new PercipioAxiosUserManagementServiceClient(config)).to.throw(
        PropertyInvalidError
      );
    });

    it('creates PercipioAxiosUserManagementServiceClient', function () {
      const client = new PercipioAxiosUserManagementServiceClient(mainconfig);
      expect(client).to.be.instanceof(PercipioAxiosUserManagementServiceClient);
      expect(client).to.have.property('instance');
      expect(client).to.have.property('configuration');
      expect(client.buildPath).to.be.instanceOf(Function, 'buildPath is not a function of client');
      expect(client.getUsers).to.be.instanceOf(Function, 'getUsers is not a function of client');
      expect(client.createUser).to.be.instanceOf(
        Function,
        'createUser is not a function of client'
      );
      expect(client.getUserByUuid).to.be.instanceOf(
        Function,
        'getUserByUuid is not a function of client'
      );
      expect(client.updateUserByUuid).to.be.instanceOf(
        Function,
        'updateUserByUuid is not a function of client'
      );
      expect(client.getUserByExternalUserId).to.be.instanceOf(
        Function,
        'getUserByExternalUserId is not a function of client'
      );
      expect(client.upsertUserByExternalUserId).to.be.instanceOf(
        Function,
        'upsertUserByExternalUserId is not a function of client'
      );
      expect(client.getUserByLoginName).to.be.instanceOf(
        Function,
        'getUserByLoginName is not a function of client'
      );
      expect(client.upsertUserByLoginName).to.be.instanceOf(
        Function,
        'upsertUserByLoginName is not a function of client'
      );
      expect(client.getUserByEmailId).to.be.instanceOf(
        Function,
        'getUserByEmailId is not a function of client'
      );
      expect(client.createBatchUsersRequest).to.be.instanceOf(
        Function,
        'createBatchUsersRequest is not a function of client'
      );
      expect(client.getBatchUsersRequest).to.be.instanceOf(
        Function,
        'getBatchUsersRequest is not a function of client'
      );
    });
  });
});
