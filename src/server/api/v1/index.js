const router = require('express').Router();
const StationsRouter = require('./stations');

router.use('/stations', StationsRouter);

module.exports = router;
