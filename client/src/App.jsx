import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from './About.jsx';
import Profile from './Profile.jsx';
import Statistics from './Statistics.jsx';
import { registerUser, loginUser, getServerMessage } from './api.js';
import './App.css';
import galkaIcon from './assets/galka.png';
import statIcon from './assets/stat.png';
import chelIcon from './assets/chel.png';

function Navigation() {
  return (
    <nav className="paper-nav">

      <Link to="/" className="nav-logo-link">
        <div className="nav-logo">
          <div className="logo-tape"></div>
          <h1>
            Поток
          </h1>
        </div>
      </Link>

      <div className="nav-links">
        <Link to="/" className="nav-link">Главная</Link>
        <Link to="/about" className="nav-link">О проекте</Link>
        <Link to="/profile" className="nav-link">Профиль</Link>
        <Link to="/statistics" className="nav-link">Статистика</Link>
        <Link to="/login" className="paper-btn primary-btn">Войти</Link>
      </div>

    </nav>
  );
}

function Home() {
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    getServerMessage()
      .then((data) => setServerMessage(data.message))
      .catch(() => setServerMessage(""));
  }, []);

  return (
    <section className="paper-page">

      <div className="hero-section">

        <div className="hero-left">

          <div className="stamp stamp-approved">
            Организуй свою жизнь
          </div>

          <h1 className="paper-title hero-title">
            Создавай
            <br />
            полезные
            <br />
            привычки
          </h1>

          <p className="paper-text hero-text">
            Следи за ежедневными привычками,
            анализируй прогресс и постепенно
            достигай своих целей.
          </p>

          {serverMessage && (
            <div className="paper-note">
              <span className="note-icon">📌</span>
              <span>{serverMessage}</span>
            </div>
          )}

          <Link to="/login" className="paper-btn primary-btn glued-btn">
            Начать →
          </Link>

        </div>

        <div className="hero-right">

          <div className="paper-scene">

            <div className="scene-sun"></div>

            <div className="scene-cloud cloud-1"></div>
            <div className="scene-cloud cloud-2"></div>

            <div className="mountain mountain-1"></div>
            <div className="mountain mountain-2"></div>
            <div className="mountain mountain-3"></div>

            <div className="tree tree-1"></div>
            <div className="tree tree-2"></div>
            <div className="tree tree-3"></div>

            <div className="house"></div>

          </div>

        </div>

      </div>

      <div className="paper-features">

        <div className="feature-item soft-shadow">
          <div className="feature-icon">
            <img src={galkaIcon} alt="Привычки" className="icon-image" />
          </div>
          <h3>Привычки</h3>
          <p className="feature-text">
            Добавляй ежедневные привычки
            и отмечай выполнение.
          </p>
        </div>

        <div className="feature-item soft-shadow">
          <div className="feature-icon">
            <img src={statIcon} alt="Статистика" className="icon-image" />
          </div>
          <h3>Статистика</h3>
          <p className="feature-text">
            Следи за сериями,
            процентом выполнения
            и прогрессом.
          </p>
        </div>

        <div className="feature-item soft-shadow">
          <div className="feature-icon">
            <img src={chelIcon} alt="Цели" className="icon-image" />
          </div>
          <h3>Цели</h3>
          <p className="feature-text">
            Формируй новые полезные
            привычки постепенно.
          </p>
        </div>
      </div>

    </section>
  );
}

function Login({ onLogin }) {
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showBanner, setShowBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');

  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [regNickname, setRegNickname] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
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

      // 1. Простая проверка на пустые поля (локально)
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

      // 2. ОДИН запрос к серверу. Сохраняем ответ именно в 'data'
      const data = await registerUser({
        nickname: regNickname,
        email: regEmail,
        password: regPassword,
        sex: regGender,
        birthdate: regBirthDate
      });

      // 3. Теперь 'data' определена и мы её проверяем
      if (data.success) {
        // Если в бэкенде поле называется message, будет текст. 
        // Если нет - выведется стандартная фраза.
        setBannerMessage(`🎉 ${data.message || 'Регистрация прошла успешно!'}`);
        setShowBanner(true);

        // Очищаем форму
        setRegEmail('');
        setRegPassword('');
        setRegNickname('');
        setRegGender('');
        setRegBirthDate('');
        setShowRegister(false);

        setTimeout(() => setShowBanner(false), 5000);
      } else {
        setError(data.message || 'Ошибка регистрации');
      }
    } catch (err) {
      // Сюда попадут ошибки типа "Email занят" или ошибки сети
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedLogin = localStorage.getItem('rememberedLogin');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedLogin && savedPassword) {
      setIsLoggedIn(true);
      setCurrentUser({ login: savedLogin, nickname: savedLogin });
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
  };

  return (
    <Router>
      <div className="app craft-paper-bg">
        <Navigation />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/profile" element={<Profile user={currentUser} isLoggedIn={isLoggedIn} />} />
            <Route path="/statistics" element={<Statistics isLoggedIn={isLoggedIn} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;