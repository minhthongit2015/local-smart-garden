/* eslint-disable class-methods-use-this */

const BaseHandler = require('./base-handler');
const { WS_EVENTS } = require('../../../shared/constants');

module.exports = class MessageHandler extends BaseHandler {
  setup(io, clients, manager) {
    super.setup(io, clients, manager);
    this.addEvent(WS_EVENTS.message);
    this.addListener(this.handleMessage.bind(this));
  }

  handleMessage(socket, message, res) {
    console.log('on message', message);
    if (res) res(message);
  }
};
