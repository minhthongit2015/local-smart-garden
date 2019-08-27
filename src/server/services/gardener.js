
const debug = require('debug')('app:gardener');
const tf = require('@tensorflow/tfjs-node');
const LoggerService = require('./Logger');
const AIML = require('../services/AI-ML');
const StationManager = require('./stations-manager');

module.exports = class Gardener {
  static startWorking() {
    debug('[Gardener] Start Working!');
    try {
      Gardener.test();
    } catch (error) {
      LoggerService.error(error);
    }
  }

  static dispatchCommand() {
  }

  static test() {
    setInterval(async () => {
      // const first = WebsocketManager.garden.clientArray[0];
      // Gardener.dispatchCommand({
      //   state1: Math.random(),
      //   state2: Math.random() > 0.5,
      //   state3: Math.random().toString()
      // }, first);
      Gardener.takeCareOfAllStations();
    }, 15000);
  }

  static async takeCareOfStation(station) {
    const now = new Date();
    
    const pumpFactors = tf.tensor2d([
      station.state.temperature,
      station.state.humidity,
      station.state.light,
      station.plant.days,
      now.getHours()*3600 + now.getMinutes()*60
    ], [1, 5]);
    
    const fanFactors = tf.tensor2d([
      station.state.temperature,
      station.state.humidity,
      station.state.light,
      station.plant.days,
      now.getHours()*3600 + now.getMinutes()*60
    ], [1, 5]);
    
    const ledFactors = tf.tensor2d([
      station.state.temperature,
      station.state.humidity,
      station.state.light,
      station.plant.days,
      now.getHours()*3600 + now.getMinutes()*60
    ], [1, 5]);
    
    const mistingFactors = tf.tensor2d([
      station.state.temperature,
      station.state.humidity,
      station.state.light,
      station.plant.days,
      now.getHours()*3600 + now.getMinutes()*60
    ], [1, 5]);
    
    const nutrientFactors = tf.tensor2d([
      station.state.temperature,
      station.state.humidity,
      station.state.light,
      station.plant.days,
      now.getHours()*3600 + now.getMinutes()*60
    ], [1, 5]);
    
    const nutrient = await AIML.models.ppm.predict(nutrientFactors);
    const pump = await AIML.models.ppm.predict(pumpFactors);
    const led = await AIML.models.ppm.predict(ledFactors);
    const misting = await AIML.models.ppm.predict(mistingFactors);
    const fan = await AIML.models.ppm.predict(fanFactors);
    nutrientFactors.dispose();
    pumpFactors.dispose();
    ledFactors.dispose();
    mistingFactors.dispose();

    const hasChange = station.setState({
      nutri: nutrient.dataSync()[0],
      pump: pump.dataSync()[0],
      led: led.dataSync()[0],
      misting: misting.dataSync()[0],
      fan: fan.dataSync()[0]
    });
    if (hasChange) {
      station.syncState();
    }
    return hasChange;
  }

  static async takeCareOfAllStations() {
    return StationManager.stations.map(station => {
      return Gardener.takeCareOfStation(station);
    });
  }
};
