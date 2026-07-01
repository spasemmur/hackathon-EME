import shesterenkaIcon from '../../assets/shesterenka.png';
import raketaIcon from '../../assets/raketa.png';
import palitraIcon from '../../assets/palitra.png';
import './About.css';

function About() {
  const developers = [
    {
      name: "Максим",
      role: "Backend-разработчик",
      description: "Разработка серверной части и API",
      icon: shesterenkaIcon,
      color: "#e8b86d"
    },
    {
      name: "Егор",
      role: "Full-stack разработчик",
      description: "Интеграция фронтенда и бэкенда",
      icon: raketaIcon,
      color: "#a8d5ba"
    },
    {
      name: "Ева",
      role: "Frontend-разработчик",
      description: "Дизайн и пользовательский интерфейс",
      icon: palitraIcon,
      color: "#f5c0bb"
    }
  ];

  return (
    <div className="paper-page about-page">
      <div className="paper-card about-card torn-edge">
        <div className="tape tape-top-center"></div>
        <div className="paper-crease"></div>

        <h2 className="paper-title">О сайте и разработчиках</h2>

        <div className="about-description">
          <p>
            Проект <strong>«Трекер привычек»</strong> разработан командой
            студентов в рамках <strong>летней практики 2026</strong>.
          </p>
          <p>
            Наша цель — помочь вам сформировать полезные привычки
            и отслеживать свой прогресс!
          </p>
        </div>

        <h3 className="section-title">Наша команда</h3>

        <div className="developers-grid">
          {developers.map((dev) => (
            <div
              key={dev.name}
              className="developer-card soft-shadow"
              style={{ backgroundColor: dev.color, position: 'relative' }}
            >
              <div
                className="stamp stamp-approved"
                style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.7rem' }}
              >
                TEAM
              </div>
              <div className="dev-icon">
                <img src={dev.icon} alt={dev.name} className="icon-image" />
              </div>
              <h4 className="dev-name">{dev.name}</h4>
              <p className="dev-role">{dev.role}</p>
              <p className="dev-desc">{dev.description}</p>
            </div>
          ))}
        </div>

        <div className="about-footer">
          <p>© 2026 Hackathon EME</p>
        </div>
      </div>
    </div>
  );
}

export default About;