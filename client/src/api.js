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

// ✅ Функция для очистки токена (используется везде)
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiry');
  localStorage.removeItem('rememberMe');
  localStorage.removeItem('rememberedLogin');
  sessionStorage.removeItem('token');
};

// Универсальная функция для проверки ответа
const checkResponse = async (response) => {
  if (response.status === 401) {
    clearAuth(); // ✅ Очищаем оба хранилища
    throw new Error('Сессия истекла. Войдите снова.');
  }

  const data = await safeJson(response);

  if (!response.ok) {
    throw new Error(data.message || `Ошибка ${response.status}`);
  }

  return data;
};

// Умное получение токена (проверяем оба хранилища)
const getToken = () => {
  // Сначала проверяем localStorage (долгосрочное)
  const localToken = localStorage.getItem('token');
  const localExpiry = localStorage.getItem('tokenExpiry');

  if (localToken && localExpiry) {
    if (Date.now() < parseInt(localExpiry)) {
      return localToken;
    } else {
      // Токен истёк — удаляем
      clearAuth();
      return null;
    }
  }

  // Потом проверяем sessionStorage (краткосрочное)
  return sessionStorage.getItem('token');
};

// ✅ Умное сохранение токена (учитывает rememberMe)
const saveToken = (token, rememberMe = false) => {
  if (rememberMe) {
    localStorage.setItem('token', token);
    localStorage.setItem('rememberMe', 'true');
    localStorage.setItem('tokenExpiry', Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 дней
  } else {
    sessionStorage.setItem('token', token);
    localStorage.setItem('rememberMe', 'false');
  }
};

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

// ✅ Регистрация с учётом rememberMe
export const registerUser = async (userData, rememberMe = false) => {
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

  // ✅ Сохраняем токен с учётом rememberMe
  if (response.ok && data.token) {
    saveToken(data.token, rememberMe);

    if (rememberMe && userData.email) {
      localStorage.setItem('rememberedLogin', userData.email);
    }
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

// ✅ Логин с учётом rememberMe
export const loginUser = async (login, password, rememberMe = false) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  });

  const data = await safeJson(response);

  // ✅ Сохраняем токен с учётом rememberMe
  if (response.ok && data.token) {
    saveToken(data.token, rememberMe);

    if (rememberMe) {
      localStorage.setItem('rememberedLogin', login);
    } else {
      localStorage.removeItem('rememberedLogin');
    }
  }

  if (!response.ok) {
    throw new Error(data.message || 'Ошибка входа');
  }

  return data;
};

// ✅ Функция выхода
export const logout = () => {
  clearAuth();
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

// ✅ Загрузка аватара на сервер
export const uploadAvatar = async (file) => {
  const token = getToken();
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetch(`${API_URL}/api/auth/upload-avatar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
      // Content-Type НЕ устанавливаем для FormData!
    },
    body: formData
  });

  const data = await checkResponse(response);
  return data.avatarUrl;
};

// Удаление аватара
export const deleteAvatar = async () => {
  const token = getToken();

  const response = await fetch(`${API_URL}/api/auth/delete-avatar`, {
    method: 'DELETE',
    headers: authHeaders()
  });

  await checkResponse(response);
  return true;
};