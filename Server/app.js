const express = require('express');
const apiRouter = require('./routes/index');

const app = express();
app.use(express.json());

app.use('/api', apiRouter);

// Теперь твои ссылки выглядят так:
// POST http://localhost:3000/api/auth/register
// POST http://localhost:3000/api/auth/login

app.listen(3001, () => console.log('Server started'));