
const wsManager = require('../../websocket/ws-manager');
const superrequest = require('../../utils/superrequest');

module.exports = class {
  static async emitAll(eventPath, data) {
    wsManager.sendToAll(eventPath, data);
  }

  static emitCloud(eventPath, data) {
    wsManager.sendToCloud(eventPath, data);
  }

  static get cloud() {
    return superrequest;
  }
};
