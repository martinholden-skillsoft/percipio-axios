const { PercipioAxiosClient } = require('./percipio-axios-client');

/**
 * An Axios Client that provides a consistent approach
 * for making Percipio Reporting Services requests.
 * @category Percipio Client
 */
class PercipioAxiosReportingServicesClient extends PercipioAxiosClient {
  constructor(options) {
    super(options);

    this.description = 'Calls the Reporting Services API.';
  }
  /**
   * Type Definitions
   */

  /**
   * Represents a LearnerActivityReportConfig object
   * @typedef {object} LearnerActivityReportConfig
   * @property {string} [start] - Start date for events retrieval
   * @property {string} [end] - End date for events retrieval
   * @property {"DAY"|"WEEK"|"THIRTY_DAYS"|"CALENDAR_MONTH"} [timeFrame] - To calculate the sta
   * rt/end date dynamically based on timeframe and when the report is submitted date. [User ca
   * n submit an absolute date range (start/end date) or a relative date range (timeframe) but
   * never both]
   * @property {string} [audience="ALL"] - Audience filter, defaults to all audience
   * @property {string} [locale] - The field to use for specifying language. Will default to al
   * l when not specified. example format 'en' or 'fr' or 'de' etc.
   * @property {string} [contentType] - Content types filter, comma delimited and default to al
   * l content types
   * @property {"WORKDAY_REPORTING"} [template] - XML template for LMS based on learning report
   *  export. This parameter is required for XML formatType. `Please Note- If template is prese
   * nt then the value of formatType should be XML only`.
   * @property {string} [plugin] - A highly customized LMS specific LAR export that supports mi
   * nimal configuration. Values are case-sensitive `Please Note- Transform should correspond t
   * o the selected plugin. If transformName is not provided then the transform with the name s
   * imilar to that of the plugin will be used as per preferential logic.`
   * @property {string} [transformName] - Jsonata transform name to transform Percipio fields t
   * o client sepecific fields, either transform name or mapping should be given but not both.
   * @property {string} [mapping] - Jsonata transform mapping to transform Percipio fields to c
   * lient sepecific fields, either transform name or mapping should be given but not both.
   * @property {object} [csvPreferences] - csv preferences to generate csv file for the transfo
   * rmed output
   * @property {boolean} [csvPreferences.header=true] - Represents a csvPreferences.header
   * @property {string} [csvPreferences.rowDelimiter="\\n"] - Represents a csvPreferences.rowDe
   * limiter
   * @property {string} [csvPreferences.columnDelimiter=","] - Represents a csvPreferences.colu
   * mnDelimiter
   * @property {boolean} [csvPreferences.headerForNoRecords=false] - Option to generate headers
   *  in CSV when there is no data. `Please Note - headerForNoRecords will be considered only w
   * hen header is true`
   * @property {object} [sort] - The field to use for sorting and which order to sort in, if so
   * rt is not included the results will be returned descending by lastAccessDate
   * @property {"contentId"|"contentTitle"|"contentType"|"status"|"duration"|"completedDate"|"f
   * irstAccessDate"|"lastAccessDate"|"timesAccessed"|"firstScore"|"lastScore"|"highScore"|"ass
   * essmentAttempts"|"percentOfBookOrVideo"|"audience"} sort.field - Represents a sort.field
   * @property {"asc"|"desc"} sort.order - Represents a sort.order
   * @property {"ACHIEVED"|"ACTIVE"|"COMPLETED"|"LISTENED"|"READ"|"STARTED"|"WATCHED"|"ABANDONE
   * D"} [status] - Learner activity status filter, defaults to all status type
   * @property {string} [sftpId] - SFTP Id associated with OrgId
   * @property {boolean} [isFileRequiredInSftp=true] - Generated files are required to deliver
   * in the respected sftp location. Default value is true.
   * @property {boolean} [zip=false] - Generate the reports in zip file format. Default value i
   * s false.
   * @property {boolean} [encrypt=false] - Generate the report file as PGP encrypted file. Defa
   * ult value is false.
   * @property {boolean} [isPgpFileExtnNotReqrd=false] - If the file that need to be ecncrypted
   *  should not include a extension of .pgp at the end of the file name, the value should be s
   * et to true. If user sets the value as false or doesn't include the flag a .pgp extension w
   * ill be appended at the end of file name.
   * @property {"JSON"|"CSV"|"TXT"} [formatType="JSON"] - Format Type, defaults to JSON, the va
   * lue is extracted from Accept attribute in header
   * @property {string} [fileMask] - Absolute or masked pattern for the generated report file.
   * Example file masks - fileName_{DD}{MM}{YYYY}, fileName_{ORG_ID}
   * @property {string} [folderName] - custom folder under sftp reports wherein the generated r
   * eport file is to be placed.
   * @property {boolean} [includeMillisInFilename=false] - Generate files with unix based times
   * tamp. Example - fileName.csv.1561642446608
   *
   */

