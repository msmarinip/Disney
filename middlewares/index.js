const validateFields = require('./validateFields');
const validateJWT = require('./validateJWT');

module.exports = {
    ...validateFields,
    ...validateJWT,
};