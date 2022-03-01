const { PercipioAxiosClient } = require('./lib/percipio-axios-client');
const {
  PercipioAxiosCommonServicesClient,
} = require('./lib/percipio-axios-common-services-client');
const {
  PercipioAxiosReportingServicesClient,
} = require('./lib/percipio-axios-reporting-services-client');
const {
  PercipioAxiosContentDiscoveryServiceClient,
} = require('./lib/percipio-axios-content-discovery-service-client');
const {
  PercipioAxiosUserManagementServiceClient,
} = require('./lib/percipio-axios-user-management-service-client');

const {
  PropertyRequiredError,
  PropertyInvalidError,
  PercipioAxiosClientError,
} = require('./lib/errors');

module.exports = {
  PercipioAxiosClient,
  PercipioAxiosCommonServicesClient,
  PercipioAxiosReportingServicesClient,
  PercipioAxiosContentDiscoveryServiceClient,
  PercipioAxiosUserManagementServiceClient,
  PropertyRequiredError,
  PropertyInvalidError,
  PercipioAxiosClientError,
};
