const { Router } = require('express');
const { check } = require('express-validator');
const { userCreate, userLogin } = require('../controllers/user');
const { validateFields } = require('../middlewares/validateFields');
const { User, Op } = require('../database/config.js');
const router = Router();

router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('name').custom((value, { req }) => {
            return User.findOne({ where: { name: {[Op.iLike]:`${value}`} } }).then(user => {
                if (user) {
                    return Promise.reject('Name already exists');
                }
            });
        }),
        check('email').isEmail().withMessage('Not valid email'),
        check('email').custom((value, { req }) => {
            return User.findOne({ where: { email: {[Op.iLike]:`${value}`} } }).then(user => {
                if (user) {
                    return Promise.reject('Email already exists');
                }
            });
        }),
        check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
        validateFields
    ],
    userCreate
    )
router.post(
    '/login',
    [
        check('email','Email is required').not().isEmpty(),
        check('email').isEmail().withMessage('Not valid email'),
        check('password','Password is required').not().isEmpty(),
        validateFields
    ],
    userLogin
    )


module.exports = router;