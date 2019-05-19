
import '@babel/polyfill';
import fs from 'fs';
import path from 'path';
import http from 'http';
import express from 'express';
import config from 'config';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import moment from 'moment';

import swaggerTools from 'swagger-tools';
import jsyaml from 'js-yaml';
import logOperations from './utils/logOperations';

const app = express();
const { port, host } = config;
const date = moment().format('LTS');

// Headers
app.use((req, res, next) => {
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Accept-Ranges', 'bytes');
  return next();
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Expose-Headers', 'Content-Length');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range, x-access-token');

  return next();
});

// Parsers
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: false }));
app.use(bodyParser.text());

// Seguridad
app.use(helmet());
app.use((req, res, next) => {
  if (req.headers.authorization !== config.API_KEY && (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test')) {
    const timeRejected = moment().format('LTS');
    fs.appendFile(logOperations.logFilePath, `${timeRejected} - Status Code: 401 - Unauthorized access - Host: ${req.headers.host} IP: ${req.ip}\n`, (err) => {
      if (err) process.stdout.write('Error at writing logErrors.txt');
    });
    return res.status(401).send('Petstore API: Unauthorized').end();
  }
  return next();
});

// swaggerRouter configuration
const options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'dev', // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const spec = fs.readFileSync(path.join(path.resolve(), 'api/swagger.yaml'), 'utf8');
const swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware

swaggerTools.initializeMiddleware(swaggerDoc, (middleware) => {
  // Interpret Swagger resources and attach metadata to request
  // must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  // Starts the server
  http.createServer(app).listen(port, host, () => {
    console.info(`Your server is listening on port %d (http://${config.host}:%d)`, port, port);
    console.info(`Swagger-ui is available on http://${config.host}:%d/docs`, port);

    fs.appendFile(logOperations.logFilePath, `${date} - Your server is listening on port ${port} (http://${config.host}:${port})\n`, (err) => {
      if (err) process.stdout.write('Error at writing logErrors.txt');
    });
  });
});
