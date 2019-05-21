/* eslint-disable class-methods-use-this */

const BaseHandler = require('./base-handler');
const { WS_EVENTS } = require('../../../shared/constants');

module.exports = class EnvironmentHandler extends BaseHandler {
  setup(io, clients, manager) {
    super.setup(io, clients, manager);
    this.addEvent(WS_EVENTS.environment);
    this.addListener(this.handleEnvironmentData.bind(this));
  }

  handleEnvironmentData(socket, data) {
    console.log('on environment', data);
    // TODO:  1. Phát sự kiện ra toàn vườn:
    //        + Mobile App đang kết nối qua Websocket
    //        + Browser đang kết nối qua Websocket
    //        2. Lưu trữ tại máy một bản sao (.csv)
    //        3. Gửi dữ liệu lên server thông qua superagent
    //
  }
};
