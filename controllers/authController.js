
const User = require("../models/userModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
class authController {
    async registration(req, res) {
        try {
            const { password } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            const doc = new User({
                email: req.body.email,
                fullName: req.body.fullName,
                avatarUrl: req.body.avatarUrl,
                passwordHash: hash,
            });

            const user = await doc.save();
            const token = jwt.sign(
                {
                    _id: user._id,
                },
                process.env.SECRET_KEY,
                {
                    expiresIn: '24d',
                },
            );

            const { passwordHash, ...userData } = user._doc; // деструктуризация
            res.json(
                {
                    ...userData,
                    token,
                }
            );
        } catch (e) {
            console.log(e);
            res.status(500).json({
                message: 'Не удалось зарегестрироваться'
            });
        }
    }
    async login(req, res) {
        try {
            const user = await userModel.findOne({ email: req.body.email });
            if (!user) {
                return res.status(404).json({ message: "Пользователь не найден", })
            }
            const { password } = req.body;
            const validPassword = bcrypt.compareSync(password, user._doc.passwordHash);
            if (!validPassword) {
                return res.status(404).json({ message: "Неверный логин или пароль", })
            }
            const token = jwt.sign(
                {
                    _id: user._id,
                },
                process.env.SECRET_KEY,
                {
                    expiresIn: '24d',
                },
            );

            const { passwordHash, ...userData } = user._doc; // деструктуризация
            res.json(
                {
                    ...userData,
                    token,
                }
            );
        } catch (e) {
            console.log(e);
            res.status(500).json({
                message: 'Не удалось авторизироваться'
            });
        }
    }
    async getMe(req, res) {
        try {
            const user = await userModel.findById(req.userId);

            if (!user) {
                return res.status(404).json({
                    message: "Пользователь не найден",
                });
            }
            const { passwordHash, ...userData } = user._doc; // деструктуризация
            res.json(userData);
        } catch (e) {
            console.log(e);
            res.status(500).json({
                message: "Нет доступа",
            });
        }
    }
    async getUsers(req, res) {
        try {
            const users = await userModel.find();

            res.json(users);
        } catch (e) {
            console.log(e);
            res.status(500).json({
                message: 'Не удалось получить users'
            });
        }
    }
    async getUserOne(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findById(id);

            return res.json(user);
        } catch (e) {
            console.log(e);
            res.status(500).json({
                message: 'Не удалось получить users'
            });
        }
    }
    async userUpdate(req, res) {
        try {
            const userId = req.params.id;

            await userModel.updateOne({
                _id: userId
            },
                {
                    avatarUrl: req.body.avatarUrl,
                    fullName: req.body.fullName,
                },
            )

            res.json({
                message: "Пользователь обновлен"
            });

        } catch (e) {
            console.log(e);
            res.status(500).json({
                message: 'Не удалось обновить юзера'
            });
        }
    }
}


module.exports = new authController();