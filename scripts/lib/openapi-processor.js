const { accessSafe } = require('access-safe');
const _ = require('lodash');
const wrap = require('word-wrap');

const CustomTypesProcessor = require('./custom-types-processor');
const ParameterProcessor = require('./parameter-processor');

class OpenAPIProcessor {
  constructor(openAPISpec, options) {
    this.openAPISpec = openAPISpec;
    this.viewdata = {};

    this.defaults = {
      dataInfo: {
        basePath: 'config.data',
        basePathMessage: 'The request body to be sent to the API',
      },
      pathPlaceholderInfo: {
        basePath: 'config.extraPlaceholders',
        basePathMessage: 'Additional placeholders to replace in resource path',
      },
      parametersInfo: {
        basePath: 'config.params',
        basePathMessage: `The params to send with the request, any unsupported params will be silently ignored.`,
      },
      wrapOptions: {
        width: 90,
        indent: '',
        trim: true,
        newline: '\n',
        cut: true,
      },
    };
    this.config = _.extend({}, this.defaults, options);

    if (!this.isEmptySpec()) {
      this.process();
    }
  }

  getDataDescription(dataObject) {
    const result = [];
    const { basePath, basePathMessage } = this.config.dataInfo;

    const basePathString = basePath ? `${_.trimEnd(basePath, '.')}` : '';

    let schema = dataObject;
    let type = '{}';
    let namepathSuffix = '';

    if (schema.type === 'array') {
      schema = schema.items;
      type = '[]';
      namepathSuffix = '[]';
    }

    const namepath = schema.$$ref.substring(1).split('/').pop();

    result.push(
      `@property {${namepath}${namepathSuffix}} [${basePathString}=${type}]${
        basePathMessage ? ` - ${basePathMessage}` : ''
      }`
    );
    return result.reduce((previousValue, currentValue) => {
      return [...previousValue, ...wrap(currentValue, this.config.wrapOptions).split('\n')];
    }, []);
  }

  isEmptySpec() {
    return Object.keys(this.openAPISpec).length === 0;
  }

  processOperationParameters(parameters) {
    const pathParameters = parameters.filter((pathPlaceHolder) => {
      return pathPlaceHolder.in === 'path' && pathPlaceHolder.name !== 'orgId';
    });

    const pathPlaceHolders = pathParameters.map((pathPlaceHolder) => {
      return {
        name: pathPlaceHolder.name,
        required: pathPlaceHolder.required,
      };
    });

    const pathPlaceHolderJSDOC = new ParameterProcessor(
      pathParameters,
      this.config.pathPlaceholderInfo
    )
      .getJSDOC()
      .reduce((previousValue, currentValue) => {
        return [...previousValue, ...wrap(currentValue, this.config.wrapOptions).split('\n')];
      }, []);

    const queryParameters = parameters.filter((pathPlaceHolder) => {
      return pathPlaceHolder.in === 'query';
    });

    const params = queryParameters.map((param) => {
      const defaultVal = accessSafe(() => param.schema.default, null);
      return {
        name: param.name,
        default: defaultVal,
        hasDefault: defaultVal !== null,
        paramToUseString: `${param.name}${defaultVal !== null ? `=${defaultVal}` : ''}`,
      };
    });

    const paramsJSDOC = new ParameterProcessor(queryParameters, this.config.parametersInfo)
      .getJSDOC()
      .reduce((previousValue, currentValue) => {
        return [...previousValue, ...wrap(currentValue, this.config.wrapOptions).split('\n')];
      }, []);

    return {
      pathPlaceHolders,
      pathPlaceHolderJSDOC,
      hasPathPlaceHolders: pathPlaceHolders.length > 0,
      params,
      paramsJSDOC,
      hasParams: params.length > 0,
    };
  }

  processOperationData(data = {}) {
    const hasData = Object.keys(data).length > 0;
    const isArrayData = accessSafe(() => data.type, '') === 'array';

    const customTypes = new CustomTypesProcessor(data).getJSDOC();

    const dataJSDOC = hasData ? this.getDataDescription(data, this.config.dataInfo) : [];

    return {
      dataJSDOC,
      customTypes,
      hasData,
      isArrayData,
    };
  }

  getOperationsAndTypes() {
    const { paths, servers } = this.openAPISpec;
    const serverUrl = accessSafe(() => servers[0].url, '');

    let customTypes = {};

    const operationsArray = Object.keys(paths).map((key) => {
      const path = `${serverUrl}${key}`;
      const methods = Object.keys(paths[key]).map((method) => {
        const { operationId, parameters, requestBody, summary } = paths[key][method];

        const calclulatedOperationId =
          operationId ??
          _.camelCase(
            `${method.toLowerCase()}-${key.substring(1).split('/').pop()}-${key
              .substring(1)
              .split('/')
              .shift()
              .toUpperCase()}`
          );

        const {
          pathPlaceHolders,
          pathPlaceHolderJSDOC,
          hasPathPlaceHolders,
          params,
          paramsJSDOC,
          hasParams,
        } = this.processOperationParameters(parameters);

        const {
          dataJSDOC,
          customTypes: customTypesForOperation,
          hasData,
          isArrayData,
        } = this.processOperationData(
          accessSafe(() => requestBody.content['application/json'].schema, {})
        );

        customTypes = _.extend(customTypes, customTypesForOperation);

        return {
          operationId: calclulatedOperationId,
          summary: wrap(summary, this.config.wrapOptions).split('\n'),
          path,
          method,
          pathPlaceHolders,
          hasPathPlaceHolders,
          params,
          hasParams,
          hasData,
          isArrayData,
          jsdocs: {
            pathPlaceHolders: pathPlaceHolderJSDOC,
            params: paramsJSDOC,
            data: dataJSDOC,
          },
          isDelete: method.toLowerCase() === 'delete',
          isGet: method.toLowerCase() === 'get',
          isHead: method.toLowerCase() === 'head',
          isOptions: method.toLowerCase() === 'options',
          isPatch: method.toLowerCase() === 'patch',
          isPost: method.toLowerCase() === 'post',
          isPut: method.toLowerCase() === 'put',
        };
      });
      return methods.flat();
    });
    const typesArray = Object.keys(customTypes).map((name) => {
      const jsdoc = customTypes[name].reduce((previousValue, currentValue) => {
        return [...previousValue, ...wrap(currentValue, this.config.wrapOptions).split('\n')];
      }, []);

      return { name, jsdoc };
    });
    return { operations: operationsArray.flat(), types: typesArray };
  }

  process() {
    if (this.isEmptySpec()) {
      return;
    }

    const { operations, types } = this.getOperationsAndTypes();

    const className = `PercipioAxios${_.upperFirst(
      _.camelCase(this.openAPISpec.info.title)
    )}Client`;

    this.viewdata = {
      className,
      fileName: `${_.kebabCase(className)}`,
      description: `Calls the ${this.openAPISpec.info.title} API.`,
      api: this.openAPISpec.info.title,
      operations,
      hasOperations: operations.length > 0,
      types,
      hasTypes: types.length > 0,
    };
  }

  getViewData() {
    return this.viewdata;
  }
}

module.exports = OpenAPIProcessor;
