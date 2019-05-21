/* eslint-disable class-methods-use-this */

const BaseHandler = require('./base-handler');
const { WS_EVENTS } = require('../../../shared/constants');

module.exports = class CommandHandler extends BaseHandler {
  setup(io, clients, manager) {
    super.setup(io, clients, manager);
    this.addEvent(WS_EVENTS.command);
    this.addListener(this.handleServerCommand.bind(this));
  }

  handleServerCommand(socket, data) {
    console.log('on command', data);
    // TODO:  1. Phát sự kiện ra toàn vườn:
    //        + Mobile App đang kết nối qua Websocket
    //        + Browser đang kết nối qua Websocket
    //        + Các trạm đang kết nối đến Local Garden (điều khiển trạm)
  }
};
