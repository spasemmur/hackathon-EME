import { Link } from 'react-router-dom';
import './Home.css';

// Иконки для фич
const featureIcons = {
  tasks: '📋',
  progress: '📊',
  goals: '🎯',
  focus: '🎯',
  habits: '🕐',
  visual: '📈'
};

function Home() {
  return (
    <section className="paper-page home-page">
      
      {/* ===== HERO СЕКЦИЯ ===== */}
      <div className="hero-section">
        
        <div className="hero-paper">
          <div className="tape tape-top-left"></div>
          
          <h1 className="hero-title">
            Ваш путь<br />
            к продуктивности
          </h1>
          
          <p className="hero-description">
            Поток — это трекер задач и привычек, который помогает вам 
            фокусироваться на важном, отслеживать прогресс и достигать целей.
          </p>
          
          <Link to="/login" className="paper-btn primary-btn glued-btn hero-btn">
            Начать
          </Link>
        </div>

        {/* Декоративная сцена справа */}
        <div className="hero-scene">
          <div className="scene-sky">
            <div className="scene-sun"></div>
            <div className="scene-cloud cloud-1"></div>
            <div className="scene-cloud cloud-2"></div>
          </div>
          <div className="scene-mountains">
            <div className="mountain mountain-1"></div>
            <div className="mountain mountain-2"></div>
            <div className="mountain mountain-3"></div>
          </div>
          <div className="scene-ground">
            <div className="tree tree-1"></div>
            <div className="tree tree-2"></div>
            <div className="tree tree-3"></div>
            <div className="house"></div>
          </div>
        </div>
      </div>
      <div className="features-paper">
        <div className="tape tape-top-right"></div>
        
        <p className="features-intro">После входа вам станут доступны:</p>
        
        <div className="features-row">
          <div className="feature-bubble">
            <div className="feature-bubble-icon">{featureIcons.tasks}</div>
            <div className="feature-bubble-text">
              <strong>Задачи</strong>
              <span>Планируйте и выполняйте</span>
            </div>
          </div>

          <div className="feature-bubble">
            <div className="feature-bubble-icon">{featureIcons.progress}</div>
            <div className="feature-bubble-text">
              <strong>Прогресс</strong>
              <span>Отслеживайте результаты</span>
            </div>
          </div>

          <div className="feature-bubble">
            <div className="feature-bubble-icon">{featureIcons.goals}</div>
            <div className="feature-bubble-text">
              <strong>Цели</strong>
              <span>Достигайте большего</span>
            </div>
          </div>
        </div>
      </div>
      <h2 className="section-title why-title">Почему Поток?</h2>

      <div className="why-grid">
        <div className="why-card soft-shadow">
          <div className="tape tape-top-center"></div>
          <div className="why-icon">{featureIcons.focus}</div>
          <h3 className="why-card-title">Фокус на важном</h3>
          <p className="why-card-text">
            Сконцентрируйтесь на задачах, которые приближают вас к целям.
          </p>
        </div>

        <div className="why-card soft-shadow">
          <div className="tape tape-top-center"></div>
          <div className="why-icon">{featureIcons.habits}</div>
          <h3 className="why-card-title">Трекер привычек</h3>
          <p className="why-card-text">
            Формируйте полезные привычки и отслеживайте их ежедневно.
          </p>
        </div>

        <div className="why-card soft-shadow">
          <div className="tape tape-top-center"></div>
          <div className="why-icon">{featureIcons.visual}</div>
          <h3 className="why-card-title">Визуальный прогресс</h3>
          <p className="why-card-text">
            Наглядные графики и статистика помогут видеть ваш рост.
          </p>
        </div>
      </div>

    </section>
  );
}

export default Home;