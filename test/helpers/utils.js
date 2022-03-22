const nock = require('nock');
const qs = require('qs');
const { parseObject } = require('query-types');
const { accessSafe } = require('access-safe');
const { v4: uuidv4 } = require('uuid');

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

const getCommonNock = (baseUrl, orgId) => {
  return nock(baseUrl)
    .get(`/common/v2/organizations/${orgId}/audiences`)
    .query(true)
    .reply(200, {})
    .get(`/common/v1/organizations/${orgId}/collections`)
    .query(true)
    .reply(200, {})
    .get(`/common/v1/organizations/${orgId}/custom-attributes`)
    .query(true)
    .reply(200, {})
    .get(`/common/v1/organizations/${orgId}/license-pools`)
    .query(true)
    .reply(200, {});
};

const getOperationNock = (baseUrl, path, placeholders) => {
  const fullPath = path.replace(/{([-_a-zA-Z0-9[\]]+)}/g, (original, placeHolder) => {
    if (placeHolder in placeholders) {
      return placeholders[placeHolder];
    }
  });
  return getNock(baseUrl, fullPath);
};

const getAxiosRequestQuerystring = (axiosResponse) => {
  const request = accessSafe(() => axiosResponse.request, null);

  if (!request) {
    return null;
  }

  return parseObject(qs.parse(new URL(request.path, 'https://localhost').search.slice(1)));
};

const isAxiosRequestQuerystringEmpty = (axiosResponse) => {
  const request = accessSafe(() => axiosResponse.request, null);

  if (!request) {
    return true;
  }

  return new URL(request.path, 'https://localhost').search.slice(1).length === 0;
};

const getAxiosRequestBody = (axiosResponse) => {
  const request = accessSafe(() => axiosResponse.request, null);

  if (!request) {
    return null;
  }

  return JSON.parse(Buffer.concat(request.requestBodyBuffers).toString());
};

const isAxiosRequestBodyEmpty = (axiosResponse) => {
  const request = accessSafe(() => axiosResponse.request, null);

  if (!request) {
    return true;
  }

  return request.requestBodyBuffers.length === 0;
};

const getUuid = () => {
  return uuidv4();
};

module.exports = {
  getNock,
  getCommonNock,
  getOperationNock,
  getAxiosRequestQuerystring,
  isAxiosRequestQuerystringEmpty,
  getAxiosRequestBody,
  isAxiosRequestBodyEmpty,
  getUuid,
};
