const { Router } = require('express');


const userRoutes = require('./user');

const router = Router();

router.use('/auth', userRoutes);

module.exports = router;