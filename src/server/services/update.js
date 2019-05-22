
const fs = require('fs');
const path = require('path');
const superagent = require('superagent');
const semver = require('semver');
const unzip = require('unzip-stream');
const config = require('../../config/server');
const AIMLManager = require('./AI-ML/manager');

function download(url, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  return superagent.get(url);
};

module.exports = class {
  static async checkForUpdateAIMLModels() {
    const localVersions = AIMLManager.listVersions();
    const cloudVersions = await superagent.get(`${config.cloudAddress}/apis/AI-ML/check-update`)
      .then(response => response.body.versions);
    
    Object.keys(cloudVersions).forEach(model => {
      if (!localVersions[model]
          || (cloudVersions[model][0] && semver.lt(localVersions[model][0], cloudVersions[model][0]))) {
        const latestVersion = cloudVersions[model][0];
        download(`${config.cloudAddress}/apis/AI-ML/download/${model}`,
          `${AIMLManager.modelsPath}/${model}/${model}@${latestVersion}.zip`)
          .pipe(unzip.Extract({ path: `${AIMLManager.modelsPath}/${model}/${model}@${latestVersion}` }));
      }
    });
    console.log(localVersions, cloudVersions);
  }
};
