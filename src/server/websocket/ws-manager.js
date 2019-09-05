/* @flow */
const SocketIOClient = require('socket.io-client');
const DebugHelper = require('debug');
const WebsocketManagerCore = require('./ws-core');
const Logger = require('../services/Logger');
const config = require('../config');
const { Debug } = require('../utils/constants');
const SessionService = require('../services/session');

const debug = DebugHelper(Debug.ws.CORE);

module.exports = class WebsocketManager extends WebsocketManagerCore {
  static setup(wsServer) {
    try {
      super.setup(wsServer);
      this.connectToCloudServer();
    } catch (setupError) {
      Logger.error({ message: setupError.message, stack: setupError.stack });
    }
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
    if (!SessionService.sessionId) {
      await SessionService.requestSessionId();
    }
    debug('Connecting to Cloud Server...');
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
      debug('Connected to Cloud Server');
      // setInterval(() => {
      this.cloud.emit('/garden/data', { data: 'any' }, (rs) => {
        debug(rs);
        this.cloud.disconnect();
        setTimeout(() => {
          this.cloud.connect();
        }, 3000);
      });
      // }, 2000);
    });
    this.accept(this.cloud);
  }
};
