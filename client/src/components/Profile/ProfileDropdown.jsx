import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProfileDropdown.css';

const API_URL = import.meta.env.VITE_API_URL || '';

function ProfileDropdown({ user, isLoggedIn, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Аватар из user.avatar
    const avatarUrl = user?.avatar ? `${API_URL}${user.avatar}` : null;

    // Закрытие при клике вне
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        onLogout();
        setIsOpen(false);
        navigate('/login');
    };

    if (!isLoggedIn || !user) {
        return (
            <div className="auth-buttons">
                <Link to="/login" className="nav-link">Войти</Link>
                <Link to="/register" className="nav-btn primary">Регистрация</Link>
            </div>
        );
    }

    return (
        <div className="profile-dropdown" ref={dropdownRef}>
            {/* ✅ Кнопка-триггер с аватаркой */}
            <button
                className="profile-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="trigger-avatar">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="trigger-avatar-img" />
                    ) : (
                        <div className="trigger-avatar-placeholder">
                            <span>👤</span>
                        </div>
                    )}
                </div>
                <span className="trigger-name">{user.nickname}</span>
                <span className={`trigger-arrow ${isOpen ? 'open' : ''}`}>▼</span>
            </button>

            {/* ✅ Выпадающее меню */}
            {isOpen && (
                <div className="dropdown-menu">
                    {/* Мини-профиль с аватаркой */}
                    <div className="mini-profile">
                        <div className="mini-avatar">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="mini-avatar-img" />
                            ) : (
                                <div className="mini-avatar-placeholder">
                                    <span>👤</span>
                                </div>
                            )}
                        </div>
                        <div className="mini-info">
                            <div className="mini-name">{user.nickname}</div>
                            <div className="mini-email">{user.email}</div>
                        </div>
                    </div>

                    <div className="dropdown-divider"></div>

                    {/* Ссылки */}
                    <Link to="/profile" className="dropdown-item" onClick={() => setIsOpen(false)}>
                        <span className="item-icon"></span>
                        Мой профиль
                    </Link>
                    <Link to="/tasks" className="dropdown-item" onClick={() => setIsOpen(false)}>
                        <span className="item-icon">📋</span>
                        Мои задачи
                    </Link>

                    <div className="dropdown-divider"></div>

                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                        <span className="item-icon"></span>
                        Выйти
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProfileDropdown;