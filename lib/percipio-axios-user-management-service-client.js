const { PercipioAxiosClient } = require('./percipio-axios-client');

/**
 * An Axios Client that provides a consistent approach
 * for making Percipio User Management Service requests.
 * @category Percipio Client
 */
class PercipioAxiosUserManagementServiceClient extends PercipioAxiosClient {
  constructor(options) {
    super(options);

    this.description = 'Calls the User Management Service API.';
  }
  /**
   * Type Definitions
   */

  /**
   * Represents a CreateUserCustomAttribute object
   * @typedef {object} CreateUserCustomAttribute
   * @property {string} [id] - Percipio UUID for this custom attribute.  The id and/or name can
   *  be provided to specify which custom attribute value to set for the user.  If both id and
   * name are provided then only the id will be used when finding the custom attribute to updat
   * e the value for.
   * @property {string} [name] - The label used within Percipio to identify this custom attribu
   * te.  If the custom attribute id is not included, this label will be used to find the custo
   * m attribute to updated the value for.
   * @property {string} value - Represents a value
   *
   */

  /**
   * Represents a CreateUser object
   * @typedef {object} CreateUser
   * @property {string} [password] - Organizations that exclusively use SSO, or notify users to
   *  set their own password, do not need to set this value.  When providing a password, the va
   * lue must have at least 8 characters and contain at least 3 of the following 4 types of cha
   * racters... Lower case letters (a-z), Upper case letters (A-Z), Numbers (0-9), Special char
   * acters (e.g. !@#%^&*)
   * @property {boolean} [sendWelcomeEmail=false] - True for sending Welcome Email, false for s
   * uppressing welcome email.
   * @property {string} externalUserId - Client system user identifier that is external to Perc
   * ipio.  This is typically the primary key for the user in your system.
   * @property {string} [email] - Represents an email
   * @property {boolean} [isActive] - Status of the user, only active users can access site.
   * @property {string} [loginName] - Value that a user can use to log directly into Percipio
   * @property {string} [firstName] - Represents a firstName
   * @property {string} [lastName] - Represents a lastName
   * @property {"LEARNER"|"ADMIN"|"CONTENT_CURATOR"|"CONTENT_COORDINATOR"|"LEARNING_ADMIN"|"MAN
   * AGER"} [role] - Used to determine what functionality the user can access.
   * @property {CreateUserCustomAttribute[]} [customAttributes] - Organization defined custom a
   * ttributes
   * @property {boolean} [isInstructor=false] - Instructor, user will act as a Instructor.
   *
   */

  /**
   * Represents a UpdateUserCustomAttribute object
   * @typedef {object} UpdateUserCustomAttribute
   * @property {string} [id] - Percipio UUID for this custom attribute.  The id and/or name can
   *  be provided to specify which custom attribute value to set for the user.  If both id and
   * name are provided then only the id will be used when finding the custom attribute to updat
   * e the value for.
   * @property {string} [name] - The label used within Percipio to identify this custom attribu
   * te.  If the custom attribute id is not included, this label will be used to find the custo
   * m attribute to updated the value for.
   * @property {string} value - Represents a value
   *
   */

  /**
   * Represents a UpdateUser object
   * @typedef {object} UpdateUser
   * @property {string} [password] - Organizations that exclusively use SSO, or notify users to
   *  set their own password, do not need to set this value.  When providing a password, the va
   * lue must have at least 8 characters and contain at least 3 of the following 4 types of cha
   * racters... Lower case letters (a-z), Upper case letters (A-Z), Numbers (0-9), Special char
   * acters (e.g. !@#%^&*)
   * @property {boolean} [sendWelcomeEmail=false] - True for sending Welcome Email, false for s
   * uppressing welcome email; ignored on update.
   * @property {string} [externalUserId] - Client system user identifier that is external to Pe
   * rcipio.  This is typically the primary key for the user in your system.
   * @property {string} [email] - Represents an email
   * @property {boolean} [isActive] - Status of the user, only active users can access site.
   * @property {string} [loginName] - Value that a user can use to log directly into Percipio
   * @property {string} [firstName] - Represents a firstName
   * @property {string} [lastName] - Represents a lastName
   * @property {"LEARNER"|"ADMIN"|"CONTENT_CURATOR"|"CONTENT_COORDINATOR"|"LEARNING_ADMIN"|"MAN
   * AGER"} [role] - Used to determine what functionality the user can access.
   * @property {UpdateUserCustomAttribute[]} [customAttributes] - Organization defined custom a
   * ttributes
   * @property {boolean} [isInstructor=false] - Instructor, user will act as a Instructor.
   *
   */

  /**
   * Represents a BatchUsercustomAttributes object
   * @typedef {object} BatchUsercustomAttributes
   * @property {string} [name] - The label used within Percipio to identify this custom attribu
   * te.  If the custom attribute id is not included, this label will be used to find the custo
   * m attribute to updated the value for.
   * @property {string} [value] - Represents a value
   *
   */

  /**
   * Represents a BatchUser object
   * @typedef {object} BatchUser
   * @property {string} [newPassword] - Organizations that exclusively use SSO, or notify users
   *  to set their own password, do not need to set this value.  When providing a password, the
   *  value must have at least 8 characters and contain at least 3 of the following 4 types of
   * characters... Lower case letters (a-z), Upper case letters (A-Z), Numbers (0-9), Special c
   * haracters (e.g. !@#%^&*)
   * @property {boolean} [sendWelcomeEmail=false] - True for sending Welcome Email, false for s
   * uppressing welcome email.
   * @property {string} [externalUserId] - Client system user identifier that is external to Pe
   * rcipio.  This is typically the primary key for the user in your system.
   * @property {string} [email] - Represents an email
   * @property {boolean} [isActive] - Status of the user, only active users can access site.
   * @property {string} [loginName] - Value that a user can use to log directly into Percipio
   * @property {string} [firstName] - Represents a firstName
   * @property {string} [lastName] - Represents a lastName
   * @property {"en"|"es"|"de"|"fr"|"pt"|"ja"|"zh"} [welcomeEmailLanguage] - Represents a welco
   * meEmailLanguage
   * @property {"LEARNER"|"ADMIN"|"CONTENT_CURATOR"|"CONTENT_COORDINATOR"|"LEARNING_ADMIN"|"MAN
   * AGER"} [role] - Used to determine what functionality the user can access.
   * @property {BatchUsercustomAttributes[]} [customAttributes] - Organization defined custom a
   * ttributes
   * @property {boolean} [isInstructor=false] - Instructor, user will act as a Instructor.
   * @property {boolean} [mustResetPassword=false] - Whether or not the user must reset their p
   * assword on initial login.
   *
   */

  /**
   * Retrieve a list of users based on the filter criteria
   *
   * @param {Object} config  - Configuration object for request
   * @property {Object} [config.params={}] - The params to send with the request, any unsupport
   * ed params will be silently ignored.
   * @property {integer} [config.params.offset=0] - Used in conjunction with 'max' to specify w
   * hich set of 'max' users should be returned.  The default is 0 which returns 1 through max
   * users.  If offset is sent as 1, then users 2 through max+1 are returned.
   * @property {integer} [config.params.max=1000] - The maximum number of users to return in a
   * response.  The default is 1000.  Valid values are between 1 and 1000.
   * @property {string} [config.params.updatedSince] - Filter criteria that only returns users
   * updated since the date specified in GMT.
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosUserManagementServiceClient
   */
  getUsers({ params = {}, ...other }) {
    const resourceToUse = '/user-management/v1/organizations/{orgId}/users';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, data, extraPlaceholders, ...rest } = other;
    // Remove unsupported params, and ensure default params are set.
    const paramsToUse = (({ offset = 0, max = 1000, updatedSince }) => ({
      offset,
      max,
      updatedSince,
    }))(params);

