/* @flow */
const SocketIOClient = require('socket.io-client');
const WebsocketManagerCore = require('./ws-core');
const config = require('../config');
const SessionService = require('../services/session');

const Debugger = require('../services/Debugger');
const Logger = require('../services/Logger');

const SuperWebsocket = require('../utils/superws');

module.exports = class WebsocketManager extends WebsocketManagerCore {
  static setup(wsServer) {
    Debugger.websocket('<*> Setup Websocket Manager');
    Logger.catch(() => {
      super.setup(wsServer);
      this.connectToCloudServer();
    });
  }

  static sendToClient(event, client, ...agrs) {
    const receiver = typeof client === 'object'
      ? client
      : WebsocketManager.getClientById(client.id);
    return receiver.emit(event, ...agrs);
  }

  static sendToRoom(roomId, event, ...agrs) {
    return WebsocketManager.io.to(roomId).emit(event, ...agrs);
  }

  static sendToAll(event, ...agrs) {
    return WebsocketManager.io.emit(event, ...agrs);
  }

  static sendToCloud(event, ...agrs) {
    if (!this.cloud) return null;
    return this.cloud.emit(event, ...agrs);
  }

  static async connectToCloudServer() {
    Debugger.websocket('Connecting to Cloud Server...');
    if (!SessionService.sessionId) {
      await SessionService.requestSessionId();
    }
    this.cloud = SocketIOClient(config.cloudEndPoint, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      query: {
        token: SessionService.sessionId
      }
    });
    this.cloud.on('connect', async () => {
      Debugger.websocket('Connected to Cloud Server');
    });
    this.accept(this.cloud);
    SuperWebsocket.setup(this.cloud);
  }
};
