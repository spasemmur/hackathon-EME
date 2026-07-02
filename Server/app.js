const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// CORS
app.use(cors({
    origin: ['http://localhost:5173', 'https://spasemmur.ru'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Разрешаем доступ к загруженным файлам
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Роуты
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/goals', require('./routes/goals'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Server started on port ${PORT}`);
});