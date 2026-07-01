import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation.jsx';
import Home from './components/Home/Home.jsx';
import About from './components/About/About.jsx';
import Login from './components/Login/Login.jsx';
import Profile from './components/Profile/Profile.jsx';
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

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuth(false);
    window.location.href = '/'; // Редирект на главную
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('rememberedLogin');
    localStorage.removeItem('rememberedPassword');
  };

  return (
    <Router>
      <div className="app craft-paper-bg">
        <Navigation
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          nickname={currentUser?.nickname}
        />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route
              path="/profile"
              element={
                <Profile
                  user={currentUser}
                  isLoggedIn={isLoggedIn}
                  onLogout={handleLogout}
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