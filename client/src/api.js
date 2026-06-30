const API_URL = "http://5.42.110.101:3001";

// Регистрация — отправляем ВСЕ поля
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: userData.login,          // email
        password: userData.password,
        nickname: userData.nickname,
        gender: userData.gender,
        birthDate: userData.birthDate
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка регистрации');
    }

    return data;
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
};

// Вход — только логин и пароль
export const loginUser = async (login, password) => {
  try {
    const response = await fetch(`${API_URL}/registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка входа');
    }

    return data;
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
};

// Получение сообщения с сервера
export const getServerMessage = async () => {
  try {
    const response = await fetch(`${API_URL}/`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка получения данных:', error);
    throw error;
  }
};