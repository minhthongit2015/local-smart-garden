
const colors = require('colors/safe');
const fs = require('fs');
const path = require('path');
const superagent = require('superagent');
const semver = require('semver');
const debug = require('debug')('app:server');
const unzip = require('unzip-stream');
const config = require('../config');
const AIMLManager = require('./AI-ML/manager');

function download(url, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  return superagent.get(url);
};

module.exports = class {
  static async checkForUpdateAIMLModels() {
    debug(colors.magenta('[Updater]'), 'Checking for update...');
    const localVersions = AIMLManager.listVersions();
    const cloudVersions = await superagent.get(`${config.cloudEndPoint}/apis/AI-ML/check-update`)
      .then(response => response.body.versions);
    
    let hasNewUpdate = false;
    if (cloudVersions) {
      Object.keys(cloudVersions).forEach(modelName => {
        if (!localVersions[modelName]
            || (cloudVersions[modelName][0] && semver.lt(localVersions[modelName][0], cloudVersions[modelName][0]))) {
          hasNewUpdate = false;
          const latestVersion = cloudVersions[modelName][0];
          debug(colors.magenta('[Updater]'), `Model "${modelName}" has new version - "${latestVersion}"`);
          download(`${config.cloudEndPoint}/apis/AI-ML/download/${modelName}`,
            `${AIMLManager.modelsPath}/${modelName}/${modelName}@${latestVersion}.zip`)
            .pipe(unzip.Extract({ path: `${AIMLManager.modelsPath}/${modelName}/${modelName}@${latestVersion}` }));
        }
      });
    }
    if (!hasNewUpdate) {
      debug(colors.magenta('[Updater]'), 'Every AI/ML models are up to date.');
    }
  }
};
