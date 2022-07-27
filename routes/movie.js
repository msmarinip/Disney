const { Router } = require('express');
const { check } = require('express-validator');
const { Movie, Op } = require('../database/config.js');
const router = Router();

const multer  = require('multer');
const { validateFields } = require('../middlewares/validateFields.js');
const { validateJWT } = require('../middlewares/validateJWT.js');
const { createMovie, updateMovie, deleteMovie, getMovies } = require('../controllers/movie');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/movies');
    },
    filename: (req, file, cb) => {
        
        const ext = file.originalname.split('.').pop();
        cb(null, `${Date.now()}.${ext}`);
    }
})

const upload = multer({ storage });

router.post(
    '/image', 
    upload.single('image'),
    (req, res) => {
        res.send({fileName: req.file.filename});
    }
);
router.post(
    '/',
    [
        check('title').not().isEmpty(),
        check('title').custom(value => {
            return Movie.findOne({
                where: {
                    title: {[Op.iLike]:  `${value}`}
                }
            }).then(movie => {
                if(movie){
                    return Promise.reject('Title already exists.');
                }
            });
        }),
        check('score', 'Score must be between 1 and 5.').isInt({ min: 1, max: 5 }),
        check('characters').isArray(),
        validateFields,
        validateJWT
    ],
    createMovie
);

router.put(
    '/:id',
    [
        check('id').custom(value => {
            return Movie.findOne({
                where: {
                    id: parseInt(value)
                }
            }).then(movie => {
                if(!movie){
                    return Promise.reject('Movie not found.');
                }
            });
        }),
        check('title').not().isEmpty(),
        check('score', 'Score must be between 1 and 5.').isInt({ min: 1, max: 5 }),
        check('characters').isArray(),
        validateFields,
        validateJWT
    ],
    updateMovie
);

router.delete('/:id', validateJWT, deleteMovie);

router.get('/', validateJWT, getMovies)


module.exports = router;