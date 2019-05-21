/* eslint-disable class-methods-use-this */


const BaseHandler = require('./base-handler');
const { WS_EVENTS } = require('../../../shared/constants');
const GardenInfo = require('../../../config/garden');
const WebsocketEvent = require('../event');
const SystemInfo = require('../../helpers/system-info');

module.exports = class extends BaseHandler {
  setup(io, clients, manager) {
    super.setup(io, clients, manager);
    this.addEvent(WS_EVENTS.cloudConnect);
    this.addListener(this.handleConnectToServer.bind(this));
  }

  handleConnectToServer(socket, data) {
    console.log('Connected to Server', data);
    const connectEvent = new WebsocketEvent(WS_EVENTS.gardenConnect, {
      physicalAddress: GardenInfo.physicalAddress,
      secretKey: GardenInfo.secretKey,
      localIP: SystemInfo.getFirstLocalIP()
    }, null, (rs) => {
      console.log('Connect to Server result: ', rs);
    });
    this.WSManager.dispatchCloudEvent(connectEvent);
  }
};
