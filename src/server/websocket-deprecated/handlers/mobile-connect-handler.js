/* eslint-disable no-param-reassign */

/* eslint-disable class-methods-use-this */

const colors = require('colors/safe');
const debug = require('debug')('app:server');
const BaseHandler = require('./base-handler');
const { WS_EVENTS } = require('../../../shared/constants');
// const WebsocketEvent = require('../event');
// const GardenInfo = require('../../../config/garden');

module.exports = class CommandHandler extends BaseHandler {
  setup(io, clients, manager) {
    super.setup(io, clients, manager);
    this.addEvent(WS_EVENTS.mobileConnect);
    this.addListener(this.handleMobileConnect.bind(this));
  }

  async handleMobileConnect(socket, data, res) {
    debug(colors.blue('[Mobile]'), WS_EVENTS.mobileConnect, data, socket.id, socket.conn.remoteAddress);
    if (false) {
      return !res ? null : res('Unauthorized!');
    }
    socket.isMobile = true;
    return !res ? null : res('Access Granted!');
  }
};
