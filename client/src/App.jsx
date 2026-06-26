import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Состояния для форм
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Загрузка сохранённых данных при загрузке страницы
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      setLoginEmail(savedEmail);
      setLoginPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  // Обработка входа
  const handleLogin = () => {
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', loginEmail);
      localStorage.setItem('rememberedPassword', loginPassword);
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
    }
    
    alert(`Вход выполнен!\nEmail: ${loginEmail}`);
    // Здесь будет отправка данных на сервер
    setShowModal(false);
    setShowLogin(false);
  };

  // Обработка регистрации
  const handleRegister = () => {
    alert(`Регистрация выполнена!\nEmail: ${registerEmail}`);
    // Здесь будет отправка данных на сервер
    setShowModal(false);
    setShowRegister(false);
  };

  return (
    <div className="app">
      {/* Иконка пользователя */}
      <div className="user-icon" onClick={() => setShowModal(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="white">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>

      {/* Главный контент */}
      <div className="content">
        <h1>Трекер привычек</h1>
        <p>Клиентская часть запущена</p>
      </div>

      {/* Модальное окно */}
      {showModal && (
        <div className="modal-overlay" onClick={() => {
          setShowModal(false);
          setShowRegister(false);
          setShowLogin(false);
        }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {/* Главное меню */}
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
              // Форма регистрации
              <>
                <h2>Регистрация</h2>
                <div className="form-group">
                  <label>Почта:</label>
                  <input 
                    type="email" 
                    placeholder="Введите email" 
                    className="form-input"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
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
                <button className="modal-btn back-btn" onClick={() => setShowRegister(false)}>
                  Назад
                </button>
                <button className="close-btn" onClick={() => {
                  setShowModal(false);
                  setShowRegister(false);
                }}>✕</button>
              </>
            ) : (
              // Форма входа
              <>
                <h2>Вход</h2>
                <div className="form-group">
                  <label>Почта:</label>
                  <input 
                    type="email" 
                    placeholder="Введите email" 
                    className="form-input"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Пароль:</label>
                  <input 
                    type="password" 
                    placeholder="Введите пароль" 
                    className="form-input"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                
                {/* Чекбокс "Запомнить меня" */}
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
                <button className="modal-btn back-btn" onClick={() => setShowLogin(false)}>
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

export default App;