const Router = require('express');
const router = new Router();
const checkAuth = require('../utils/checkAuth');

const multer = require('multer');
// When the storage will be created, execute the function 

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if(!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads')
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });
router.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: process.env.REACT_APP_API_URL + '/' + req.file.originalname
    });
});

module.exports = router;