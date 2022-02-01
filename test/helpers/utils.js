const nock = require('nock');
const qs = require('qs');
const { parseObject } = require('query-types');
const { accessSafe } = require('access-safe');

const getNock = (baseUrl, path) => {
  return nock(baseUrl)
    .delete(path)
    .query(true)
    .reply(200, {})
    .get(path)
    .query(true)
    .reply(200, {})
    .head(path)
    .query(true)
    .reply(200, {})
    .options(path)
    .query(true)
    .reply(200, {})
    .patch(path)
    .query(true)
    .reply(200, {})
    .post(path)
    .query(true)
    .reply(200, {})
    .put(path)
    .query(true)
    .reply(200, {});
};

const getAxiosRequestQuerystring = (axiosResponse) => {
  const request = accessSafe(() => axiosResponse.request, null);

  if (!request) {
    return null;
  }

  return parseObject(qs.parse(new URL(request.path, 'https://localhost').search.slice(1)));
};

const getAxiosRequestBody = (axiosResponse) => {
  const request = accessSafe(() => axiosResponse.request, null);

  if (!request) {
    return null;
  }

  return JSON.parse(Buffer.concat(request.requestBodyBuffers).toString());
};

module.exports = {
  getNock,
  getAxiosRequestQuerystring,
  getAxiosRequestBody,
};
