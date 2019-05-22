

const Gardener = require('./services/gardener');
const updateService = require('./services/updater');
const AIML = require('./services/AI-ML');

module.exports = async function startUp() {
  await AIML.loadModels();
  Gardener.startWorking();
  updateService.checkForUpdateAIMLModels();
  setInterval(() => {
    updateService.checkForUpdateAIMLModels();
  }, 3600 * 1000); // 1 hour
};
