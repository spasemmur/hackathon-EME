const API_URL = "";

// Регистрация
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nickname: userData.nickname,
        email: userData.login,              // login → email
        password: userData.password,
        sex: userData.gender === 'male' ? 1 : userData.gender === 'female' ? 2 : 0,
        birthdate: userData.birthDate       // birthDate → birthdate
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.errors) {
        const messages = data.errors.map(e => e.message).join(', ');
        throw new Error(messages);
      }
      throw new Error(data.message || 'Ошибка регистрации');
    }

    return { success: true, ...data };
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
};

// Вход
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка входа');
    }

    return { success: true, ...data };
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
};