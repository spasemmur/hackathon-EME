import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from './About.jsx';
import { registerUser, getServerMessage } from './api.js';
import './App.css';

function Home() {
  const [showModal, setShowModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [serverMessage, setServerMessage] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Состояния для форм
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [registerLogin, setRegisterLogin] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  useEffect(() => {
    // Получаем сообщение с сервера
    getServerMessage()
      .then(data => {
        console.log('Данные с сервера:', data);
        setServerMessage(data.message);
      })
      .catch(err => {
        console.error('Ошибка:', err);
        setServerMessage('Не удалось подключиться к серверу');
      });

    // Загружаем сохранённые данные
    const savedLogin = localStorage.getItem('rememberedLogin');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedLogin && savedPassword) {
      setLoginInput(savedLogin);
      setPasswordInput(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      setError('');
      setSuccessMessage('');
      
      const data = await registerUser(loginInput, passwordInput);
      
      if (data.success) {
        if (rememberMe) {
          localStorage.setItem('rememberedLogin', loginInput);
          localStorage.setItem('rememberedPassword', passwordInput);
        } else {
          localStorage.removeItem('rememberedLogin');
          localStorage.removeItem('rememberedPassword');
        }
        
        setSuccessMessage(data.message);
        setTimeout(() => {
          setShowModal(false);
          setShowLogin(false);
          setSuccessMessage('');
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async () => {
    try {
      setError('');
      setSuccessMessage('');
      
      const data = await registerUser(registerLogin, registerPassword);
      
      if (data.success) {
        setSuccessMessage(data.message);
        setTimeout(() => {
          setShowModal(false);
          setShowRegister(false);
          setSuccessMessage('');
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      {/* Навигация */}
      <nav className="navbar">
        <Link to="/about" className="nav-link">О сайте</Link>
      </nav>

      {/* Иконка пользователя */}
      <div className="user-icon" onClick={() => setShowModal(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="white">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>

      <div className="content">
        <h1>Трекер привычек</h1>
        <p>Клиентская часть запущена</p>
        
        {serverMessage && (
          <div className="server-message">
            <p>{serverMessage}</p>
          </div>
        )}
      </div>

      {/* Модальное окно */}
      {showModal && (
        <div className="modal-overlay" onClick={() => {
          setShowModal(false);
          setShowRegister(false);
          setShowLogin(false);
          setError('');
          setSuccessMessage('');
        }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            
            {!showRegister && !showLogin ? (
              <>
                <h2>Добро пожаловать!</h2>
                <button className="modal-btn register-btn" onClick={() => setShowRegister(true)}>
                  Регистрация
                </button>
                <button className="modal-btn login-btn" onClick={() => setShowLogin(true)}>
                  Вход
                </button>
                <button className="close-btn" onClick={() => {
                  setShowModal(false);
                  setShowRegister(false);
                  setShowLogin(false);
                }}>✕</button>
              </>
            ) : showRegister ? (
              <>
                <h2>Регистрация</h2>
                <div className="form-group">
                  <label>Логин:</label>
                  <input 
                    type="text" 
                    placeholder="Введите логин" 
                    className="form-input"
                    value={registerLogin}
                    onChange={(e) => setRegisterLogin(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Пароль:</label>
                  <input 
                    type="password" 
                    placeholder="Введите пароль" 
                    className="form-input"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                </div>
                <button className="modal-btn register-btn" onClick={handleRegister}>
                  Зарегистрироваться
                </button>
                <button className="modal-btn back-btn" onClick={() => {
                  setShowRegister(false);
                  setError('');
                }}>
                  Назад
                </button>
                <button className="close-btn" onClick={() => {
                  setShowModal(false);
                  setShowRegister(false);
                }}>✕</button>
              </>
            ) : (
              <>
                <h2>Вход</h2>
                <div className="form-group">
                  <label>Логин:</label>
                  <input 
                    type="text" 
                    placeholder="Введите логин" 
                    className="form-input"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Пароль:</label>
                  <input 
                    type="password" 
                    placeholder="Введите пароль" 
                    className="form-input"
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

                <button className="modal-btn login-btn" onClick={handleLogin}>
                  Войти
                </button>
                <button className="modal-btn back-btn" onClick={() => {
                  setShowLogin(false);
                  setError('');
                }}>
                  Назад
                </button>
                <button className="close-btn" onClick={() => {
                  setShowModal(false);
                  setShowLogin(false);
                }}>✕</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;