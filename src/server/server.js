

const express = require('express');
const http = require('http');
const path = require('path');
const DebugHelper = require('debug');
const colors = require('colors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const expressEasyZip = require('express-easy-zip');
const CookieParser = require('cookie-parser');
const SocketIO = require('socket.io');

// const sequelizeDB = require('./models/sequelize');

const cors = require('./middleware/cors');
const noCache = require('./middleware/no-cache');
const SocketIORequestParser = require('./middleware/io-request-parser');

const routes = require('./routes');
const api = require('./api');

const WebsocketManager = require('./websocket/ws-manager');
const wsRoutes = require('./websocket/routes');

const SystemInfo = require('./utils/system-info');
const startUp = require('./utils/_startup');
const Logger = require('./services/Logger');
const { Debug } = require('./utils/constants');

const debug = DebugHelper(Debug.CLOUD);

const Config = require('./config');

class Server {
  static start() {
    Server.setupErrorTrap();
    Server.createServer();
    Server.setupWebsocket();
    Server.setupMiddleware();
    Server.setupRouting();
    Server.listen();
  }

  static createServer() {
    this.app = express(); // Create Express Server
    this.server = http.createServer(this.app); // Create HTTP Server
    const r1 = express.Router();
    const r2 = express.Router();
    r1.get('/r1', (req, res) => console.log('r1', req));
    r1.use('/r2', r2);
    r2.get('/hello', (req, res) => console.log('r2-hello', req));
    const req = {
      method: 'GET',
      url: '/r2/hello',
      socket: 'la la la la la'
    };
    const res = {
      send: () => {},
      end: () => {}
    };
    r1.handle(req, res);
  }

  static setupWebsocket(server) {
    // Create Websocket Service
    this.io = SocketIO(server || this.server);
    WebsocketManager.setup(this.io);
  }

  static setupMiddleware() {
    this._corsMiddleware();
    this._staticFileMiddleware();
    this._cookieParserMiddleware();
  }

  static _corsMiddleware() {
    this.app.use(cors);
  }

  static _noCacheMiddleware() {
    this.app.use(noCache);
  }

  static _staticFileMiddleware() {
    const PUBLIC_FOLDER = path.resolve(process.cwd(), Config.publicFolder);
    this.app.get('*.*', express.static(PUBLIC_FOLDER));
  }

  static _cookieParserMiddleware() {
    const cookieParser = CookieParser();
    this.app.use(cookieParser);
  }

  static _bodyParserMiddleware() {
    this.app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
    this.app.use(bodyParser.json({ limit: '10mb' }));
    this.app.use(fileUpload());
    this.app.use(expressEasyZip());
  }

  static setupRouting() {
    this.app.use('/api', api);
    this.app.use('/', routes);

    WebsocketManager.use(wsRoutes);
    this.io.use(SocketIORequestParser);
  }

  static listen() {
    this.server.listen(Config.port);
    this.server.on('listening', () => {
      // eslint-disable-next-line no-console
      console.log(colors.rainbow(`\r\n\r\n${new Array(30).fill(' -').join('')}\r\n`));
      const address = this.server.address();
      if (typeof address === 'string') {
        debug(`Server running at pipe: ${address}`);
      } else {
        SystemInfo.showServerPorts(address.port, debug);
      }
      this.runStartUpTasks();
    });
  }

  static runStartUpTasks() {
    startUp();
  }

  static setupErrorTrap() {
    process.on('unhandledRejection', (reason) => {
      Logger.error(`Unhandled Rejection at: \t ${reason.stack || reason}`);
    });
    process.on('uncaughtException', (exeption) => {
      Logger.error(`Uncaught Exception at: \t ${exeption.message}`, exeption.stack);
    });
  }
}

process.on('unhandledRejection', (reason) => {
  Logger.error(`Unhandled Rejection at: \t ${reason.stack || reason}`);
});
process.on('uncaughtException', (exeption) => {
  Logger.error(`Uncaught Exception at: \t ${exeption.message}`, exeption.stack);
});

Server.start();
