// Libraries / Modules
// import '@babel/polyfill';
const colors = require('colors/safe');
const express = require('express');
const http = require('http');
const path = require('path');
const serverDebug = require('debug')('app:server');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const socketIO = require('socket.io');
const routes = require('./routes');
const apis = require('./api');
const WebsocketManager = require('./websocket');
const SystemInfo = require('./helpers/system-info');
const startUp = require('./startup');
const Logger = require('./services/Loggerz');

process.on('unhandledRejection', (reason) => {
  Logger.error(`Unhandled Rejection at:\r\n${reason.stack || reason}`);
});
process.on('uncaughtException', (exeption) => {
  Logger.error(`Uncaught Exception at:\r\n${exeption}`);
});

// Global Config
const serverConfig = require('../config/server');

// Init the Server
const app = express();

// Setup for POST parser
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));

// Setup for File upload
app.use(fileUpload());

// Routing
const PUBLIC_FOLDER = path.resolve(process.cwd(), serverConfig.publicFolder);
app.get('*.*', express.static(PUBLIC_FOLDER));

app.use('/api', apis);
app.use('/', routes);

// Setup HTTP Server
const server = http.createServer(app);

// Setup Websocket Server
const GardenWebsocketServer = socketIO(server);
WebsocketManager.setup(GardenWebsocketServer);

// Start Listening
server.listen(serverConfig.port);
server.on('listening', () => {
  console.log(colors.rainbow(`\r\n\r\n${new Array(30).fill(' -').join('')}\r\n`));
  const address = server.address();
  if (typeof address === 'string') {
    serverDebug(`Server running at pipe: ${address}`);
  } else {
    SystemInfo.showServerPorts(address.port, serverDebug);
  }
  startUp();
});


// setInterval(() => {
//   http.get('http://power-manager.herokuapp.com/');
// }, 300000); // every 5 minutes (300000)
