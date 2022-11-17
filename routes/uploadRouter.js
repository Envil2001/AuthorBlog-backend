const Router = require('express');
const router = new Router();
const checkAuth = require('../utils/checkAuth');

const multer = require('multer');
// When the storage will be created, execute the function 

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });
router.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `http://localhost:4444/uploads/${req.file.originalname}`
    });
});

module.exports = router;