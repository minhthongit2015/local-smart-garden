/* eslint-disable no-return-assign */


const { WS_EVENTS } = require('../../../shared/constants');
const MessageHandler = require('./message-handler');
const EnvironmentHandler = require('./environment-handler');
const CommandHandler = require('./command-handler');
const CloudConnectHandler = require('./cloud-connect-handler');

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
    default:
      return null;
    }
  }
};
