const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { z } = require('zod');

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
        // 1. Валидация входных данных
        const validatedData = registerSchema.parse(req.body);

        // 2. Проверка, не занят ли email
        const candidate = await User.findOne({ where: { email: validatedData.email } });
        if (candidate) {
            return res.status(400).json({ message: "Этот email уже занят" });
        }

        // 3. Создание пользователя
        // (Пароль захешируется сам благодаря hook beforeCreate в модели, который мы писали раньше)
        const user = await User.create(validatedData);

        // 4. Ответ (не отправляем пароль обратно!)
        res.status(201).json({
            message: "Пользователь успешно создан",
            user: {
                id: user.id,
                nickname: user.nickname,
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

        // 1. Ищем пользователя по почте
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Пользователь с такой почтой не найден" });
        }

        // 2. Сравниваем пароли (введенный и захешированный из базы)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Неверный пароль" });
        }

        // 3. Если всё ок (здесь обычно создают JWT токен, но для начала можно просто вернуть успех)
        res.json({
            message: "Вход выполнен успешно",
            user: {
                id: user.id,
                nickname: user.nickname,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера при входе" });
    }
};