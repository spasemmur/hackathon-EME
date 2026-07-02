import { Link } from 'react-router-dom';
import ProfileDropdown from '../Profile/ProfileDropdown';
import './Navigation.css';

function Navigation({ isLoggedIn, onLogout, user }) {
  return (
    <nav className="paper-nav">
      <Link to="/" className="nav-logo-link">
        <div className="nav-logo">
          <div className="logo-tape"></div>
          <h1>Поток</h1>
        </div>
      </Link>

      <div className="nav-links">
        {!isLoggedIn && (
          <Link to="/about" className="nav-link">О проекте</Link>
        )}

        <ProfileDropdown
          user={user}
          isLoggedIn={isLoggedIn}
          onLogout={onLogout}
        />
      </div>
    </nav>
  );
}

export default Navigation;