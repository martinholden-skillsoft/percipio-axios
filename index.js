const { PercipioAxiosClient } = require('./lib/percipio-axios-client');

const {
  PropertyRequiredError,
  PropertyInvalidError,
  PercipioAxiosClientError,
} = require('./lib/errors');

const {
  PercipioAxiosCommonServicesClient,
} = require('./lib/percipio-axios-common-services-client');

const {
  PercipioAxiosContentDiscoveryServiceClient,
} = require('./lib/percipio-axios-content-discovery-service-client');

const {
  PercipioAxiosReportingServicesClient,
} = require('./lib/percipio-axios-reporting-services-client');

const {
  PercipioAxiosUserManagementServiceClient,
} = require('./lib/percipio-axios-user-management-service-client');

module.exports = {
  PercipioAxiosClient,
  PropertyRequiredError,
  PropertyInvalidError,
  PercipioAxiosClientError,
  PercipioAxiosCommonServicesClient,
  PercipioAxiosContentDiscoveryServiceClient,
  PercipioAxiosReportingServicesClient,
  PercipioAxiosUserManagementServiceClient,
};
