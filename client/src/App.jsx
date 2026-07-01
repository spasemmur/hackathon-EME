import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation.jsx';
import Home from './components/Home/Home.jsx';
import About from './components/About/About.jsx';
import Login from './components/Login/Login.jsx';
import Profile from './components/Profile/Profile.jsx';
import { getProfile } from './api'; // ✅ импорт
import './shared/shared.css';

function App() {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      if (localStorage.getItem('token')) {
        try {
          const data = await getProfile();
          setUser(data);
          setIsAuth(true);
        } catch (e) {
          console.log("Сессия истекла");
        }
      }
    };
    initAuth();
  }, []);

  // ✅ функция входа — вызывается после успешного логина/регистрации
  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuth(true);
  };

  // ✅ переименовали logout в handleLogout для единообразия
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
          isLoggedIn={isAuth}           // ✅ было: isLoggedIn
          onLogout={handleLogout}        // ✅ теперь существует
          nickname={user?.nickname}      // ✅ было: currentUser
        />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={
              <Login onLogin={handleLogin} /> // ✅ теперь существует
            } />
            <Route
              path="/profile"
              element={
                <Profile
                  user={user}               // ✅ было: currentUser
                  isLoggedIn={isAuth}       // ✅ было: isLoggedIn
                  onLogout={handleLogout}   // ✅ теперь существует
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;