
const WebsocketManager = require('../websocket');
const WSEvent = require('../websocket/event');
const { WS_EVENTS } = require('../../shared/constants');

module.exports = class {
  static async resolveStationEnvironmentData(environment) {
    const environmentEvent = new WSEvent(WS_EVENTS.environment, environment);
    WebsocketManager.dispatchGardenEvent(environmentEvent);
  }
};