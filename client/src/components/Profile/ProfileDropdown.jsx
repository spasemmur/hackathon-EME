import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './ProfileDropdown.css';

function ProfileDropdown({ user, isLoggedIn, onLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const onClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
        };
        const onEsc = (e) => e.key === 'Escape' && setIsOpen(false);
        document.addEventListener('mousedown', onClick);
        window.addEventListener('keydown', onEsc);
        return () => {
            document.removeEventListener('mousedown', onClick);
            window.removeEventListener('keydown', onEsc);
        };
    }, []);

    // Не авторизован — кнопка входа
    if (!isLoggedIn || !user) {
        return (
            <Link to="/login" className="pd-login-btn paper-btn primary-btn glued-btn">
                Войти
            </Link>
        );
    }

    return (
        <div className="profile-dropdown" ref={ref}>
            <button
                type="button"
                className={`pd-trigger ${isOpen ? 'is-open' : ''}`}
                onClick={() => setIsOpen((v) => !v)}
                aria-expanded={isOpen}
            >
                <span className="pd-trigger-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="#555">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                </span>
                <span className="pd-trigger-name">{user.nickname}</span>
                <svg
                    className={`pd-arrow ${isOpen ? 'is-rotated' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="#555"
                >
                    <path d="M7 10l5 5 5-5z" />
                </svg>
            </button>

            <div className={`pd-panel ${isOpen ? 'is-visible' : ''}`}>
                <div className="paper-card torn-edge pd-card">
                    <div className="tape tape-top-left"></div>
                    <div className="tape tape-top-right"></div>
                    <div className="paper-crease"></div>

                    <h2 className="paper-title pd-title">Мой профиль</h2>

                    <div className="pd-header soft-shadow">
                        <div className="pd-avatar">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="#555">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                        <div className="pd-info">
                            <h3 className="pd-name">{user.nickname}</h3>
                            <p className="pd-email">{user.email}</p>
                        </div>
                    </div>

                    <div className="pd-stats">
                        <div className="pd-stat soft-shadow">
                            <div className="pd-stat-num">0</div>
                            <div className="pd-stat-lbl">Привычек</div>
                        </div>
                        <div className="pd-stat soft-shadow">
                            <div className="pd-stat-num">0</div>
                            <div className="pd-stat-lbl">Дней подряд</div>
                        </div>
                        <div className="pd-stat soft-shadow">
                            <div className="pd-stat-num">0%</div>
                            <div className="pd-stat-lbl">Успешность</div>
                        </div>
                    </div>

                    <div className="pd-actions">
                        <Link to="/profile" className="paper-btn primary-btn glued-btn pd-full-btn">
                            Открыть полный профиль →
                        </Link>
                        {onLogout && (
                            <button type="button" className="paper-btn glued-btn pd-logout-btn" onClick={onLogout}>
                                Выйти
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileDropdown;