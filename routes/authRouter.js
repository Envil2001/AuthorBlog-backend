const Router = require('express');
const router = new Router();
const controllers = require('../controllers/authController');
const checkAuth = require('../utils/checkAuth');
const handleValidationErrors  = require('../utils/handleValidationErrors');
const { body } = require('express-validator');




router.post('/registration', [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5}),
    body('fullName', 'Укажите имя').isLength({ min: 3}),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL()
], handleValidationErrors, controllers.registration);
router.post('/login', [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5}),
], handleValidationErrors, controllers.login);
router.get('/me', checkAuth, controllers.getMe);
router.get('/users', controllers.getUsers);
router.get('/user/:id', controllers.getUserOne);
router.patch('/user/:id', checkAuth, controllers.userUpdate);
module.exports = router;