const router = require('../router')();
const gardenRouter = require('./garden');
const stationRouter = require('./station');

router.ws('message', async (req, res) => {
  console.log('onmessage', req.data);
  res.send('hello back');
});

router.use('/garden', gardenRouter);
router.use('/station', stationRouter);


module.exports = router;
