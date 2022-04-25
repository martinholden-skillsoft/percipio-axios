const { accessSafe } = require('access-safe');
const _ = require('lodash');
const processorutils = require('./processor-utils');

class ParameterProcessor {
  constructor(parameters, options) {
    this.defaultType = '*';
    this.jsdocs = [];
    this.parameters = parameters;

    this.defaults = {
      basePath: '',
      basePathString: '',
      basePathMessage: '',
    };
    this.config = _.extend({}, this.defaults, options);

    this.config.basePathString = this.config.basePath
      ? `${_.trimEnd(this.config.basePath, '.')}`
      : '';

    if (this.parameters.length !== 0) {
      this.process();
    }
  }

  /**
   * Return a normalized type for the given schema
   * enums are converted to | delimited lists
   *
   * @param {object} [schemaObject=this.schema]
   * @return {string}
   * @memberof GetCustomTypesProcessor
   */
  getType(schemaObject = this.parameters) {
    const schema = schemaObject || this.parameters;

    return processorutils.getType(schema, this.defaultType);
  }

  /**
   * Get the JSDOC formatted type expression for the given schema
   * and type
   *
   * @param {object} schema
   * @param {string} [type=undefined]
   * @return {string}
   * @memberof GetCustomTypesProcessor
   */
  getTypeJSDOCExpression(schema, type = undefined) {
    return type ? `{${type}}` : `{${this.getType(schema)}}`;
  }

  getDescription() {
    const result = [];
    const { basePath, basePathString, basePathMessage } = this.config;

    if (basePath) {
      const description = basePathMessage ? ` - ${basePathMessage}` : '';
      result.push(`@property {Object} [${basePathString}={}]${description}`);
    }

    return result;
  }

  writeParameterJSDOC(type, field, description, optional, defaultValue, schema) {
    const generateDescription = (title) => {
      const noun = `${title}`;
      const article = `a${'aeiou'.split('').includes(noun.charAt()) ? 'n' : ''}`;

      return `Represents ${article} ${noun}`;
    };

    const typeExpression = this.getTypeJSDOCExpression(schema, type);

    const desc = description ?? generateDescription(field, type);

    let fieldTemplate = field;

    if (optional) {
      fieldTemplate = `[${field}${
        defaultValue === undefined ? '' : `=${JSON.stringify(defaultValue)}`
      }]`;
    }

    return `@property ${typeExpression} ${fieldTemplate} - ${desc}`;
  }

  processParameters() {
    return this.parameters.reduce((previousValue, currentValue) => {
      const result = [];

      if (accessSafe(() => !this.config.ignore.includes(currentValue.name), true)) {
        const prefixedProperty = this.config.basePathString
          ? `${this.config.basePathString}.${currentValue.name}`
          : currentValue.name;
        const defaultValue = accessSafe(() => currentValue.schema.default, undefined);
        // const optional = !required.includes(property);
        const optional = !currentValue.required;

        const type = this.getType(currentValue.schema);
        result.push(
          this.writeParameterJSDOC(
            type,
            prefixedProperty,
            currentValue.description,
            optional,
            defaultValue,
            currentValue.schema
          )
        );

        return [...previousValue, ...result];
      }
      return previousValue;
    }, []);
  }

  process() {
    if (this.parameters.length === 0) {
      return;
    }

    this.jsdocs.push(...this.getDescription(this.parameters));
    this.jsdocs.push(...this.processParameters());
  }

  getJSDOC() {
    return this.jsdocs;
  }
}

module.exports = ParameterProcessor;
