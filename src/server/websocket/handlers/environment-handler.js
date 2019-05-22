/* eslint-disable class-methods-use-this */

const colors = require('colors/safe');
const debug = require('debug')('app:server');
const BaseHandler = require('./base-handler');
const { WS_EVENTS } = require('../../../shared/constants');
const StationManager = require('../../services/stations-manager');
const Gardener = require('../../services//gardener');

module.exports = class EnvironmentHandler extends BaseHandler {
  setup(io, clients, manager) {
    super.setup(io, clients, manager);
    this.addEvent(WS_EVENTS.environment);
    this.addListener(this.handleEnvironmentData.bind(this));
  }

  async handleEnvironmentData(socket, data) {
    const station = StationManager.findBySocket(socket);
    if (station) {
      debug(colors.green('[Station]'), WS_EVENTS.environment, station.id);
      station.updateState(data);
      const hasChange = await Gardener.takeCareOfStation(station);
      if (hasChange) {
        // console.log('execute command');
      }
    }
    // TODO:  1. Phát sự kiện ra toàn vườn:
    //        + Mobile App đang kết nối qua Websocket
    //        + Browser đang kết nối qua Websocket
    //        2. Lưu trữ tại máy một bản sao (.csv)
    //        3. Gửi dữ liệu lên server thông qua superagent
    //
  }
};
