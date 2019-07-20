
const debug = require('debug');
const { WS_EVENTS } = require('../../shared/constants');
const LoggerService = require('../services/Loggerz');

const serverDebug = debug('app:ws-core');

module.exports = class WebsocketManagerCore {
  /**
   * alias for `.wsServer`
   */
  get io() {
    return this.wsServer;
  }

  // Only available for Manager as Server
  get clients() {
    return this.io && this.io.sockets ? this.io.sockets.sockets : [];
  }

  // Only available for Manager as Server
  get clientArray() {
    return Object.keys(this.clients).map(key => this.clients[key]);
  }

  // Only available for Manager as Server
  getClientById(socketId) {
    return this.clients[socketId];
  }

  get handlers() {
    this._handlers = this._handlers || [];
    return this._handlers;
  }

  pushHandler(handler, socket) {
    this.handlers.push(handler);
    handler.setup(this.io, this.clients, this);
    if (!socket) {
      Object.keys(this.clients).forEach((clientId, index, clients) => {
        handler.attach(clients[clientId]);
      });
    } else {
      handler.attach(socket);
    }
  }

  pushHandlers(handlers) {
    handlers.forEach(handler => this.pushHandler(handler));
  }

  setup(wsServer) {
    this.wsServer = wsServer;
    wsServer.on(WS_EVENTS.connection, (socket) => {
      try {
        serverDebug('User connected: ', socket.id, socket.conn.remoteAddress);
        this.accept(socket);
  
        socket.on(WS_EVENTS.disconnect, () => {
          serverDebug('User disconnected: ', socket.id, socket.conn.remoteAddress);
        });
      } catch (wsClientError) {
        LoggerService.error({ message: wsClientError.message, stack: wsClientError.stack });
      }
    });
  }

  // Only available for Manager as Server
  accept(socket) {
    this.handlers.map(handler => handler.attach(socket));
    // eslint-disable-next-line no-param-reassign
    socket.clients = socket.server.sockets.sockets;
  }
};
