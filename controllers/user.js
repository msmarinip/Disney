const { User, Op } = require('../database/config.js');
const { generateJWT } = require("../helpers/jwt");
const { emailSender } = require('../helpers/sendMail.js');


const createUser = async (req, res) => {
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

        const subject = `${name}, welcome to the Disney Api`;
        const html = `<h1>Welcome ${name}</h1>`;
        await emailSender(subject, html, email)

        res.json({
            ok: true,
            user,
            token
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Unexpected error',
            error
        });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ 
            where: { email: {[Op.iLike]:`${email}`}}
        });
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid user or password'
            });
        }
        const bcrypt = require('bcryptjs');
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid user or password'
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
            msg: 'Unexpected error',
            error
        });
    }
}
module.exports = {
    createUser,
    loginUser
}