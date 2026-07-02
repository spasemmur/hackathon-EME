const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Пытаемся достать токен из заголовка Authorization
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Вы не авторизованы (токен отсутствует)" });
    }

    try {
        // 2. Проверяем валидность токена через наш секретный ключ
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Записываем расшифрованные данные пользователя прямо в объект запроса (req)
        // Теперь в любом контроллере у нас будет доступ к req.user.id
        req.user = decoded;

        // 4. Пропускаем запрос дальше к контроллеру
        next();
    } catch (error) {
        return res.status(401).json({ message: "Токен недействителен или просрочен" });
    }
};