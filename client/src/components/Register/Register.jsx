import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../api.js';
import "../Login/Login.css";

function Register({ onLogin }) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nickname: '',
        email: '',
        password: '',
        sex: '',
        birthdate: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Функция для форматирования даты (ДД.ММ.ГГГГ)
    const handleDateChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Удаляем всё кроме цифр

        // Добавляем точки автоматически
        if (value.length >= 2 && value.length < 5) {
            value = value.slice(0, 2) + '.' + value.slice(2);
        } else if (value.length >= 5) {
            value = value.slice(0, 2) + '.' + value.slice(2, 4) + '.' + value.slice(4, 8);
        }

        setFormData({ ...formData, birthdate: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password || !formData.nickname || !formData.sex || !formData.birthdate) {
            setError('Заполните все поля');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Введите корректный email');
            return;
        }

        if (formData.password.length < 8) {
            setError('Пароль должен быть минимум 8 символов');
            return;
        }

        if (formData.nickname.length < 3) {
            setError('Никнейм должен быть минимум 3 символа');
            return;
        }

        setLoading(true);

        try {
            // Преобразуем ДД.ММ.ГГГГ в ГГГГ-ММ-ДД для сервера
            let formattedDate = formData.birthdate;
            if (formData.birthdate.includes('.')) {
                const [day, month, year] = formData.birthdate.split('.');
                formattedDate = `${year}-${month}-${day}`;
            }

            const result = await registerUser({
                email: formData.email,
                password: formData.password,
                nickname: formData.nickname,
                sex: formData.sex,
                birthdate: formattedDate  // теперь в формате ГГГГ-ММ-ДД
            });

            console.log('📥 Ответ сервера при регистрации:', result);

            if (result.success) {
                const userData = result.user || result;

                onLogin({
                    nickname: userData.nickname || userData.username || formData.nickname,
                    email: userData.email || formData.email,
                    id: userData.id
                });

                setTimeout(() => navigate('/tasks'), 500);
            } else {
                setError(result.message || 'Ошибка регистрации');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="paper-page login-page">
            <div className="paper-card auth-card torn-edge">
                <div className="tape tape-top-center"></div>
                <div className="paper-crease"></div>

                <h2 className="paper-title">Регистрация</h2>

                {error && <div className="paper-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="paper-label">Никнейм:</label>
                        <input
                            type="text"
                            name="nickname"
                            className="paper-input"
                            placeholder="Как к вам обращаться?"
                            value={formData.nickname}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="paper-label">Email:</label>
                        <input
                            type="email"
                            name="email"
                            className="paper-input"
                            placeholder="example@mail.ru"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="paper-label">Пароль:</label>
                        <input
                            type="password"
                            name="password"
                            className="paper-input"
                            placeholder="Минимум 8 символов"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="paper-label">Пол:</label>
                        <select
                            name="sex"
                            className="paper-input"
                            value={formData.sex}
                            onChange={handleChange}
                        >
                            <option value="">Выберите пол</option>
                            <option value="male">Мужской</option>
                            <option value="female">Женский</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="paper-label">
                            Дата рождения:
                            <span className="label-hint">(ДД.ММ.ГГГГ)</span>
                        </label>
                        <input
                            type="text"
                            name="birthdate"
                            className="paper-input"
                            placeholder="15.05.2000"
                            value={formData.birthdate}
                            onChange={handleDateChange}
                            maxLength={10}
                        />
                    </div>

                    <button
                        type="submit"
                        className="paper-btn primary-btn glued-btn"
                        disabled={loading}
                    >
                        {loading ? 'Регистрируемся...' : 'Зарегистрироваться'}
                    </button>

                    <div className="auth-switch">
                        Уже есть аккаунт? <Link to="/login">Войти</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;