
const SocketIOClient = require('socket.io-client');
const WebsocketManagerCore = require('./ManagerCore');
const LoggerService = require('../services/Logger');
const ServerConfig = require('../config');

module.exports = class CloudManager extends WebsocketManagerCore {
  get cloudSocket() { return this._cloudSocket; }

  constructor(root) {
    super();
    this.WSManager = root;
  }
  
  setup() {
    try {
      this.connectToCloudServer();
      super.setup(this.cloudSocket);
    } catch (setupError) {
      LoggerService.error({ message: setupError.message, stack: setupError.stack });
    }
  }

  connectToCloudServer() {
    this._cloudSocket = SocketIOClient(ServerConfig.cloudEndPoint, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax : 5000,
      reconnectionAttempts: Infinity
    });
  }

  dispatchEvent(event) {
    this.cloudSocket.emit(event.type, event.data, event.callback);
  }

  pushHandler(handler) {
    super.pushHandler(handler, this.cloudSocket);
  }
};
