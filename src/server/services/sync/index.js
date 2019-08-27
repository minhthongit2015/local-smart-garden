
const wsManager = require('../../websocket/ws-manager');

module.exports = class {
  static async emitAll(eventPath, data) {
    wsManager.sendToAll(eventPath, data);
  }

  static emitCloud(eventPath, data) {
    wsManager.sendToCloud(eventPath, data);
  }
};
