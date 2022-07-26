const { User, Op } = require('../database/config.js');
const { generateJWT } = require("../helpers/jwt");


const userCreate = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const bcrypt = require('bcryptjs');
        const salt = bcrypt.genSaltSync(10);
        const userPassword = bcrypt.hashSync(password, salt);
        const user = await User.create({
            name,
            email,
            password: userPassword
        });

        const token = await generateJWT(user.id,user.name)

        res.json({
            ok: true,
            user,
            token
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
            error
        });
    }
}

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    try {
        const user = await User.findOne({ 
            where: { email: {[Op.iLike]:`${email}`}}
        });
        console.log(1,user)
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos'
            });
        }
        const bcrypt = require('bcryptjs');
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos'
            });
        }
        const token = await generateJWT(user.id,user.name)

        res.json({
            ok: true,
            user,
            token
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado',
            error
        });
    }
}
module.exports = {
    userCreate,
    userLogin
}