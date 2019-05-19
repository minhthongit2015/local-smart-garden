
const SocketIOClient = require('socket.io-client');
const { WS_EVENTS } = require('../../shared/constants');
const WebsocketManagerCore = require('./ManagerCore');
const WSHandlerFactory = require('./handlers/handler-factory');
const LoggerService = require('../services/logger');
const ServerConfig = require('../../config/server');

module.exports = class CloudManager extends WebsocketManagerCore {
  get cloudSocket() { return this._cloudSocket; }
  
  setup() {
    try {
      this.connectToCloudServer();
      super.setup(this.cloudSocket);
      this.pushHandler(WSHandlerFactory.get(WS_EVENTS.command));
      this.pushHandler(WSHandlerFactory.get(WS_EVENTS.cloudConnect));
    } catch (setupError) {
      LoggerService.error({ message: setupError.message, stack: setupError.stack });
    }
  }

  connectToCloudServer() {
    this._cloudSocket = SocketIOClient(ServerConfig.cloudAddress, {
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
