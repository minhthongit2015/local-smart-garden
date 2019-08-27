
const GardenManager = require('./GardenManager');
const CloudManager = require('./CloudManager');
const LoggerService = require('../services/Logger');

module.exports = class WebsocketManager {
  static get garden() { return WebsocketManager._garden; }

  static get cloud() { return WebsocketManager._cloud; }

  static setup(GardenWebsocketServer) {
    try {
      WebsocketManager._garden = new GardenManager(WebsocketManager);
      WebsocketManager._cloud = new CloudManager(WebsocketManager);
      WebsocketManager._garden.setup(GardenWebsocketServer);
      WebsocketManager._cloud.setup();
    } catch (setupError) {
      LoggerService.error({ message: setupError.message, stack: setupError.stack });
    }
  }

  static dispatchGardenEvent(event) {
    this.garden.dispatchEvent(event);
  }

  static dispatchCloudEvent(event) {
    this.cloud.dispatchEvent(event);
  }
};
