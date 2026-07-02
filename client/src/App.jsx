import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation.jsx';
import Home from './components/Home/Home.jsx';
import About from './components/About/About.jsx';
import Login from './components/Login/Login.jsx';
import Register from './components/Register/Register.jsx';
import Profile from './components/Profile/Profile.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import { getProfile } from './api';
import './shared/shared.css';

function App() {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      if (localStorage.getItem('token')) {
        try {
          const data = await getProfile();
          console.log('📥 Ответ сервера:', data); // Для отладки

          // ✅ Правильно извлекаем данные пользователя
          setUser({
            nickname: data.user?.nickname || data.nickname,
            email: data.user?.email || data.email,
            id: data.user?.id || data.userId,
            createdAt: data.user?.createdAt || data.createdAt
          });
          setIsAuth(true);
        } catch (e) {
          console.log("❌ Сессия истекла:", e);
          localStorage.removeItem('token');
          setUser(null);
          setIsAuth(false);
        }
      }
    };
    initAuth();
  }, []);

  const handleLogin = (userData) => {
    console.log('📥 Данные при входе:', userData);
    setUser({
      nickname: userData.nickname || userData.username,
      email: userData.email || userData.login,
      id: userData.id
    });
    setIsAuth(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuth(false);
    window.location.href = '/login'; // ✅ Перенаправляем на страницу входа
  };

  return (
    <Router>
      <div className="app craft-paper-bg">
        <Navigation
          isLoggedIn={isAuth}
          onLogout={handleLogout}
          user={user}
        />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home isAuth={isAuth} user={user} />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={
              isAuth ? <Navigate to="/tasks" replace /> : <Login onLogin={handleLogin} />
            } />
            <Route path="/register" element={
              isAuth ? <Navigate to="/tasks" replace /> : <Register onLogin={handleLogin} />
            } />
            <Route path="/tasks" element={
              isAuth ? <Dashboard user={user} /> : <Navigate to="/login" replace />
            } />
            <Route path="/profile" element={
              isAuth ? <Profile user={user} isLoggedIn={isAuth} onLogout={handleLogout} /> : <Navigate to="/login" replace />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;