const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const config = require('../config/config');
const routes = require('./index.routes');
const pageNotFoundMiddleware = require('./middlewares/not-found.middleware');
const errorHandlerMiddleware = require('./middlewares/error-handler.middleware');
const useragent = require('express-useragent');
const swaggerJsdoc = require('swagger-jsdoc'),
  swaggerUi = require('swagger-ui-express');

const ev = require('express-validation');
// assign options
ev.options({
  status: 422,
  statusText: 'Unprocessable Entity',
});

const init = (app) => {
  if (config.env === 'development') {
    app.use(logger('dev'));
  }
  // parse body params and attache them to req.body
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

  // secure apps by setting various HTTP headers
  app.use(helmet());

  // enable CORS - Cross Origin Resource Sharing
  app.use(cors());

  // parse information user agent
  app.use(useragent.express());
  const options = {
    definition: {
      swagger: '2.0',
      info: {
        title: 'LogRocket Express API with Swagger',
        version: '0.1.0',
        description:
          'This is a simple CRUD API application made with Express and documented with Swagger',
        license: {
          name: 'MIT',
          url: 'https://spdx.org/licenses/MIT.html',
        },
        contact: {
          name: 'LogRocket',
          url: 'https://logrocket.com',
          email: 'info@email.com',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
        },
      ],
    },
    apis: ['./routes/*.js'],
  };

  const specs = swaggerJsdoc(options);
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true }),
  );
  // parse validation error nicely
  if (!config.testing) {
    app.use(require('./middlewares/checkToken.middleware'));
    app.use(require('./middlewares/validationError.middleware'));
  }

  // mount all routes on /api path
  app.use('/api', routes);

  // catch 404 and forward to error handler
  app.use(pageNotFoundMiddleware());

  // error handler
  app.use(errorHandlerMiddleware());

  if (config.runLocal) {
    app.listen(config.port, () => {
      console.info(`API server started on port ${config.port} (${config.env})`);
    });
  }

  console.log('Finished initialize app.');

  return app;
};

module.exports = init;
