

const Gardener = require('./services/gardener');
const updateService = require('./services/update');
const AIML = require('./services/AI-ML');

module.exports = async function startUp() {
  await AIML.loadModels();
  Gardener.startWorking();
  updateService.checkForUpdateAIMLModels();
};
