import { Link } from 'react-router-dom';
import './Profile.css';

function Profile({ user, isLoggedIn }) {
  if (!isLoggedIn || !user) {
    return (
      <div className="paper-page profile-page">
        <div className="paper-card torn-edge">
          <div className="tape tape-top-center"></div>
          <div className="paper-crease"></div>
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h2 className="paper-title">Профиль</h2>
            <p className="paper-text">
              Пожалуйста, войдите в свой аккаунт, чтобы просматривать профиль
            </p>
            <Link to="/login" className="paper-btn primary-btn glued-btn">
              Перейти ко входу
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="paper-page profile-page">
      <div className="paper-card profile-card torn-edge">
        <div className="tape tape-top-left"></div>
        <div className="tape tape-top-right"></div>
        <div className="paper-crease"></div>

        <h2 className="paper-title">Мой профиль</h2>

        <div className="profile-header soft-shadow">
          <div className="profile-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="80" height="80" fill="#555">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div className="profile-info">
            <h3 className="profile-name">{user.nickname}</h3>
            <p className="profile-login">Почта: {user.email}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item soft-shadow">
            <div className="stat-number">0</div>
            <div className="stat-label">Привычек</div>
          </div>
          <div className="stat-item soft-shadow">
            <div className="stat-number">0</div>
            <div className="stat-label">Дней подряд</div>
          </div>
          <div className="stat-item soft-shadow">
            <div className="stat-number">0%</div>
            <div className="stat-label">Успешность</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;