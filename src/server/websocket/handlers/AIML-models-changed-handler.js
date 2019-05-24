/* eslint-disable no-param-reassign */

/* eslint-disable class-methods-use-this */

const colors = require('colors/safe');
const debug = require('debug')('app:server');
const BaseHandler = require('./base-handler');
const { WS_EVENTS } = require('../../../shared/constants');
const Updater = require('../../services/updater');

module.exports = class CommandHandler extends BaseHandler {
  setup(io, clients, manager) {
    super.setup(io, clients, manager);
    this.addEvent(WS_EVENTS.AIMLModelsChanged);
    this.addListener(this.AIMLModelsChanged.bind(this));
  }

  async handleAIMLModelsChanged(/* socket, data */) {
    debug(colors.yellow('[Cloud]'), WS_EVENTS.AIMLModelsChanged);
    Updater.checkForUpdateAIMLModels();
  }
};
