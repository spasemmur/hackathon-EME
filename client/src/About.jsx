import './About.css';
import { Link } from 'react-router-dom';

function About() {
  const developers = [
    {
      name: "Егор-Сигма",
      role: "Backend-разработчик",
      description: "Разработка серверной части приложения, API и работа с базой данных.",
      icon: "⚙️",
      color: "#4CAF50"
    },
    {
      name: "Максон-Клаксон",
      role: "Frontend + Backend разработчик",
      description: "Full-stack разработка, интеграция клиентской и серверной частей.",
      icon: "🚀",
      color: "#2196F3"
    },
    {
      name: "Ева-Максим вернись ко мне",
      role: "Frontend-разработчик",
      description: "Разработка пользовательского интерфейса и визуальное оформление.",
      icon: "🎨",
      color: "#E91E63"
    }
  ];

  return (
    <div className="about-page">
      <div className="about-container">
        <Link to="/" className="back-link">← На главную</Link>
        
        <h1 className="about-title">О сайте и разработчиках</h1>
        
        <div className="about-description">
          <p>
            Проект - <strong>Трекер привычек</strong> - был разработан 
            командой студентов в рамках прохождения <strong>летней практики</strong>.
          </p>
          <p>
            Цель проекта - создание удобного веб-приложения, помогающего пользователям 
            отслеживать свои ежедневные привычки, формировать полезные ритуалы 
            и следить за личным прогрессом.
          </p>
        </div>

        <h2 className="team-title">Наш класс коррекции</h2>
        
        <div className="developers-grid">
          {developers.map((dev, index) => (
            <div key={index} className="developer-card" style={{ borderTopColor: dev.color }}>
              <div className="developer-icon" style={{ backgroundColor: dev.color }}>
                {dev.icon}
              </div>
              <h3 className="developer-name">{dev.name}</h3>
              <p className="developer-role">{dev.role}</p>
              <p className="developer-description">{dev.description}</p>
            </div>
          ))}
        </div>

        <div className="about-footer">
          <p>© 2026 Hackathon EME. Все права куплены.</p>
        </div>
      </div>
    </div>
  );
}

export default About;