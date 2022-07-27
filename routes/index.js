const { Router } = require('express');


const userRoutes = require('./user');
const characterRoutes = require('./character');
const genreRoutes = require('./genre');
const movieRoutes = require('./movie');

const router = Router();

router.use('/auth', userRoutes);
router.use('/characters', characterRoutes);
router.use('/genres', genreRoutes);
router.use('/movies', movieRoutes);

module.exports = router;