import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api';
import './Login.css';

function Login({ onLogin }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // ✅ Загружаем сохранённый логин при монтировании
  useEffect(() => {
    const rememberedLogin = localStorage.getItem('rememberedLogin');
    if (rememberedLogin) {
      setLoginInput(rememberedLogin);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ✅ Передаём rememberMe в функцию
      const data = await loginUser(loginInput, passwordInput, rememberMe);

      onLogin({
        nickname: data.user?.nickname || loginInput,
        email: data.user?.email,
        id: data.user?.id
      });

      navigate('/tasks');
    } catch (err) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="paper-page login-page">
      <div className="paper-card auth-card torn-edge">
        <div className="tape tape-top-center"></div>
        <div className="paper-crease"></div>

        <h2 className="paper-title">Вход в аккаунт</h2>

        {error && <div className="paper-error">{error}</div>}

        <form onSubmit={handleLogin}>
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
            type="submit"
            className="paper-btn primary-btn glued-btn"
            disabled={loading}
          >
            {loading ? 'Входим...' : 'Войти'}
          </button>

          <div className="auth-switch">
            Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;