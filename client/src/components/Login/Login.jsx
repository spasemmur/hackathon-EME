import { useState } from 'react';
import { registerUser, loginUser } from '../../api.js';
import './Login.css';

function Login({ onLogin }) {
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');

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
      const data = await loginUser(loginInput, passwordInput);

      if (data.success) {
        if (rememberMe) {
          localStorage.setItem('rememberedLogin', loginInput);
          localStorage.setItem('rememberedPassword', passwordInput);
        }
        onLogin({ login: loginInput, nickname: data.user?.nickname || loginInput });
        setSuccessMessage('Вход выполнен успешно!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(data.message || 'Ошибка входа');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async () => {
    try {
      setError('');

      if (!regEmail || !regPassword || !regNickname || !regGender || !regBirthDate) {
        setError('Заполните все поля');
        return;
      }

      if (regPassword.length < 8) {
        setError('Пароль должен быть минимум 8 символов');
        return;
      }

      if (regNickname.length < 3) {
        setError('Никнейм должен быть минимум 3 символа');
        return;
      }

      const result = await registerUser({
        login: regEmail,
        password: regPassword,
        nickname: regNickname,
        gender: regGender,
        birthDate: regBirthDate
      });

      if (result.success) {
        setBannerMessage(`🎉 ${result.message}`);
        setShowBanner(true);

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
                placeholder="Введите логин"
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

            <button className="paper-btn primary-btn glued-btn" onClick={handleLogin}>
              Войти
            </button>

            <button className="paper-btn secondary-btn" onClick={() => setShowRegister(true)}>
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
              <label className="paper-label">Логин (Email):</label>
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
                placeholder="Придумайте пароль"
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

            <button className="paper-btn primary-btn glued-btn" onClick={handleRegister}>
              Зарегистрироваться
            </button>

            <button className="paper-btn secondary-btn" onClick={() => setShowRegister(false)}>
              Назад ко входу
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;