import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation({ isLoggedIn, onLogout, nickname }) {
  return (
    <nav className="paper-nav">
      {/* Логотип — всегда виден, но кликабельный только если не на главной */}
      <Link to="/" className="nav-logo-link">
        <div className="nav-logo">
          <div className="logo-tape"></div>
          <h1>Поток</h1>
        </div>
      </Link>

      <div className="nav-links">
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="nav-link">
              {nickname || 'Профиль'}
            </Link>
            <button className="paper-btn secondary-btn nav-logout" onClick={onLogout}>
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link to="/about" className="nav-link">О проекте</Link>
            <Link to="/login" className="paper-btn primary-btn">
              Войти
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navigation;