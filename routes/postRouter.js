const Router = require('express');
const router = new Router();
const controllers = require("../controllers/postController");
const checkAuth = require('../utils/checkAuth');
const { body } = require('express-validator');
const handleValidationErrors  = require('../utils/handleValidationErrors');

router.post('/create', checkAuth, [
    body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 3}).isString(),
    body('tags', 'Неверный формат тэгов (укажите массив)').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString()
], handleValidationErrors, controllers.create);
router.get('/posts', controllers.getAll);
router.get('/popular', controllers.getPopular);
router.get('/tags/:tag', controllers.getPostsBySearch);
router.get('/tags', controllers.getLastTags);
router.get('/posts/:id', controllers.getOne);
router.get('/posts/comments/:id', controllers.getPostsComments);
router.delete('/posts/:id', checkAuth, controllers.remove);
router.patch('/posts/:id', checkAuth, [
    body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 3}).isString(),
    body('tags', 'Неверный формат тэгов (укажите массив)').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString()
], handleValidationErrors, controllers.update);
module.exports = router;