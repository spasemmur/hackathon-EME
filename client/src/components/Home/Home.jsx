import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getServerMessage } from '../../api.js';
import galkaIcon from '../../assets/galka.png';
import statIcon from '../../assets/stat.png';
import chelIcon from '../../assets/chel.png';
import './Home.css';

function Home() {
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    getServerMessage()
      .then((data) => setServerMessage(data.message))
      .catch(() => setServerMessage(""));
  }, []);

  return (
    <section className="paper-page">
      <div className="hero-section">
        <div className="hero-left">
          <div className="stamp stamp-approved">
            Организуй свою жизнь
          </div>

          <h1 className="paper-title hero-title">
            Создавай<br />
            полезные<br />
            привычки
          </h1>

          <p className="paper-text hero-text">
            Следи за ежедневными привычками,
            анализируй прогресс и постепенно
            достигай своих целей.
          </p>

          {serverMessage && (
            <div className="paper-note">
              <span className="note-icon">📌</span>
              <span>{serverMessage}</span>
            </div>
          )}

          <Link to="/login" className="paper-btn primary-btn glued-btn">
            Начать →
          </Link>
        </div>

        <div className="hero-right">
          <div className="paper-scene">
            <div className="scene-sun"></div>
            <div className="scene-cloud cloud-1"></div>
            <div className="scene-cloud cloud-2"></div>
            <div className="mountain mountain-1"></div>
            <div className="mountain mountain-2"></div>
            <div className="mountain mountain-3"></div>
            <div className="tree tree-1"></div>
            <div className="tree tree-2"></div>
            <div className="tree tree-3"></div>
            <div className="house"></div>
          </div>
        </div>
      </div>

      <div className="paper-features">
        <div className="feature-item soft-shadow">
          <div className="feature-icon">
            <img src={galkaIcon} alt="Привычки" className="icon-image" />
          </div>
          <h3>Привычки</h3>
          <p className="feature-text">
            Добавляй ежедневные привычки
            и отмечай выполнение.
          </p>
        </div>

        <div className="feature-item soft-shadow">
          <div className="feature-icon">
            <img src={statIcon} alt="Статистика" className="icon-image" />
          </div>
          <h3>Статистика</h3>
          <p className="feature-text">
            Следи за сериями,
            процентом выполнения
            и прогрессом.
          </p>
        </div>

        <div className="feature-item soft-shadow">
          <div className="feature-icon">
            <img src={chelIcon} alt="Цели" className="icon-image" />
          </div>
          <h3>Цели</h3>
          <p className="feature-text">
            Формируй новые полезные
            привычки постепенно.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Home;