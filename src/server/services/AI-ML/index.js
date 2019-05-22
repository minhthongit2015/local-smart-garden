
// const superagent = require('superagent');
// const config = require('../../../config/server');
const tf = require('@tensorflow/tfjs-node');
const AIMLManager = require('./manager');


module.exports = class AIML {
  static get models() { return AIML._models || []; }

  static async loadModels() {
    const models = AIMLManager.listVersions();
    AIML._models = {};
    const promises = Object.keys(models).map(modelName => {
      const latestVersion = models[modelName][0];
      if (latestVersion) {
        return tf.loadLayersModel(`file://${AIMLManager.modelsPath}/${modelName}/${modelName}@${latestVersion}/model.json`).then(model => {
          AIML._models[modelName] = model;
        });
      }
      return null;
    });
    await Promise.all(promises);
    return AIML._models;
  }
};