  /**
   * Represents a ContentAccessReportConfig object
   * @typedef {object} ContentAccessReportConfig
   * @property {string} [start] - Start date for events retrieval
   * @property {string} [end] - End date for events retrieval
   * @property {"DAY"|"WEEK"|"THIRTY_DAYS"|"CALENDAR_MONTH"} [timeFrame] - To calculate the sta
   * rt/end date dynamically based on timeframe and when the report is submitted date. [User ca
   * n submit an absolute date range (start/end date) or a relative date range (timeframe) but
   * never both]
   * @property {string} [audience="ALL"] - Audience filter, defaults to all audience
   * @property {string} [locale] - The field to use for specifying language. Will default to al
   * l when not specified. example format 'en' or 'fr' or 'de' etc.
   * @property {string} [collectionName="ALL"] - Collections used for content lookup, comma del
   * imited and defaults to all collections
   * @property {string} [assetTypes] - Content types filter, comma delimited and default to all
   *  content types
   * @property {object} [sort] - The field to use for sorting and which order to sort in, if so
   * rt is not included the results will be returned descending by total accesses
   * @property {"collection"|"contentTitle"|"channelTitle"|"contentId"|"contentType"|"uniqueUse
   * rAccesses"|"totalAccesses"|"totalDuration"|"timesAccessed"|"avgDuration"|"totalCompletions
   * "} sort.field - Represents a sort.field
   * @property {"asc"|"desc"} sort.order - Represents a sort.order
   * @property {"Published"|"Retired"|"PendingRetirement"} [status] - Content access status fil
   * ter, defaults to all status type
   * @property {string} [sftpId] - SFTP Id associated with OrgId
   * @property {boolean} [isFileRequiredInSftp=true] - Generated files are required to deliver
   * in the respected sftp location. Default value is true.
   * @property {boolean} [zip=false] - Generate the reports in zip file format. Default value i
   * s false.
   * @property {boolean} [encrypt=false] - Generate the report file as PGP encrypted file. Defa
   * ult value is false.
   * @property {boolean} [isPgpFileExtnNotReqrd=false] - If the file that need to be ecncrypted
   *  should not include a extension of .pgp at the end of the file name, the value should be s
   * et to true. If user sets the value as false or doesn't include the flag a .pgp extension w
   * ill be appended at the end of file name.
   * @property {"JSON"|"CSV"|"TXT"} [formatType="JSON"] - Format Type, defaults to JSON, the va
   * lue is extracted from Accept attribute in header
   * @property {string} [fileMask] - Absolute or masked pattern for the generated report file.
   * Example file masks - fileName_{DD}{MM}{YYYY}, fileName_{ORG_ID}
   * @property {string} [folderName] - custom folder under sftp reports wherein the generated r
   * eport file is to be placed.
   * @property {boolean} [includeMillisInFilename=false] - Generate files with unix based times
   * tamp. Example - fileName.csv.1561642446608
   *
   */

