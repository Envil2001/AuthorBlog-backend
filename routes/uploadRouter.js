const Router = require('express');
const router = new Router();
const checkAuth = require('../utils/checkAuth');
const fs = require("fs")

const multer = require('multer');
// When the storage will be created, execute the function 

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads')
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });
router.post('/upload', checkAuth, upload.single('image'), async (req, res) => {
    try {
        res.json({
            url: req.file.originalname
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'чот не вышло'
        });
    }
});

module.exports = router;