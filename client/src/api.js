const API_URL = "http://5.42.110.101";

// Регистрация/Вход (бэкенд использует один маршрут)
export const registerUser = async (login, password) => {
  try {
    const response = await fetch(`${API_URL}/api/registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, password }),
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

// Получение сообщения с сервера
export const getServerMessage = async () => {
  try {
    const response = await fetch(`${API_URL}/api/`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка получения данных:', error);
    throw error;
  }
};