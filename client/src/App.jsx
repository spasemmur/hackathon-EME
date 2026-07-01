import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation.jsx';
import Home from './components/Home/Home.jsx';
import About from './components/About/About.jsx';
import Login from './components/Login/Login.jsx';
import Profile from './components/Profile/Profile.jsx';
import Statistics from './components/Statistics/Statistics.jsx';
import './shared/shared.css';

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