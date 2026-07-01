const API_URL = "";

// Функция для получения данных профиля
export const getProfile = async () => {
  const token = localStorage.getItem('token'); // Берем токен из памяти

  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Показываем паспорт!
    },
  });

  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) localStorage.removeItem('token'); // Если протух - удаляем
    throw new Error(data.message);
  }
  return data;
};

// Регистрация с автоматическим сохранением токена
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nickname: userData.nickname,
        email: userData.email,
        password: userData.password,
        // Превращаем строку пола в число для БД (1 - муж, 2 - жен)
        sex: userData.sex === 'male' ? 1 : 2,
        birthdate: userData.birthdate
      }),
    });

    const data = await response.json();

    // --- МАГИЯ JWT ТУТ ---
    // Если сервер ответил успешно и прислал токен
    if (response.ok && data.token) {
      localStorage.setItem('token', data.token); // Сохраняем "паспорт" в браузер
    }

    if (!response.ok) {
      // Обработка ошибок от Zod (массив ошибок)
      if (data.errors) {
        const messages = data.errors.map(e => e.message).join(', ');
        throw new Error(messages);
      }
      // Обработка обычных ошибок (например, "Email занят")
      throw new Error(data.message || 'Ошибка регистрации');
    }

    // Возвращаем данные, чтобы React мог их использовать (например, скрыть форму)
    return { success: true, ...data };

  } catch (error) {
    console.error('Ошибка в функции registerUser:', error);
    throw error;
  }
};


// 1. Помощник для получения токена из памяти
const getToken = () => localStorage.getItem('token');

// 2. Функция входа (обновленная)
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok && data.token) {
    localStorage.setItem('token', data.token);
  }

  if (!response.ok) {
    throw new Error(data.message || 'Ошибка входа');
  }

  return data;
};

// 3. Универсальный защищенный запрос (шаблон для профиля, задач и т.д.)
export const getProtectedData = async (endpoint) => {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // ПЕРЕДАЕМ ТОКЕН В ЗАГОЛОВКЕ (стандарт Bearer)
      'Authorization': `Bearer ${token}`
    },
  });

  if (response.status === 401) {
    // Если сервер сказал, что токен протух — удаляем его
    localStorage.removeItem('token');
  }

  return await response.json();
};