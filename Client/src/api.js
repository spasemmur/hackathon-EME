const API_URL = "";

// Регистрация — адаптируем поля под бэкенд
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nickname: userData.nickname,
        email: userData.email,           // ← login → email
        password: userData.password,
        sex: userData.sex === 'male' ? 1 : 2,  // ← gender → sex (число)
        birthdate: userData.birthdate    // ← birthDate → birthdate
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Бэкенд может вернуть ошибки валидации
      if (data.errors) {
        const messages = data.errors.map(e => e.message).join(', ');
        throw new Error(messages);
      }
      throw new Error(data.message || 'Ошибка регистрации');
    }

    return { success: true, ...data };  // ← добавляем success для совместимости
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
};

// Вход — бэкенд ждёт email, а не login
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),  // ← email вместо login
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка входа');
    }

    return { success: true, ...data };  // ← добавляем success
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
};

// Получение сообщения с сервера
export const getServerMessage = async () => {
  try {
    const response = await fetch(`${API_URL}/api`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка получения данных:', error);
    throw error;
  }
};