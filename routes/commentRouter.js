const Router = require('express');
const router = new Router();
const checkAuth = require('../utils/checkAuth');
const controllers = require("../controllers/commentController");

router.post('/comment/:id', checkAuth, controllers.createComment);

module.exports = router;