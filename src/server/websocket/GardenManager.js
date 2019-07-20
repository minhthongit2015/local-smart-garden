
const { WS_EVENTS } = require('../../shared/constants');
const WebsocketManagerCore = require('./ManagerCore');
const WSHandlerFactory = require('./handlers/handler-factory');
const LoggerService = require('../services/Loggerz');

module.exports = class GardenManager extends WebsocketManagerCore {
  constructor(root) {
    super();
    this.WSManager = root;
  }

  setup(wsServer) {
    try {
      super.setup(wsServer);
      this.pushHandler(WSHandlerFactory.get(WS_EVENTS.message));
      this.pushHandler(WSHandlerFactory.get(WS_EVENTS.environment));
      this.pushHandler(WSHandlerFactory.get(WS_EVENTS.stationConnect));
      this.pushHandler(WSHandlerFactory.get(WS_EVENTS.stationState));
      this.pushHandler(WSHandlerFactory.get(WS_EVENTS.mobileConnect));
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
