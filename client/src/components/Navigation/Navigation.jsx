import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="paper-nav">
      <Link to="/" className="nav-logo-link">
        <div className="nav-logo">
          <div className="logo-tape"></div>
          <h1>Поток</h1>
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

export default Navigation;