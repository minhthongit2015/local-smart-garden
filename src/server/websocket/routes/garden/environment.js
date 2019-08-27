const router = require('../../router')();
const Logger = require('../../../services/Logger');
const SyncService = require('../../../services/sync');

router.post('/', async (req, res) => {
  const { deviceId } = req.params;
  const { temperature, humidity, light, pump, led, fan } = req.body;
  SyncService.emitAll('environment', {
    params: {
      deviceId
    },
    body: {
      temperature, humidity, light,
      pump, led, fan
    }
  });
  res.send('got it');
});

router.ws('/device', async (req, res) => {
  Logger.log('garden list', req.session.user);
  res.send('garden list');
});

module.exports = router;
