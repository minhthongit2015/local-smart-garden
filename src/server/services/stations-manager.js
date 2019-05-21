/* eslint-disable no-param-reassign */



module.exports = class StationManager {
  static get stations() {
    // eslint-disable-next-line no-return-assign
    return StationManager._stations = StationManager._stations || [];
  }

  static async authStation(stationInfo) {
    if (stationInfo.secret_key && stationInfo.secret_key === 'Secret_STA_A1_01') {
      return true;
    }
    return false;
  }

  static attachStation(newStation, stationSocket) {
    const existStation = StationManager.stations.find(station => station.id === newStation.id);
    if (existStation) {
      existStation.socket = stationSocket;
    } else {
      this.stations.push(newStation);
      newStation.socket = stationSocket;
    }
  }
};
