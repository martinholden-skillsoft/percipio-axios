const { PercipioAxiosClient } = require('./lib/percipio-axios-client');

const {
  PropertyRequiredError,
  PropertyInvalidError,
  PercipioAxiosClientError,
} = require('./lib/errors');

const {
  PercipioAxiosUserManagementServiceClient,
} = require('./lib/percipio-axios-user-management-service-client');

const {
  PercipioAxiosReportingServicesClient,
} = require('./lib/percipio-axios-reporting-services-client');

const {
  PercipioAxiosContentDiscoveryServiceClient,
} = require('./lib/percipio-axios-content-discovery-service-client');

const {
  PercipioAxiosCommonServicesClient,
} = require('./lib/percipio-axios-common-services-client');

module.exports = {
  PercipioAxiosClient,
  PropertyRequiredError,
  PropertyInvalidError,
  PercipioAxiosClientError,
  PercipioAxiosUserManagementServiceClient,
  PercipioAxiosReportingServicesClient,
  PercipioAxiosContentDiscoveryServiceClient,
  PercipioAxiosCommonServicesClient,
};
