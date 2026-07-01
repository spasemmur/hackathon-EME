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
            { expiresIn: '15min' }
        );

        res.status(201).json({
            success: true, // Добавь это поле для фронтенда
            message: "Пользователь успешно создан",
            token, // Отдаем токен сразу!
            user: {
                id: user.id,
                username: user.nickname,
                email: user.email
            }
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера при регистрации" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Неверные данные для входа" });
        }

        // СОЗДАЕМ ТОКЕН
        // 1 параметр: данные, которые «зашиваем» в токен (id и email)
        // 2 параметр: секретный ключ из .env
        // 3 параметр: срок жизни токена (например, 24 часа)
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '6h' }
        );

        res.json({
            success: true,
            message: "Вход выполнен!",
            token, // Отправляем токен клиенту
            user: { id: user.id, username: user.nickname }
        });

    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
};