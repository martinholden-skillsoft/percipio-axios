/* eslint-disable import/no-extraneous-dependencies */
const SwaggerClient = require('swagger-client');
const fs = require('fs');
const Mustache = require('mustache');
const prettier = require('prettier');
const _ = require('lodash');
const consola = require('consola');
const { v4: uuidv4 } = require('uuid');

const OpenAPIProcessor = require('./lib/openapi-processor');

/**
 * Perform the task, waits for 2 seconds
 *
 * @param {*} options
 * @returns {Promise} Promise object which after 2 seconds returns the configuration value message
 */
const getSwaggerDefinition = (swaggerurl) => {
  return new SwaggerClient(_.trim(swaggerurl));
};

/**
 * Perform the task
 *
 * @param {*} options
 * @returns
 */
const processSwagger = () => {
  return new Promise((resolve, reject) => {
    const swaggerurls = [
      'https://api.percipio.com/common/swagger.json',
      'https://api.percipio.com/reporting/swagger.json',
      'https://api.percipio.com/user-management/swagger.json',
      'https://api.percipio.com/content-discovery/swagger.json',
    ];

    const promises = [];

    const clients = [];

    swaggerurls.map((swaggerurl, index) => {
      promises.push(
        getSwaggerDefinition(swaggerurl)
          .then((response) => {
            consola.log(`Generating for ${swaggerurl}`);
            const { spec } = response;

            const mustacheViewData = new OpenAPIProcessor(spec).getViewData();
            mustacheViewData.getuuid = () => {
              return uuidv4();
            };
            mustacheViewData.index = (index + 1) * 100;

            clients.push({
              fileName: `./lib/${mustacheViewData.fileName}`,
              className: mustacheViewData.className,
            });

            fs.readFile('scripts/template/api.mustache', (err, data) => {
              if (err) throw err;
              Mustache.escape = (text) => {
                return text;
              };
              const output = Mustache.render(data.toString(), mustacheViewData);
              let formatted = output;
              prettier.resolveConfig('.').then((prettieroptions) => {
                formatted = prettier.format(output, prettieroptions);
                fs.writeFileSync(`./lib/${mustacheViewData.fileName}.js`, formatted);
                consola.log(`Generated API client for ${swaggerurl}`);
              });
            });

            fs.readFile('scripts/template/clienttest.mustache', (err, data) => {
              if (err) throw err;
              Mustache.escape = (text) => {
                return text;
              };
              const output = Mustache.render(data.toString(), mustacheViewData);
              let formatted = output;
              prettier.resolveConfig('.').then((prettieroptions) => {
                formatted = prettier.format(output, prettieroptions);
                fs.writeFileSync(
                  `./test/${mustacheViewData.index}-${mustacheViewData.fileName}.test.js`,
                  formatted
                );
                consola.log(`Generated API client test for ${swaggerurl}`);
              });
            });

            fs.readFile('scripts/template/clientoperationtest.mustache', (err, data) => {
              mustacheViewData.operations.map((operation, opindex) => {
                const newViewdata = _.cloneDeep(mustacheViewData);
                newViewdata.operation = operation;
                newViewdata.opindex = newViewdata.index + 1 + opindex;

                if (err) throw err;
                Mustache.escape = (text) => {
                  return text;
                };
                const output = Mustache.render(data.toString(), newViewdata);
                let formatted = output;
                prettier.resolveConfig('.').then((prettieroptions) => {
                  formatted = prettier.format(output, prettieroptions);
                  fs.writeFileSync(
                    `./test/${newViewdata.opindex}-${mustacheViewData.fileName}-${operation.operationId}.test.js`,
                    formatted
                  );
                  consola.log(
                    `Generated API client test for ${swaggerurl} - ${operation.operationId}`
                  );
                });
                return operation.operationId;
              });
            });
          })
          .catch((err) => {
            consola.error(err);
            reject(err);
          })
      );
    });

    Promise.allSettled(promises).then((results) => {
      fs.readFile('scripts/template/index.mustache', (err, data) => {
        if (err) throw err;
        Mustache.escape = (text) => {
          return text;
        };
        const output = Mustache.render(data.toString(), { clients: clients });
        let formatted = output;
        prettier.resolveConfig('.').then((prettieroptions) => {
          formatted = prettier.format(output, prettieroptions);
          fs.writeFileSync(`./index.js`, formatted);
        });
      });
      resolve(true);
    });
  });
};

const main = async () => {
  await processSwagger();
};

try {
  main();
} catch (error) {
  consola.error(error);
  throw new Error(`A problem occurred during configuration. ${error.message}`);
}
