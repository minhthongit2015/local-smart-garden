const router = require('express').Router();
const Logger = require('../../../services/Logger');
const SyncService = require('../../../services/sync');
const { apiEndpoints } = require('../../../utils/constants');

// Websocket only
router.post('/connect', (req, res) => {
  Logger.catch(() => {
    res.emit('accept', '');
  });
});

router.post('/state', (req) => {
  Logger.catch(() => {
    const { stationId } = req.params;
    SyncService.cloud.post(apiEndpoints.gardens.stations.STATE(stationId || 1), req.body);
  });
});

module.exports = router;
