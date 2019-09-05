
const fs = require('fs');
const superagent = require('superagent');
const Apis = require('../utils/constants');

const SESSION_FILE = './src/server/config/sessionId.txt';

module.exports = class {
  static get sessionId() {
    if (!this._sessionId && fs.existsSync(SESSION_FILE)) {
      this._sessionId = fs.readFileSync(SESSION_FILE);
    }
    return this._sessionId;
  }

  static set sessionId(sessionId) { this._sessionId = sessionId; }

  static async requestSessionId() {
    const response = await superagent.get(Apis.API.session);
    this.sessionId = response.text;
    fs.writeFile(SESSION_FILE, this.sessionId, () => {});
    return this.sessionId;
  }
};
