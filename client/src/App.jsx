import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation.jsx';
import Home from './components/Home/Home.jsx';
import About from './components/About/About.jsx';
import Login from './components/Login/Login.jsx';
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
          console.log('📥 Ответ сервера:', data); // для отладки

          // ✅ Нормализуем данные
          setUser({
            nickname: data.user?.nickname || data.nickname,
            email: data.user?.email || data.email,
            id: data.user?.id || data.userId,
            createdAt: data.user?.createdAt || data.createdAt
          });
          setIsAuth(true);
        } catch (e) {
          console.error("❌ Сессия истекла:", e);
          localStorage.removeItem('token');
          setUser(null);
          setIsAuth(false);
        }
      }
    };
    initAuth();
  }, []);

  const handleLogin = (userData) => {
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
    window.location.href = '/';
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
            <Route path="/tasks" element={
              isAuth ? <Dashboard user={user} /> : <Navigate to="/login" replace />
            } />
            <Route path="/profile" element={
              <Profile user={user} isLoggedIn={isAuth} onLogout={handleLogout} />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;