/* eslint-disable class-methods-use-this */

const colors = require('colors/safe');
const debug = require('debug')('app:server');
const BaseHandler = require('./base-handler');
const { WS_EVENTS } = require('../../../shared/constants');
const StationManager = require('../../services/stations-manager');
const Gardener = require('../../services//gardener');

module.exports = class extends BaseHandler {
  setup(io, clients, manager) {
    super.setup(io, clients, manager);
    this.addEvent(WS_EVENTS.stationState);
    this.addListener(this.handleEnvironmentData.bind(this));
  }

  async handleEnvironmentData(socket, data) {
    const station = StationManager.findBySocket(socket);
    station.updateState(data);
    debug(colors.green('[Station]'), WS_EVENTS.stationState, station.id);
    const hasChange = await Gardener.takeCareOfStation(station);
    if (hasChange) {
      // socket.emit(WS_EVENTS.command, station.state);
    }
  }
};