  /**
   * Represents a EntitlementsReportConfig object
   * @typedef {object} EntitlementsReportConfig
   * @property {string} [start] - Start date for events retrieval
   * @property {string} [end] - End date for events retrieval
   * @property {"DAY"|"WEEK"|"THIRTY_DAYS"|"CALENDAR_MONTH"} [timeFrame] - To calculate the sta
   * rt/end date dynamically based on timeframe and when the report is submitted date. [User ca
   * n submit an absolute date range (start/end date) or a relative date range (timeframe) but
   * never both]
   * @property {string} [audience="ALL"] - Audience filter, defaults to all
   * @property {string} [user="ALL"] - Users filter, comma delimited and defaults to all
   * @property {string} [collection="ALL"] - Collection title filter, comma delimited and defau
   * lts to all
   * @property {object} [sort] - The field to use for sorting and which order to sort in, if so
   * rt is not included the results will be returned ascending by collection
   * @property {"collection"|"userId"|"firstName"|"lastName"|"emailAddress"|"entitledByAudience
   * "|"consumed"} sort.field - Represents a sort.field
   * @property {"asc"|"desc"} sort.order - Represents a sort.order
   * @property {string} [sftpId] - SFTP Id associated with OrgId
   * @property {boolean} [isFileRequiredInSftp=true] - Generated files are required to deliver
   * in the respected sftp location. Default value is true.
   * @property {boolean} [zip=false] - Generate the reports in zip file format. Default value i
   * s false.
   * @property {boolean} [encrypt=false] - Generate the report file as PGP encrypted file. Defa
   * ult value is false.
   * @property {boolean} [isPgpFileExtnNotReqrd=false] - If the file that need to be ecncrypted
   *  should not include a extension of .pgp at the end of the file name, the value should be s
   * et to true. If user sets the value as false or doesn't include the flag a .pgp extension w
   * ill be appended at the end of file name.
   * @property {"JSON"|"CSV"|"TXT"} [formatType="JSON"] - Format Type, defaults to JSON, the va
   * lue is extracted from Accept attribute in header
   * @property {string} [fileMask] - Absolute or masked pattern for the generated report file.
   * Example file masks - fileName_{DD}{MM}{YYYY}, fileName_{ORG_ID}
   * @property {string} [folderName] - custom folder under sftp reports wherein the generated r
   * eport file is to be placed.
   * @property {boolean} [includeMillisInFilename=false] - Generate files with unix based times
   * tamp. Example - fileName.csv.1561642446608
   *
   */

  /**
   * Represents a CollectionContentReportConfig object
   * @typedef {object} CollectionContentReportConfig
   * @property {string} collectionName - Collections used for content lookup, comma delimited a
   * nd defaults to all collections
   * @property {object} [sort] - The field to use for sorting and which order to sort in, if so
   * rt is not included the results will be returned ascending by collection
   * @property {"collection"|"channelTitle"|"contentId"|"contentTitle"|"contentType"|"status"|"
   * description"} sort.field - Represents a sort.field
   * @property {"asc"|"desc"} sort.order - Represents a sort.order
   * @property {string} [contentType] - Content types filter, comma delimited and default to al
   * l content types
   * @property {"Published"|"Retired"|"PendingRetirement"} [status] - Content status filter, co
   * mma delimited and defaults to all status type.
   * @property {string} [locale] - The field to use for specifying language. Will default to al
   * l when not specified.  example format 'en' or 'fr' or 'de' etc.
   * @property {string} [sftpId] - SFTP Id associated with OrgId
   * @property {boolean} [isFileRequiredInSftp=true] - Generated files are required to deliver
   * in the respected sftp location. Default value is true.
   * @property {boolean} [zip=false] - Generate the reports in zip file format. Default value i
   * s false.
   * @property {boolean} [encrypt=false] - Generate the report file as PGP encrypted file. Defa
   * ult value is false.
   * @property {boolean} [isPgpFileExtnNotReqrd=false] - If the file that need to be ecncrypted
   *  should not include a extension of .pgp at the end of the file name, the value should be s
   * et to true. If user sets the value as false or doesn't include the flag a .pgp extension w
   * ill be appended at the end of file name.
   * @property {"JSON"|"CSV"|"TXT"} [formatType="JSON"] - Format Type, defaults to JSON, the va
   * lue is extracted from Accept attribute in header
   * @property {string} [fileMask] - Absolute or masked pattern for the generated report file.
   * Example file masks - fileName_{DD}{MM}{YYYY}, fileName_{ORG_ID}
   * @property {string} [folderName] - custom folder under sftp reports wherein the generated r
   * eport file is to be placed.
   * @property {boolean} [includeMillisInFilename=false] - Generate files with unix based times
   * tamp. Example - fileName.csv.1561642446608
   *
   */

