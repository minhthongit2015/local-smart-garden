/* eslint-disable class-methods-use-this */


const BaseHandler = require('./base-handler');
const { WS_EVENTS } = require('../../../shared/constants');
const GardenInfo = require('../../../config/garden');

module.exports = class extends BaseHandler {
  setup(io, clients) {
    super.setup(io, clients);
    this.addEvent(WS_EVENTS.cloudConnect);
    this.addListener(this.handleConnectToServer.bind(this));
  }

  handleConnectToServer(socket, data) {
    console.log('Connected to Server', data);
    socket.emit(WS_EVENTS.garden2Cloud, 'connect', GardenInfo.physicalAddress);
  }
};
