// Libraries / Modules
// import '@babel/polyfill';
const express = require('express');
const http = require('http');
const path = require('path');
const debug = require('debug');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const socketIO = require('socket.io');
const routes = require('./routes');
const apis = require('./apis');
const WebsocketManager = require('./websocket');
const Gardener = require('./services/gardener');
const SystemInfo = require('./helpers/system-info');

// Global Config
const serverConfig = require('../config/server');

// Setup Debugging
const serverDebug = debug('app:server');

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
  const address = server.address();
  if (typeof address === 'string') {
    serverDebug(`Server running at pipe: ${address}`);
  } else {
    SystemInfo.showServerPorts(address.port, serverDebug);
  }
  Gardener.startWorking();
});


// setInterval(() => {
//   http.get('http://power-manager.herokuapp.com/');
// }, 300000); // every 5 minutes (300000)
