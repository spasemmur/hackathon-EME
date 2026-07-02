import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { uploadAvatar, deleteAvatar } from '../../api';
import './Profile.css';

const API_URL = import.meta.env.VITE_API_URL || '';

function Profile({ user, isLoggedIn }) {
  const [avatar, setAvatar] = useState(user?.avatar ? `${API_URL}${user.avatar}` : null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // ✅ Обработка выбора файла
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    // Проверка размера (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Загружаем на сервер
      const avatarUrl = await uploadAvatar(file);
      const fullUrl = `${API_URL}${avatarUrl}`;
      setAvatar(fullUrl);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('Не удалось загрузить фото: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ Клик по кнопке загрузки
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // ✅ Удаление аватара
  const handleRemoveAvatar = async () => {
    if (!confirm('Удалить фото профиля?')) return;

    try {
      await deleteAvatar();
      setAvatar(null);
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Не удалось удалить фото');
    }
  };

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
      <title>Профиль</title>
      <div className="paper-card profile-card torn-edge">
        <div className="tape tape-top-left"></div>
        <div className="tape tape-top-right"></div>
        <div className="paper-crease"></div>

        <h2 className="paper-title">Мой профиль</h2>

        {/* ✅ Секция аватара */}
        <div className="avatar-section">
          <div className="avatar-wrapper">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="avatar-image" />
            ) : (
              <div className="avatar-placeholder">
                <span className="avatar-icon">👤</span>
              </div>
            )}

            {isUploading && (
              <div className="avatar-loading">
                <div className="spinner"></div>
              </div>
            )}
          </div>

          {/* Кнопки управления */}
          <div className="avatar-controls">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              style={{ display: 'none' }}
            />

            <button
              className="paper-btn primary-btn upload-btn"
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              {isUploading ? '⏳ Загрузка...' : '📷 Загрузить фото'}
            </button>

            {avatar && (
              <button
                className="paper-btn secondary-btn remove-btn"
                onClick={handleRemoveAvatar}
              >
                ✕ Удалить
              </button>
            )}
          </div>
        </div>

        {/* Информация о пользователе */}
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
      </div>
    </div>
  );
}

export default Profile;