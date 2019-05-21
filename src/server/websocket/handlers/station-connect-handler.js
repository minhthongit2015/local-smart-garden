
/* eslint-disable class-methods-use-this */

const BaseHandler = require('./base-handler');
const { WS_EVENTS } = require('../../../shared/constants');
const StationManager = require('../../services/stations-manager');
const WebsocketEvent = require('../event');
const GardenInfo = require('../../../config/garden');

module.exports = class CommandHandler extends BaseHandler {
  setup(io, clients, manager) {
    super.setup(io, clients, manager);
    this.addEvent(WS_EVENTS.stationConnect);
    this.addListener(this.handleStationConnect.bind(this));
  }

  async handleStationConnect(socket, data) {
    console.log(WS_EVENTS.stationConnect, data.id, socket.id, socket.conn.remoteAddress);
    const isVerified = await StationManager.authStation(data);
    if (!isVerified) {
      return socket.emit(WS_EVENTS.garden2Station, 'Unauthorized');
    }
    const stationConnectEvent = new WebsocketEvent(WS_EVENTS.stationConnect, {
      station: data,
      garden: GardenInfo.physicalAddress
    });
    this.manager.WSManager.dispatchCloudEvent(stationConnectEvent);
    return StationManager.attachStation(data, socket);
    // TODO:  + Nhận dữ liệu từ trạm con
    //        + Kiểm tra hợp lệ
    //        + Gửi thông tin lên server (để báo cho mobile nếu đang kết nối trong thời gian thực)
    //        + Lưu thông tin vào file stations.json
    //        + 
  }
};
