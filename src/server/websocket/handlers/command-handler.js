/* eslint-disable class-methods-use-this */

const colors = require('colors/safe');
const debug = require('debug')('app:server');
const BaseHandler = require('./base-handler');
const { WS_EVENTS } = require('../../../shared/constants');
const StationManager = require('../../services/stations-manager');

module.exports = class CommandHandler extends BaseHandler {
  setup(io, clients, manager) {
    super.setup(io, clients, manager);
    this.addEvent(WS_EVENTS.command);
    this.addListener(this.handleServerCommand.bind(this));
  }

  handleServerCommand(socket, data) {
    debug(colors.yellow('[Cloud]'), WS_EVENTS.command, JSON.stringify(data));
    switch (data.targetType) {
    case 'station': {
      const station = StationManager.findByStationId(data.targetId);
      if (station) {
        station.setState(data.state);
        station.syncState();
      }
    }
      break;
    case 'garden':
      break;
    default:
      break;
    }
    // TODO:  1. Phát sự kiện ra toàn vườn:
    //        + Mobile App đang kết nối qua Websocket
    //        + Browser đang kết nối qua Websocket
    //        + Các trạm đang kết nối đến Local Garden (điều khiển trạm)
  }
};
