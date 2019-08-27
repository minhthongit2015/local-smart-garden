
const WebsocketManagerCore = require('./ManagerCore');
const LoggerService = require('../services/Logger');

module.exports = class GardenManager extends WebsocketManagerCore {
  constructor(root) {
    super();
    this.WSManager = root;
  }

  setup(wsServer) {
    try {
      super.setup(wsServer);
    } catch (setupError) {
      LoggerService.error({ message: setupError.message, stack: setupError.stack });
    }
  }

  dispatchEvent(event) {
    if (event.dest) {
      const dest = typeof(event.dest) === 'object' ? event.dest : this.getClientById(event.dest);
      dest.emit(event.type, event.data, event.callback);
    } else {
      this.wsServer.emit(event.type, event.data, event.callback);
    }
  }
};
