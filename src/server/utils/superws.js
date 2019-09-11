
const path = require('path');

class SuperWebsocket {
  static get on() {
    if (!this._on) {
      this._on = this.socket.on.bind(this.socket);
    }
    return this._on;
  }

  static get connected() { return this.socket.connected; }

  static setup(cloudSocket) {
    this.socket = cloudSocket;
    this.socket.on('connect', () => {
      console.log('connected');
    });
  }

  static async emit(...args) {
    if (this.connected) {
      return new Promise((resolve) => {
        this.socket.emit(...args, res => resolve(res));
      });
    }
    return Promise.resolve();
  }

  static async ws(eventPath, body) {
    eventPath = eventPath.replace(/https?.+?(\w|\.|:)+?\//g, '');
    return this.emit(eventPath, body);
  }

  static async get(eventPath, body) {
    return this.ws(path.posix.join('GET', eventPath), body);
  }

  static async post(eventPath, body) {
    return this.ws(path.posix.join('POST', eventPath), body);
  }

  static async put(eventPath, body) {
    return this.ws(path.posix.join('PUT', eventPath), body);
  }

  static async patch(eventPath, body) {
    return this.ws(path.posix.join('PATCH', eventPath), body);
  }

  static async delete(eventPath, body) {
    return this.ws(path.posix.join('DELETE', eventPath), body);
  }
}

module.exports = SuperWebsocket;
