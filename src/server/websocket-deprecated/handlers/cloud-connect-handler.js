/* eslint-disable class-methods-use-this */


const colors = require('colors/safe');
const debug = require('debug')('app:server');
const BaseHandler = require('./base-handler');
const { WS_EVENTS } = require('../../../shared/constants');
const GardenInfo = require('../../config/garden');
const WebsocketEvent = require('../event');
const SystemInfo = require('../../utils/system-info');

module.exports = class extends BaseHandler {
  setup(io, clients, manager) {
    super.setup(io, clients, manager);
    this.addEvent(WS_EVENTS.cloudConnect);
    this.addListener(this.handleConnectToServer.bind(this));
  }

  handleConnectToServer() {
    debug(colors.yellow('[Cloud]'), 'Connection to Server established!');
    const connectEvent = new WebsocketEvent(WS_EVENTS.gardenConnect, {
      physicalAddress: GardenInfo.physicalAddress,
      secretKey: GardenInfo.secretKey,
      localIP: SystemInfo.getFirstLocalIP()
    }, null, (rs) => {
      debug(colors.yellow('[Cloud]'), 'Authorize to Server result:', rs);
    });
    this.WSManager.dispatchCloudEvent(connectEvent);
  }
};
