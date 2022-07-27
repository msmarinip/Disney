const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields, validateJWT } = require('../middlewares/index.js');
const { Character, Op } = require('../database/config.js');
const { createCharacter, updateCharacter } = require('../controllers/character.js');

const router = Router();
// const multer  = require('multer');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, '../uploads/characters');
//     },
//     filename: (req, file, cb) => {
        
//         const ext = file.originalname.split('.').pop();
//         cb(null, `${Date.now()}.${ext}`);
//     }
// })

// const upload = multer({ storage }).single('image')

router.post(
    '/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('name').custom((value, { req }) => {
            return Character.findOne({ where: { name: {[Op.iLike]:`${value}`} } }).then(character => {
                if (character) {
                    return Promise.reject('Name already exists');
                }
            });
        }),
        check('age', 'Age must be a number').isNumeric(),
        check('age', 'Age must be greater than 0').isInt({ min: 0 }),
        check('weight', 'Weight must be a number').isNumeric(),
        check('weight', 'Weight must be greater than 0').isInt({ min: 0 }),
        check('movies', 'Movies must be an array').isArray(),
        validateFields,
        validateJWT,
        // upload
        
    ],
    createCharacter
);


router.put(
    '/:id',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('age', 'Age must be a number').isNumeric(),
        check('age', 'Age must be greater than 0').isInt({ min: 0 }),
        check('weight', 'Weight must be a number').isNumeric(),
        check('weight', 'Weight must be greater than 0').isInt({ min: 0 }),
        check('movies', 'Movies must be an array').isArray(),
        validateFields,
        validateJWT
    ],
    updateCharacter
);

module.exports = router;