const json = require('json-pointer');
const { accessSafe } = require('access-safe');
const processorutils = require('./processor-utils');

class CustomTypesProcessor {
  constructor(schema) {
    this.defaultType = '*';
    this.subTypes = {};
    this.name = '';
    this.jsdocs = [];
    this.schema = schema;

    if (this.schema || Object.keys(this.schema).length !== 0) {
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
  getType(schemaObject = this.schema) {
    const schema = schemaObject || this.schema;

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

  /**
   * Get the ref for the given schema
   *
   * @param {object} schemaObject
   * @return {object}
   * @memberof GetCustomTypesProcessor
   */
  getRef(schemaObject) {
    let schema = schemaObject || this.schema;
    if (schema.type === 'array') {
      schema = schema.items;
    }
    return accessSafe(() => schema.$$ref, '');
  }

  /**
   * Get the name for the given schema based on the
   * $ref and the parenet name
   *
   * @param {object} [schemaObject=this.schema]
   * @param {string} [parentName=undefined]
   * @return {string}
   * @memberof GetCustomTypesProcessor
   */
  getName(schemaObject = this.schema, parentName = undefined) {
    let schema = schemaObject || this.schema;

    if (schema.type === 'array') {
      schema = schema.items;
    }

    if (schema.title) {
      return schema.title;
    }
    const title = accessSafe(() => schema.$$ref.substring(1).split('/').pop(), '');
    return parentName ? `${parentName}${title}` : title;
  }

  /**
   * Get the description for the given schema
   *
   * @param {object} schemaObject
   * @param {string} [parentName=undefined]
   * @return {string[]}
   * @memberof GetCustomTypesProcessor
   */
  getDescription(schemaObject, parentName = undefined) {
    const generateDescription = (title, type) => {
      const noun = title ? `${title} ${type}` : type;
      const article = `a${'aeiou'.split('').includes(noun.charAt()) ? 'n' : ''}`;

      return `Represents ${article} ${noun}`;
    };

    let schema = schemaObject || this.schema;

    const result = [];
    if (schema.type === 'array') {
      schema = schemaObject.items;
    }

    const name = this.getName(schema, parentName);
    const type = this.getTypeJSDOCExpression(schema);

    const description = accessSafe(
      () => schema.description,
      generateDescription(name, this.getType(schema))
    );

    result.push(description);
    result.push(`@typedef ${type} ${name}`);

    return result;
  }

  /**
   *
   *
   * @param {string} type
   * @param {string} field
   * @param {steing} description
   * @param {boolean} optional
   * @param {*} defaultValue
   * @param {object} schema
   * @return {string}
   * @memberof GetCustomTypesProcessor
   */
  writePropertyJSDOC(type, field, description, optional, defaultValue, schema) {
    const generateDescription = (title) => {
      const noun = `${title}`;
      const article = `a${'aeiou'.split('').includes(noun.charAt()) ? 'n' : ''}`;

      return `Represents ${article} ${noun}`;
    };

    const typeExpression = this.getTypeJSDOCExpression(schema, type);

    const desc = description ?? generateDescription(field, type);

    let fieldTemplate = `${field}`;

    if (optional) {
      fieldTemplate = `[${field}${
        defaultValue === undefined ? '' : `=${JSON.stringify(defaultValue)}`
      }]`;
    }

    return `@property ${typeExpression} ${fieldTemplate} - ${desc}`;
  }

  processSubtype(schema, parentName) {
    const result = [];
    const name = this.getName(schema, parentName);
    result.push(...this.getDescription(schema, parentName));

    if (json.has(schema, '/properties')) {
      result.push(...this.processProperties(schema));
    }
    this.subTypes[`${name}`] = result;
  }

  processProperties(schema, parentName) {
    const properties = json.get(schema, '/properties');
    const required = json.has(schema, '/required') ? json.get(schema, '/required') : [];

    return Object.entries(properties).reduce((previousValue, currentValue) => {
      const [name, property] = currentValue;
      const result = [];

      const root = parentName ? `${parentName}.` : '';
      const prefixedPropertyName = `${root}${name}`;
      const defaultValue = property.default;
      const optional = !required.includes(name);

      if (property.type === 'object' && property.properties) {
        // add a property for the object
        result.push(
          this.writePropertyJSDOC(
            'object',
            prefixedPropertyName,
            property.description,
            optional,
            defaultValue,
            schema
          )
        );
        // process the properties of the object
        result.push(...this.processProperties(property, prefixedPropertyName));
      } else if (property.type === 'array' && property.items) {
        // The property is an array of types
        let subTypeDefinintionName = null;
        // We have an array of objects so process the subType
        if (property.items.type === 'object') {
          const subTypeparentName = property.items.$$ref
            ? this.name
            : `${this.name}${prefixedPropertyName}`;
          subTypeDefinintionName = this.getName(property.items, subTypeparentName);
          this.processSubtype(property.items, subTypeparentName);
        }

        result.push(
          this.writePropertyJSDOC(
            subTypeDefinintionName ? `${subTypeDefinintionName}[]` : 'array',
            prefixedPropertyName,
            property.description,
            optional,
            defaultValue,
            schema
          )
        );
        if (property.items.type !== 'object') {
          result.push(...this.processItems(property, prefixedPropertyName));
        }
      } else {
        const type = this.getType(property);
        result.push(
          this.writePropertyJSDOC(
            type,
            prefixedPropertyName,
            property.description,
            optional,
            defaultValue,
            property
          )
        );
      }

      return [...previousValue, ...result];
    }, []);
  }

  /**
   * Process the items in the schema
   *
   * @param {*} schema
   * @param {*} parentName
   * @return {*}
   * @memberof GetCustomTypesProcessor
   */
  processItems(schema, parentName) {
    const items = json.get(schema, '/items');

    if (schema.items.type === 'object' && schema.items.$$ref) {
      this.processSubtype(schema.items, parentName);
      return [];
    }

    if (!Array.isArray(items)) {
      return [];
    }
    const result = [];
    items.forEach((item, i) => {
      const root = parentName ? `${parentName}.` : '';
      const prefixedProperty = root + i;
      const defaultValue = item.default;
      const optional = !schema.minItems || i >= schema.minItems;
      if (item.type === 'array' && item.items) {
        result.push(
          this.writePropertyJSDOC(
            'array',
            prefixedProperty,
            item.description,
            optional,
            defaultValue,
            schema
          )
        );
        result.push(...this.processItems(item, prefixedProperty));
      } else if (item.type === 'object' && item.properties) {
        result.push(
          this.writePropertyJSDOC(
            'object',
            prefixedProperty,
            item.description,
            optional,
            defaultValue,
            schema
          )
        );
        result.push(...this.processProperties(item, prefixedProperty));
      } else {
        const type = this.getType(item);
        result.push(
          this.writePropertyJSDOC(
            type,
            prefixedProperty,
            item.description,
            optional,
            defaultValue,
            item
          )
        );
      }
    });
    return result;
  }

  process() {
    if (Object.keys(this.schema).length === 0) {
      return;
    }

    this.type = this.getType();
    this.ref = this.getRef();
    this.name = this.getName();

    this.jsdocs.push(...this.getDescription(this.schema));
    if (json.has(this.schema, '/properties')) {
      this.jsdocs.push(...this.processProperties(this.schema, null));
    }

    if (json.has(this.schema, '/items')) {
      this.jsdocs.push(...this.processItems(this.schema, null));
    }
  }

  getJSDOC() {
    if (Object.keys(this.schema).length === 0) {
      return {};
    }
    if (!this.subTypes[this.name]) {
      this.subTypes[this.name] = this.jsdocs;
    }
    return this.subTypes;
  }
}

module.exports = CustomTypesProcessor;
