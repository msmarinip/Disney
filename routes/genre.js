const { Router } = require('express');
const { check } = require('express-validator');
const { Genre, Op } = require('../database/config.js');
const { createGenre, updateGenre, deleteGenre, getGenres } = require('../controllers/genre');
const { validateFields, validateJWT } = require('../middlewares');

const router = Router();

const multer  = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/genres');
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
    })


router.post(
    '/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('name').custom((value, { req }) => {
            return Genre.findOne({ where: { name: {[Op.iLike]:`${value}`} } }).then(genre => {
                if (genre) {
                    return Promise.reject('Name already exists');
                }
            });
        }),
        validateFields,
        validateJWT
    ],
    createGenre)

router.put(
    '/:id',
    [
        check('name', 'Name is required').not().isEmpty(),
        validateFields,
        validateJWT
    ],
    updateGenre)


router.delete('/:id', validateJWT, deleteGenre)

router.get('/', validateJWT, getGenres)

module.exports = router;