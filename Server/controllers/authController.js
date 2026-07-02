const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
const jwt = require('jsonwebtoken');

// Схема валидации входящих данных через Zod
const registerSchema = z.object({
    nickname: z.string().min(3, "Имя слишком короткое"),
    email: z.string().email("Неверный формат почты"),
    password: z.string().min(8, "Пароль минимум 8 символов"),
    sex: z.number().min(0).max(2).optional(),
    birthdate: z.string().optional(), // можно добавить проверку даты
});

exports.register = async (req, res) => {
    try {
        const validatedData = registerSchema.parse(req.body);

        const candidate = await User.findOne({ where: { email: validatedData.email } });
        if (candidate) {
            return res.status(400).json({ message: "Этот email уже занят" });
        }
        const user = await User.create(validatedData);

        // --- ДОБАВЛЯЕМ ГЕНЕРАЦИЮ ТОКЕНА ---
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '6h' }
        );

        res.status(201).json({
            success: true,
            message: "Пользователь успешно создан",
            token, // Отдаем токен сразу!
            user: {
                id: user.id,
                username: user.nickname,
                email: user.email
            }
        });

    } catch (error) {
        // 1. Проверяем, что это ошибка именно от Zod
        if (error.name === 'ZodError' || error.errors) {
            return res.status(400).json({
                success: false,
                message: "Ошибка валидации данных",
                // Добавили ?. перед map - если ошибок нет, код не упадет
                errors: error.errors?.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                })) || []
            });
        }

        // 2. Если это НЕ Zod (например, база данных или опечатка)
        console.error("Критическая ошибка бэкенда:", error);
        res.status(500).json({
            success: false,
            message: "Внутренняя ошибка сервера",
            details: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { login, password } = req.body; // login = email ИЛИ nickname

        // определяем по наличию @ — это email или никнейм
        const isEmail = login.includes('@');

        const user = await User.findOne({
            where: isEmail ? { email: login } : { nickname: login }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: "Неверный логин или пароль"
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '6h' }
        );

        res.json({
            success: true,
            message: "Вход выполнен!",
            token,
            user: { id: user.id, username: user.nickname, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Ошибка сервера" });
    }
};