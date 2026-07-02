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

  // Форматируем дату создания аккаунта
  const formatDate = (dateString) => {
    if (!dateString) return 'Неизвестно';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="paper-page profile-page">
      <title>Профиль</title>
      <div className="paper-card profile-card torn-edge">
        <div className="tape tape-top-left"></div>
        <div className="tape tape-top-right"></div>
        <div className="paper-crease"></div>

        <h2 className="paper-title">Мой профиль</h2>

        <div className="profile-info">
          <h3 className="profile-name">{user.nickname}</h3>
          <p className="profile-email">📧 {user.email}</p>
          {user.createdAt && (
            <p className="profile-created">
              📅 Участник с {new Date(user.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          )}
        </div>

        {/* Убрали статистику */}
      </div>
    </div>
  );
}

export default Profile;