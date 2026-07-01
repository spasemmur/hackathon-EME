import './Statistics.css';

function Statistics({ isLoggedIn }) {
  if (!isLoggedIn) {
    return (
      <div className="paper-page stats-page">
        <div className="paper-card torn-edge">
          <div className="tape tape-top-center"></div>
          <div className="paper-crease"></div>

          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h2 className="paper-title">Статистика</h2>
            <p className="paper-text">
              Пожалуйста, войдите в аккаунт, чтобы просматривать статистику
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="paper-page stats-page">
      <div className="paper-card torn-edge">
        <div className="tape tape-top-left"></div>
        <div className="tape tape-top-right"></div>
        <div className="paper-crease"></div>

        <h2 className="paper-title">Статистика</h2>

        <div className="stats-placeholder">
          <p className="paper-text">
            Здесь будет отображаться ваша статистика по привычкам
          </p>
          <div className="stats-grid">
            <div className="stat-card soft-shadow">
              <div className="stat-icon">📅</div>
              <div className="stat-value">0</div>
              <div className="stat-desc">Всего привычек</div>
            </div>
            <div className="stat-card soft-shadow">
              <div className="stat-icon">🔥</div>
              <div className="stat-value">0</div>
              <div className="stat-desc">Лучшая серия</div>
            </div>
            <div className="stat-card soft-shadow">
              <div className="stat-icon">✓</div>
              <div className="stat-value">0</div>
              <div className="stat-desc">Выполнено</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;