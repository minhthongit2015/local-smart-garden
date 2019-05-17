
const debug = require('debug');
const { WS_EVENTS } = require('../../shared/constants');
const LoggerService = require('../services/logger');

const serverDebug = debug('app:ws-core');

module.exports = class WebsocketManagerCore {
  static get clients() {
    return WebsocketManagerCore.io.sockets.sockets;
  }

  static get clientArray() {
    return Object.keys(WebsocketManagerCore.clients).map(key => WebsocketManagerCore.clients[key]);
  }

  static getClientById(socketId) {
    return WebsocketManagerCore.clients[socketId];
  }

  static get handlers() {
    WebsocketManagerCore._handlers = WebsocketManagerCore._handlers || [];
    return WebsocketManagerCore._handlers;
  }

  static pushHandler(handler) {
    WebsocketManagerCore.handlers.push(handler);
    handler.setup(WebsocketManagerCore.io, WebsocketManagerCore.clients);
    Object.keys(WebsocketManagerCore.clients).forEach((clientId, index, clients) => {
      handler.attach(clients[clientId]);
    });
  }

  static pushHandlers(handlers) {
    WebsocketManagerCore.handlers.push(...handlers);
  }

  static setup(wsServer) {
    WebsocketManagerCore.wsServer = wsServer;
    wsServer.on(WS_EVENTS.connection, (socket) => {
      try {
        serverDebug('a user connected');
        WebsocketManagerCore.accept(socket);
  
        socket.on(WS_EVENTS.disconnect, (event) => {
          serverDebug(event, socket.id, socket.conn.remoteAddress);
        });
      } catch (wsClientError) {
        LoggerService.error(wsClientError);
      }
    });
  }

  /**
   * alias for `.wsServer`
   */
  static get io() {
    return WebsocketManagerCore.wsServer;
  }

  static accept(socket) {
    WebsocketManagerCore.handlers.map(handler => handler.attach(socket));
    // eslint-disable-next-line no-param-reassign
    socket.clients = socket.server.sockets.sockets;
  }
};
