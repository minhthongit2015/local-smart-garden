
const debug = require('debug');
const WebsocketManager = require('../websocket');
const WebsocketEvent = require('../websocket/event');
const { WS_EVENTS } = require('../../shared/constants');
const LoggerService = require('../services/logger');

const serverDebug = debug('app:gardener');

module.exports = class Gardener {
  static startWorking() {
    serverDebug('Gardener Start Working');
    try {
      Gardener.test();
    } catch (error) {
      LoggerService.error(error);
    }
  }

  static dispatchCommand(command, dest) {
    const commandEvent = new WebsocketEvent(WS_EVENTS.command, command, dest);
    WebsocketManager.dispatchGardenEvent(commandEvent);
  }

  static test() {
    setInterval(() => {
      const first = WebsocketManager.garden.clientArray[0];
      Gardener.dispatchCommand({
        state1: Math.random(),
        state2: Math.random() > 0.5,
        state3: Math.random().toString()
      }, first);
    }, 2000);
  }

};
