/* eslint-disable no-return-assign */


const { WS_EVENTS } = require('../../../shared/constants');
const MessageHandler = require('./message-handler');
const EnvironmentHandler = require('./environment-handler');
const CommandHandler = require('./command-handler');
const CloudConnectHandler = require('./cloud-connect-handler');
const StationConnectHandler = require('./station-connect-handler');
const StationStateHandler = require('./station-state-handler');
const MobileConnectHandler = require('./mobile-connect-handler');

module.exports = class HandlerFactory {
  static get MessageHandler() {
    return HandlerFactory._MessageHandler = HandlerFactory._MessageHandler || new MessageHandler();
  }

  static get EnvironmentHandler() {
    return HandlerFactory._EnvironmentHandler = HandlerFactory._EnvironmentHandler || new EnvironmentHandler();
  }

  static get CommandHandler() {
    return HandlerFactory._CommandHandler = HandlerFactory._CommandHandler || new CommandHandler();
  }

  static get CloudConnectHandler() {
    return HandlerFactory._CloudConnectHandler = HandlerFactory._CloudConnectHandler || new CloudConnectHandler();
  }
  
  static get StationConnectHandler() {
    return HandlerFactory._StationConnectHandler = HandlerFactory._StationConnectHandler || new StationConnectHandler();
  }
  
  static get StationStateHandler() {
    return HandlerFactory._StationStateHandler = HandlerFactory._StationStateHandler || new StationStateHandler();
  }
  
  static get MobileConnectHandler() {
    return HandlerFactory._MobileConnectHandler = HandlerFactory._MobileConnectHandler || new MobileConnectHandler();
  }

  static get(type) {
    switch (type) {
    case WS_EVENTS.message:
      return HandlerFactory.MessageHandler;
    case WS_EVENTS.environment:
      return HandlerFactory.EnvironmentHandler;
    case WS_EVENTS.command:
      return HandlerFactory.CommandHandler;
    case WS_EVENTS.cloudConnect:
      return HandlerFactory.CloudConnectHandler;
    case WS_EVENTS.stationConnect:
      return HandlerFactory.StationConnectHandler;
    case WS_EVENTS.stationState:
      return HandlerFactory.StationStateHandler;
    case WS_EVENTS.mobileConnect:
      return HandlerFactory.MobileConnectHandler;
    default:
      return null;
    }
  }
};
