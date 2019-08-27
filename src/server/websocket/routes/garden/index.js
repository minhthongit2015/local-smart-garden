const router = require('../../router')();
const EnvironmentRoute = require('./environment');

router.use('/environment', EnvironmentRoute);

module.exports = router;
