const nodemailer = require("nodemailer")

const emailSender = async (subject, html, email ) =>{
    console.log(1)
    console.log(subject, html, email)
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        post: 465,
        secure: false,
        auth: {
            user: "msmarinip@gmail.com",
            pass: process.env.CODE
        },
        tls: {
            rejectUnauthorized: false
        }
        })
        mailOptions = {
            from: "Remitente",
            to: email,
            subject: subject,
            html: html
        }
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                // console.log(error)
                return resMail= {
                    ok: false,
                    msg: "hubo un error",
                    err: error
                }
            } else {
                // console.log("email enviado")
                return resMail = {
                    
                    ok: true,
                    msg: "mensaje enviado"};
            }
        })
}



module.exports = {
    emailSender
}