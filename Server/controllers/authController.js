const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const path = require('path');
const fs = require('fs');

// Схема валидации регистрации
const registerSchema = z.object({
    nickname: z.string().min(3, 'Никнейм должен быть минимум 3 символа'),
    email: z.string().email('Некорректный email'),
    password: z.string().min(8, 'Пароль должен быть минимум 8 символов'),
    sex: z.number().int().refine(val => [1, 2].includes(val), 'Неверный пол'),
    birthdate: z.string().refine(val => !isNaN(Date.parse(val)), 'Неверная дата')
});

// Схема валидации входа
const loginSchema = z.object({
    login: z.string().min(1, 'Введите логин или email'),
    password: z.string().min(1, 'Введите пароль')
});

// Регистрация
exports.register = async (req, res) => {
    try {
        const validatedData = registerSchema.parse(req.body);

        // Проверяем существует ли пользователь с таким email или никнеймом
        const existingUser = await User.findOne({
            where: {
                email: validatedData.email
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Email уже занят' });
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        // Создаём пользователя
        const user = await User.create({
            nickname: validatedData.nickname,
            email: validatedData.email,
            password: hashedPassword,
            sex: validatedData.sex,
            birthdate: validatedData.birthdate
        });

        // Генерируем JWT токен
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            message: 'Пользователь зарегистрирован',
            token,
            user: {
                id: user.id,
                nickname: user.nickname,
                email: user.email,
                avatar: user.avatar,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        console.error('Ошибка регистрации:', error);

        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Ошибка валидации',
                errors: error.errors.map(e => ({ message: e.message }))
            });
        }

        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Вход
exports.login = async (req, res) => {
    try {
        const validatedData = loginSchema.parse(req.body);

        // Ищем пользователя по email или nickname
        const user = await User.findOne({
            where: {
                email: validatedData.login
            }
        });

        if (!user) {
            return res.status(401).json({ message: 'Неверный логин или пароль' });
        }

        // Проверяем пароль
        const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Неверный логин или пароль' });
        }

        // Генерируем JWT токен
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            message: 'Вход выполнен',
            token,
            user: {
                id: user.id,
                nickname: user.nickname,
                email: user.email,
                avatar: user.avatar,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        console.error('Ошибка входа:', error);

        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: 'Ошибка валидации',
                errors: error.errors.map(e => ({ message: e.message }))
            });
        }

        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Получение профиля
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'nickname', 'email', 'avatar', 'sex', 'birthdate', 'created_at']
        });

        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Ошибка получения профиля:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// ✅ Загрузка аватара
const upload = require('../middleware/upload');

exports.uploadAvatar = [
    upload.single('avatar'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'Файл не загружен' });
            }

            // Путь к файлу относительно сервера
            const avatarPath = `/uploads/avatars/${req.file.filename}`;

            // Если у пользователя уже был аватар — удаляем старый
            const user = await User.findByPk(req.user.id);
            if (user.avatar && user.avatar !== avatarPath) {
                const oldPath = path.join(__dirname, '..', user.avatar);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            // Обновляем аватар в БД
            await user.update({ avatar: avatarPath });

            res.json({
                success: true,
                message: 'Аватар загружен',
                avatarUrl: avatarPath
            });
        } catch (error) {
            console.error('Ошибка загрузки аватара:', error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }
];

// Удаление аватара
exports.deleteAvatar = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (user.avatar) {
            const avatarPath = path.join(__dirname, '..', user.avatar);
            if (fs.existsSync(avatarPath)) {
                fs.unlinkSync(avatarPath);
            }

            await user.update({ avatar: null });
        }

        res.json({
            success: true,
            message: 'Аватар удалён'
        });
    } catch (error) {
        console.error('Ошибка удаления аватара:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};