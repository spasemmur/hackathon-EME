const API_URL = import.meta.env.VITE_API_URL || '';

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

export const loginUser = async (login, password) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }), // ✅ было: { email, password }
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

// ==================== ЗАДАЧИ ====================

// Получить все задачи (с фильтрами)
export const getTasks = async (filters = {}) => {
  const token = getToken();
  const queryParams = new URLSearchParams(filters).toString();
  const url = `${API_URL}/api/tasks${queryParams ? '?' + queryParams : ''}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.tasks;
};

// Создать задачу
export const createTask = async (taskData) => {
  const token = getToken();

  console.log('📤 createTask:', taskData);

  try {
    const response = await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(taskData)
    });

    console.log('📥 Response status:', response.status);

    const data = await response.json();
    console.log('📥 Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || `Ошибка ${response.status}`);
    }

    return data.task;
  } catch (error) {
    console.error('❌ createTask error:', error);
    throw error;
  }
};

// Обновить задачу
export const updateTask = async (id, taskData) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(taskData)
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.task;
};

// Переключить статус задачи (выполнена/не выполнена)
export const toggleTask = async (id) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/tasks/${id}/toggle`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.task;
};

// Удалить задачу
export const deleteTask = async (id) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  }
  return true;
};

// Получить статистику по задачам
export const getTaskStats = async () => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/tasks/stats`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.stats;
};

// ==================== ЦЕЛИ ====================

// Получить все цели
export const getGoals = async () => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/goals`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.goals;
};

// Создать цель
export const createGoal = async (goalData) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/goals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(goalData)
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.goal;
};

// Обновить прогресс цели
export const updateGoalProgress = async (id, currentValue) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/goals/${id}/progress`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ current_value: currentValue })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.goal;
};

// Удалить цель
export const deleteGoal = async (id) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/goals/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  }
  return true;
};