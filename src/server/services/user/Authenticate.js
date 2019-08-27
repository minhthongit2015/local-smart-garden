
const superagent = require('superagent');
const { API } = require('../../utils/constants');
const CloudSession = require('./CloudSession');
const Logger = require('../Logger');

module.exports = class {

  static signin(username, password) {
    return superagent.post(API.signin)
      .send({ username, password })
      .catch(error => Logger.error(error))
      .then((res) => {
        CloudSession.saveSession(res);
        return res;
      });
  }


};