const router = require('../../router')();
// const Logger = require('../../../services/Logger');
const SyncService = require('../../../services/sync');

router.post('/', async (req, res) => {
  console.log(req.body);
  res.emit('accept', 'Hello');
  // res.send('got it');
});

router.post('/state', async (req, res) => {
  SyncService.emitCloud('POST/gardens/stations/state', req.body);
});

module.exports = router;
