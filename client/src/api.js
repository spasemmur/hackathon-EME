const API_URL = import.meta.env.VITE_API_URL || '';

// Универсальная функция для безопасного парсинга ответа
const safeJson = async (response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error('❌ Сервер вернул не JSON:', text.substring(0, 200));
    throw new Error(`Сервер вернул некорректный ответ (${response.status})`);
  }
};

// Универсальная функция для проверки ответа
const checkResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');
    throw new Error('Сессия истекла. Войдите снова.');
  }

  const data = await safeJson(response);

  if (!response.ok) {
    throw new Error(data.message || `Ошибка ${response.status}`);
  }

  return data;
};

// Помощник для получения токена
const getToken = () => localStorage.getItem('token');

// Заголовки с авторизацией
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// ==================== АУТЕНТИФИКАЦИЯ ====================

export const getProfile = async () => {
  const token = getToken();
  if (!token) throw new Error('Токен не найден');

  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: authHeaders()
  });

  return await checkResponse(response);
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nickname: userData.nickname,
      email: userData.email,
      password: userData.password,
      sex: userData.sex === 'male' ? 1 : 2,
      birthdate: userData.birthdate
    }),
  });

  const data = await safeJson(response);

  if (response.ok && data.token) {
    localStorage.setItem('token', data.token);
  }

  if (!response.ok) {
    if (data.errors) {
      const messages = data.errors.map(e => e.message).join(', ');
      throw new Error(messages);
    }
    throw new Error(data.message || 'Ошибка регистрации');
  }

  return { success: true, ...data };
};

export const loginUser = async (login, password) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  });

  const data = await safeJson(response);

  if (response.ok && data.token) {
    localStorage.setItem('token', data.token);
  }

  if (!response.ok) {
    throw new Error(data.message || 'Ошибка входа');
  }

  return data;
};

// ==================== ЗАДАЧИ ====================

export const getTasks = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const url = `${API_URL}/api/tasks${queryParams ? '?' + queryParams : ''}`;

  const response = await fetch(url, { headers: authHeaders() });
  const data = await checkResponse(response);
  return data.tasks || [];
};

export const createTask = async (taskData) => {
  const response = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(taskData)
  });

  const data = await checkResponse(response);
  return data.task;
};

export const updateTask = async (id, taskData) => {
  const response = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(taskData)
  });

  const data = await checkResponse(response);
  return data.task;
};

export const toggleTask = async (id) => {
  const response = await fetch(`${API_URL}/api/tasks/${id}/toggle`, {
    method: 'PATCH',
    headers: authHeaders()
  });

  const data = await checkResponse(response);
  return data.task;
};

export const deleteTask = async (id) => {
  const response = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });

  await checkResponse(response);
  return true;
};

export const getTaskStats = async () => {
  const response = await fetch(`${API_URL}/api/tasks/stats`, {
    headers: authHeaders()
  });

  try {
    const data = await checkResponse(response);
    return data.stats;
  } catch (error) {
    console.warn('⚠️ Статистика недоступна:', error.message);
    // Возвращаем пустую статистику вместо ошибки
    return { total: 0, completed: 0, active: 0, productivity: 0 };
  }
};

// ==================== ЦЕЛИ ====================

export const getGoals = async () => {
  const response = await fetch(`${API_URL}/api/goals`, {
    headers: authHeaders()
  });

  const data = await checkResponse(response);
  return data.goals || [];
};

export const createGoal = async (goalData) => {
  const response = await fetch(`${API_URL}/api/goals`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(goalData)
  });

  const data = await checkResponse(response);
  return data.goal;
};

export const updateGoalProgress = async (id, currentValue) => {
  const response = await fetch(`${API_URL}/api/goals/${id}/progress`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ current_value: currentValue })
  });

  const data = await checkResponse(response);
  return data.goal;
};

export const deleteGoal = async (id) => {
  const response = await fetch(`${API_URL}/api/goals/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });

  await checkResponse(response);
  return true;
};