    return this.get({ resource: resourceToUse, params: paramsToUse, ...rest });
  }

  /**
   * Create a new user
   *
   * @param {Object} config  - Configuration object for request
   * @property {CreateUser} [config.data={}] - The request body to be sent to the API
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosUserManagementServiceClient
   */
  createUser({ data = {}, ...other }) {
    const resourceToUse = '/user-management/v1/organizations/{orgId}/users';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, params, extraPlaceholders, ...rest } = other;
    return this.post({ resource: resourceToUse, data, ...rest });
  }

  /**
   * Retrieve a user by UUID
   *
   * @param {Object} config  - Configuration object for request
   * @property {Object} [config.extraPlaceholders={}] - Additional placeholders to replace in r
   * esource path
   * @property {string} config.extraPlaceholders.id - User UUID
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosUserManagementServiceClient
   */
  getUserByUuid({ extraPlaceholders = {}, ...other }) {
    const resourceToUse = '/user-management/v1/organizations/{orgId}/users/{id}';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, data, params, ...rest } = other;
    return this.get({ resource: resourceToUse, extraPlaceholders, ...rest });
  }

  /**
   * Update user by UUID
   *
   * @param {Object} config  - Configuration object for request
   * @property {Object} [config.extraPlaceholders={}] - Additional placeholders to replace in r
   * esource path
   * @property {string} config.extraPlaceholders.id - User UUID
   * @property {UpdateUser} [config.data={}] - The request body to be sent to the API
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosUserManagementServiceClient
   */
  updateUserByUuid({ extraPlaceholders = {}, data = {}, ...other }) {
    const resourceToUse = '/user-management/v1/organizations/{orgId}/users/{id}';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, params, ...rest } = other;
    return this.patch({ resource: resourceToUse, extraPlaceholders, data, ...rest });
  }

  /**
   * Retrieve a user by external user id
   *
   * @param {Object} config  - Configuration object for request
   * @property {Object} [config.extraPlaceholders={}] - Additional placeholders to replace in r
   * esource path
   * @property {string} config.extraPlaceholders.externalUserId - external user identifier
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosUserManagementServiceClient
   */
  getUserByExternalUserId({ extraPlaceholders = {}, ...other }) {
    const resourceToUse =
      '/user-management/v1/organizations/{orgId}/users/external-user-id/{externalUserId}';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, data, params, ...rest } = other;
    return this.get({ resource: resourceToUse, extraPlaceholders, ...rest });
  }

  /**
   * Upsert user by external user id
   *
   * @param {Object} config  - Configuration object for request
   * @property {Object} [config.extraPlaceholders={}] - Additional placeholders to replace in r
   * esource path
   * @property {string} config.extraPlaceholders.externalUserId - Client system user identifier
   *  that is external to Percipio.  This is typically the primary key for the user in your sys
   * tem.
   * @property {UpdateUser} [config.data={}] - The request body to be sent to the API
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosUserManagementServiceClient
   */
  upsertUserByExternalUserId({ extraPlaceholders = {}, data = {}, ...other }) {
    const resourceToUse =
      '/user-management/v1/organizations/{orgId}/users/external-user-id/{externalUserId}';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, params, ...rest } = other;
    return this.patch({ resource: resourceToUse, extraPlaceholders, data, ...rest });
  }

  /**
   * Retrieve a user by login name
   *
   * @param {Object} config  - Configuration object for request
   * @property {Object} [config.extraPlaceholders={}] - Additional placeholders to replace in r
   * esource path
   * @property {string} config.extraPlaceholders.loginName - login name of the user
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosUserManagementServiceClient
   */
  getUserByLoginName({ extraPlaceholders = {}, ...other }) {
    const resourceToUse = '/user-management/v1/organizations/{orgId}/users/login-name/{loginName}';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, data, params, ...rest } = other;
    return this.get({ resource: resourceToUse, extraPlaceholders, ...rest });
  }

  /**
   * Upsert user by login name
   *
   * @param {Object} config  - Configuration object for request
   * @property {Object} [config.extraPlaceholders={}] - Additional placeholders to replace in r
   * esource path
   * @property {string} config.extraPlaceholders.loginName - login name of the user
   * @property {UpdateUser} [config.data={}] - The request body to be sent to the API
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosUserManagementServiceClient
   */
  upsertUserByLoginName({ extraPlaceholders = {}, data = {}, ...other }) {
    const resourceToUse = '/user-management/v1/organizations/{orgId}/users/login-name/{loginName}';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, params, ...rest } = other;
    return this.patch({ resource: resourceToUse, extraPlaceholders, data, ...rest });
  }

  /**
   * Retrieve a user by Email-Id
   *
   * @param {Object} config  - Configuration object for request
   * @property {Object} [config.extraPlaceholders={}] - Additional placeholders to replace in r
   * esource path
   * @property {string} config.extraPlaceholders.loginNameOrEmail - Login name or Email Id of t
   * he user
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosUserManagementServiceClient
   */
  getUserByEmailId({ extraPlaceholders = {}, ...other }) {
    const resourceToUse =
      '/user-management/v1/organizations/{orgId}/users/login-name-or-email/{loginNameOrEmail}';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, data, params, ...rest } = other;
    return this.get({ resource: resourceToUse, extraPlaceholders, ...rest });
  }

  /**
   * Accepts the batch users request and return a handler.
   *
   * @param {Object} config  - Configuration object for request
   * @property {BatchUser[]} [config.data=[]] - The request body to be sent to the API
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosUserManagementServiceClient
   */
  createBatchUsersRequest({ data = [], ...other }) {
    const resourceToUse = '/user-management/v1/organizations/{orgId}/batch-users-request';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, params, extraPlaceholders, ...rest } = other;
    return this.post({ resource: resourceToUse, data, ...rest });
  }

  /**
   * Accepts the batch request handler and returns the processing response.
   *
   * @param {Object} config  - Configuration object for request
   * @property {Object} [config.extraPlaceholders={}] - Additional placeholders to replace in r
   * esource path
   * @property {string} config.extraPlaceholders.batchUsersRequestId - Handle to access the bat
   * ch processing response.
   * @property {...*} [config.*] - Any other Axios Request Config properties to pass to the request.
   * See {@link https://github.com/axios/axios#request-config|Axios Request Config}
   * @return {Promise}
   * @memberof PercipioAxiosUserManagementServiceClient
   */
  getBatchUsersRequest({ extraPlaceholders = {}, ...other }) {
    const resourceToUse =
      '/user-management/v1/organizations/{orgId}/batch-users-request/{batchUsersRequestId}';
    // Remove unsupported arguments before calling percipio-axios-client
    const { method, resource, data, params, ...rest } = other;
    return this.get({ resource: resourceToUse, extraPlaceholders, ...rest });
  }
}

module.exports = { PercipioAxiosUserManagementServiceClient };