  /**
   * Returns a reportId to be used as a handle to retrieve the learner activity results.
   *
   * @param {Object} config  - Configuration object for request
   * @property {LearnerActivityReportConfig} [config.data={}] - The request body to be sent to
   * the API
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosReportingServicesClient
   */
  requestLearningActivityReport({ data = {}, ...other }) {
    const resourceToUse = '/reporting/v1/organizations/{orgId}/report-requests/learning-activity';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, params, extraPlaceholders, ...rest } = other;
    return this.post({ resource: resourceToUse, data, ...rest });
  }

  /**
   * Returns a reportId to be used as a handle to retrieve the popular content access results.
   *
   * @param {Object} config  - Configuration object for request
   * @property {ContentAccessReportConfig} [config.data={}] - The request body to be sent to th
   * e API
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosReportingServicesClient
   */
  requestContentActivityReport({ data = {}, ...other }) {
    const resourceToUse = '/reporting/v1/organizations/{orgId}/report-requests/content-access';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, params, extraPlaceholders, ...rest } = other;
    return this.post({ resource: resourceToUse, data, ...rest });
  }

  /**
   * Returns a reportId to be used as a handle to retrieve the entitlement report results.
   *
   * @param {Object} config  - Configuration object for request
   * @property {EntitlementsReportConfig} [config.data={}] - The request body to be sent to the
   *  API
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosReportingServicesClient
   */
  requestEntitlementReport({ data = {}, ...other }) {
    const resourceToUse = '/reporting/v1/organizations/{orgId}/report-requests/entitlements';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, params, extraPlaceholders, ...rest } = other;
    return this.post({ resource: resourceToUse, data, ...rest });
  }

  /**
   * Returns a reportId to be used as a handle to retrieve the collections content results.
   *
   * @param {Object} config  - Configuration object for request
   * @property {CollectionContentReportConfig} [config.data={}] - The request body to be sent t
   * o the API
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosReportingServicesClient
   */
  requestCollectionsContentReport({ data = {}, ...other }) {
    const resourceToUse = '/reporting/v1/organizations/{orgId}/report-requests/collections-content';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, params, extraPlaceholders, ...rest } = other;
    return this.post({ resource: resourceToUse, data, ...rest });
  }

  /**
   * Handles all learner activity and collection content events.
   *
   * @param {Object} config  - Configuration object for request
   * @property {Object} [config.extraPlaceholders={}] - Additional placeholders to replace in r
   * esource path
   * @property {string} config.extraPlaceholders.reportRequestId - Handle to access the report
   * content
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosReportingServicesClient
   */
  getReportRequest({ extraPlaceholders = {}, ...other }) {
    const resourceToUse = '/reporting/v1/organizations/{orgId}/report-requests/{reportRequestId}';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, data, params, ...rest } = other;
    return this.get({ resource: resourceToUse, extraPlaceholders, ...rest });
  }
}

module.exports = { PercipioAxiosReportingServicesClient };
