const multer  = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../uploads/characters');
    },
    filename: (req, file, cb) => {
        
        const ext = file.originalname.split('.').pop();
        cb(null, `${Date.now()}.${ext}`);
    }
})


    const upload = multer({ storage }).single('image')


module.exports = upload;