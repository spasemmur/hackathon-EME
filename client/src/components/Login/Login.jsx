import { useState } from 'react';
import { registerUser, loginUser } from '../../api.js';
import './Login.css';

function Login({ onLogin }) {
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regNickname, setRegNickname] = useState('');
  const [regGender, setRegGender] = useState('');
  const [regBirthDate, setRegBirthDate] = useState('');

  const handleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      const data = await loginUser(loginInput, passwordInput);

      if (data.success) {
        // ✅ запоминаем только логин, не пароль
        if (rememberMe) {
          localStorage.setItem('rememberedLogin', loginInput);
        }
        // ✅ передаём нормализованные данные
        onLogin({
          nickname: data.user?.username || data.user?.nickname || loginInput,
          email: data.user?.email,
          id: data.user?.id
        });
        setSuccessMessage('Вход выполнен успешно!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.message || 'Ошибка входа');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setError('');

      // Проверка на пустые поля
      if (!regEmail || !regPassword || !regNickname || !regGender || !regBirthDate) {
        setError('Заполните все поля');
        return;
      }

      // Валидация email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(regEmail)) {
        setError('Введите корректный email (например: user@mail.ru)');
        return;
      }

      // Валидация пароля
      if (regPassword.length < 8) {
        setError('Пароль должен быть минимум 8 символов');
        return;
      }

      // Валидация никнейма
      if (regNickname.length < 3) {
        setError('Никнейм должен быть минимум 3 символа');
        return;
      }

      setLoading(true);

      const result = await registerUser({
        email: regEmail,
        password: regPassword,
        nickname: regNickname,
        sex: regGender,       // api.js конвертирует 'male'/'female' в 1/2
        birthdate: regBirthDate
      });

      if (result.success) {
        // ✅ автовход после регистрации
        onLogin({
          nickname: result.user?.username || result.user?.nickname,
          email: result.user?.email,
          id: result.user?.id
        });

        setBannerMessage(`🎉 ${result.message || 'Регистрация прошла успешно!'}`);
        setShowBanner(true);

        // Очистка формы
        setRegEmail('');
        setRegPassword('');
        setRegNickname('');
        setRegGender('');
        setRegBirthDate('');
        setShowRegister(false);

        setTimeout(() => setShowBanner(false), 5000);
      } else {
        setError(result.message || 'Ошибка регистрации');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="paper-page login-page">
      {showBanner && (
        <div className="success-banner">
          <div className="banner-content">
            <span className="banner-icon">✓</span>
            <span className="banner-text">{bannerMessage}</span>
          </div>
          <button className="banner-close" onClick={() => setShowBanner(false)}>✕</button>
        </div>
      )}

      <div className="paper-card auth-card torn-edge">
        <div className="tape tape-top-center"></div>
        <div className="paper-crease"></div>

        {!showRegister ? (
          <>
            <h2 className="paper-title">Вход в аккаунт</h2>

            {error && <div className="paper-error">{error}</div>}
            {successMessage && <div className="paper-success">{successMessage}</div>}

            <div className="form-group">
              <label className="paper-label">Логин:</label>
              <input
                type="text"
                className="paper-input"
                placeholder="Email или никнейм"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="paper-label">Пароль:</label>
              <input
                type="password"
                className="paper-input"
                placeholder="Введите пароль"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
            </div>

            <div className="remember-me">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkmark"></span>
                Запомнить меня
              </label>
            </div>

            <button
              className="paper-btn primary-btn glued-btn"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Входим...' : 'Войти'}
            </button>

            <button
              className="paper-btn secondary-btn"
              onClick={() => { setShowRegister(true); setError(''); }}
              disabled={loading}
            >
              Создать аккаунт
            </button>
          </>
        ) : (
          <>
            <h2 className="paper-title">Регистрация</h2>

            {error && <div className="paper-error">{error}</div>}

            <div className="form-group">
              <label className="paper-label">Никнейм:</label>
              <input
                type="text"
                className="paper-input"
                placeholder="Как к вам обращаться?"
                value={regNickname}
                onChange={(e) => setRegNickname(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="paper-label">Email:</label>
              <input
                type="email"
                className="paper-input"
                placeholder="example@mail.ru"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="paper-label">Пароль:</label>
              <input
                type="password"
                className="paper-input"
                placeholder="Минимум 8 символов"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="paper-label">Пол:</label>
              <select
                className="paper-input"
                value={regGender}
                onChange={(e) => setRegGender(e.target.value)}
              >
                <option value="">Выберите пол</option>
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
              </select>
            </div>

            <div className="form-group">
              <label className="paper-label">Дата рождения:</label>
              <input
                type="date"
                className="paper-input"
                value={regBirthDate}
                onChange={(e) => setRegBirthDate(e.target.value)}
              />
            </div>

            <button
              className="paper-btn primary-btn glued-btn"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? 'Регистрируемся...' : 'Зарегистрироваться'}
            </button>

            <button
              className="paper-btn secondary-btn"
              onClick={() => { setShowRegister(false); setError(''); }}
              disabled={loading}
            >
              Назад ко входу
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;