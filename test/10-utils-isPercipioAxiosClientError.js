const chai = require('chai');
const chaiMatch = require('chai-match');

chai.use(chaiMatch);

const { expect } = require('chai');

const { isPercipioAxiosClientError } = require('../lib/utils');
const errors = require('../errors');

describe('utils', function () {
  describe('isPercipioAxiosClientError function', function () {
    beforeEach(function () {
      // runs before each test in this block
    });

    it('plain error', function () {
      const error = new Error();
      expect(isPercipioAxiosClientError(error)).to.be.false;
    });

    it('PercipioAxiosClientError error', function () {
      const error = new errors.PercipioAxiosClientError();
      expect(isPercipioAxiosClientError(error)).to.be.true;
    });

    it('PropertyRequiredError error', function () {
      const error = new errors.PropertyRequiredError();
      expect(isPercipioAxiosClientError(error)).to.be.true;
    });

    it('PropertyInvalidError error', function () {
      const error = new errors.PropertyInvalidError();
      expect(isPercipioAxiosClientError(error)).to.be.true;
    });
  });
});
