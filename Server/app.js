const cors = require("cors");
const express = require('express');
const apiRouter = require('./routes/index');
const taskRoutes = require('./routes/tasks');
const goalRoutes = require('./routes/goals');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', apiRouter); // Базовые роуты (auth и т.д.)
app.use('/api/tasks', taskRoutes); // Задачи
app.use('/api/goals', goalRoutes); // Цели

app.listen(3001, () => console.log('Server started on port 3001')); 