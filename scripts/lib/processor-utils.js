/**
 * Return a normalized type for the given schema
 * enums are converted to | delimited lists
 *
 * @param {object} schemaObject
 * @param {string} [defaultType='*']
 * @return {string}
 */
const getType = (schemaObject, defaultType = '*') => {
  const schema = schemaObject;

  if (schema.enum) {
    if (schema.type === 'string') {
      return `"${schema.enum.join('"|"')}"`;
    }
    if (schema.type === 'number' || schema.type === 'integer' || schema.type === 'boolean') {
      return `${schema.enum.join('|')}`;
    }
    return schema.type === 'null' ? 'null' : 'enum';
  }

  if (Array.isArray(schema.type)) {
    if (schema.type.includes('null')) {
      return `?${schema.type[0]}`;
    }
    return schema.type.join('|');
  }

  return schema.type ?? defaultType;
};

module.exports = {
  getType,
};
