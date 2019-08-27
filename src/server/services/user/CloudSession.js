
const fs = require('fs');
const superagent = require('superagent');
const { API } = require('../../utils/constants');
const Logger = require('../Logger');

module.exports = class CloudSession {
  static token;

  static async prepareSession() {
    if (this.token) return;
    this.renewToken();
  }

  static renewToken() {
    return superagent.head(API.getToken)
      .catch(error => Logger.error(error))
      .then((res) => {
        this.saveSession(res);
        return res;
      });
  }

  static async saveSession(sessionID) {
    if (!sessionID) return null;
    this.token = sessionID;
    return fs.writeFile('../../config/session', sessionID);
  }
};