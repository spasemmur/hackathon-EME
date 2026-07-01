import { useState } from 'react';
import './Dashboard.css';

const MOCK_TASKS = [
    { id: 1, title: 'Читать 20 страниц книги', category: 'Личное', date: 'Сегодня', progress: 60, done: false },
    { id: 2, title: 'Тренировка в зале', category: 'Здоровье', date: 'Сегодня', progress: 100, done: true },
    { id: 3, title: 'Изучить новый инструмент', category: 'Развитие', date: 'Завтра', progress: 30, done: false },
    { id: 4, title: 'Работать над проектом', category: 'Работа', date: '14 мая', progress: 0, done: false },
    { id: 5, title: 'Медитация 10 минут', category: 'Привычка', date: 'Сегодня', progress: 100, done: true },
];

const MOCK_GOALS = [
    { id: 1, title: 'Прочитать 5 книг', progress: 60, icon: '📚' },
    { id: 2, title: 'Тренироваться 3 раза в неделю', progress: 75, icon: '️' },
    { id: 3, title: 'Пить больше воды', progress: 40, icon: '💧' },
];

const WEEK_STATS = [
    { day: 'Пн', value: 40 },
    { day: 'Вт', value: 65 },
    { day: 'Ср', value: 50 },
    { day: 'Чт', value: 80 },
    { day: 'Пт', value: 45 },
    { day: 'Сб', value: 30 },
    { day: 'Вс', value: 70 },
];

function Dashboard({ user }) {
    const [filter, setFilter] = useState('all');
    const [tasks, setTasks] = useState(MOCK_TASKS);

    const toggleTask = (id) => {
        setTasks(tasks.map(t =>
            t.id === id ? { ...t, done: !t.done, progress: !t.done ? 100 : 0 } : t
        ));
    };

    const filteredTasks = filter === 'all'
        ? tasks
        : filter === 'active'
            ? tasks.filter(t => !t.done)
            : tasks.filter(t => t.done);

    const completedCount = tasks.filter(t => t.done).length;
    const productivity = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="dash-sidebar">
                <div className="sidebar-nav">
                    <div className="sidebar-item active">
                        <span className="sidebar-icon"></span>
                        <span>Все задачи</span>
                        <span className="sidebar-badge">{tasks.length}</span>
                    </div>
                    <div className="sidebar-item">
                        <span className="sidebar-icon">📅</span>
                        <span>Сегодня</span>
                        <span className="sidebar-badge">5</span>
                    </div>
                    <div className="sidebar-item">
                        <span className="sidebar-icon">📆</span>
                        <span>Неделя</span>
                        <span className="sidebar-badge">8</span>
                    </div>
                    <div className="sidebar-item">
                        <span className="sidebar-icon">🗓️</span>
                        <span>Месяц</span>
                        <span className="sidebar-badge">12</span>
                    </div>
                    <div className="sidebar-item">
                        <span className="sidebar-icon">🎯</span>
                        <span>Цели</span>
                    </div>
                    <div className="sidebar-item">
                        <span className="sidebar-icon">️</span>
                        <span>Архив</span>
                    </div>
                </div>

                <div className="sidebar-note">
                    <div className="note-tape"></div>
                    <p className="note-text">
                        <span className="note-star">★</span>
                        Маленькие шаги приводят к большим результатам
                    </p>
                    <span className="note-heart">♡</span>
                </div>
            </aside>

            {/* Main content */}
            <main className="dash-main">
                <div className="dash-header">
                    <h1 className="dash-title">Мои задачи</h1>
                    <button className="paper-btn primary-btn new-task-btn">
                        + Новая задача
                    </button>
                </div>

                <div className="dash-filters">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        Все
                    </button>
                    <button
                        className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                        onClick={() => setFilter('active')}
                    >
                        Активные
                    </button>
                    <button
                        className={`filter-btn ${filter === 'done' ? 'active' : ''}`}
                        onClick={() => setFilter('done')}
                    >
                        Завершенные
                    </button>
                    <select className="filter-select">
                        <option>Приоритет</option>
                        <option>Высокий</option>
                        <option>Средний</option>
                        <option>Низкий</option>
                    </select>
                </div>

                <div className="tasks-list">
                    {filteredTasks.map(task => (
                        <div key={task.id} className={`task-card ${task.done ? 'done' : ''}`}>
                            <input
                                type="checkbox"
                                checked={task.done}
                                onChange={() => toggleTask(task.id)}
                                className="task-checkbox"
                            />
                            <div className="task-content">
                                <div className={`task-title ${task.done ? 'strikethrough' : ''}`}>
                                    {task.title}
                                </div>
                                <span className={`task-category cat-${task.category.toLowerCase()}`}>
                                    {task.category}
                                </span>
                            </div>
                            <div className="task-meta">
                                <span className="task-date">📅 {task.date}</span>
                            </div>
                            <div className="task-progress">
                                <div className="progress-circle" style={{
                                    background: `conic-gradient(#7a8b5c ${task.progress}%, #e8e0d0 ${task.progress}%)`
                                }}>
                                    <div className="progress-inner">{task.progress}%</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="show-completed-btn">
                    Показать завершенные ({completedCount})
                </button>
            </main>

            {/* Right panel */}
            <aside className="dash-right">
                <div className="panel goals-panel">
                    <div className="panel-header">
                        <h3>Мои цели</h3>
                        <button className="panel-add">+</button>
                    </div>
                    <div className="goals-list">
                        {MOCK_GOALS.map(goal => (
                            <div key={goal.id} className="goal-item">
                                <span className="goal-icon">{goal.icon}</span>
                                <div className="goal-content">
                                    <div className="goal-title">{goal.title}</div>
                                    <div className="goal-bar">
                                        <div className="goal-fill" style={{ width: `${goal.progress}%` }}></div>
                                    </div>
                                </div>
                                <span className="goal-percent">{goal.progress}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="panel stats-panel">
                    <h3>Статистика</h3>
                    <div className="stats-grid">
                        <div className="stat-box">
                            <div className="stat-value">{tasks.length}</div>
                            <div className="stat-label">Задач всего</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-value">{completedCount}</div>
                            <div className="stat-label">Завершено</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-value">{productivity}%</div>
                            <div className="stat-label">Продуктивность</div>
                        </div>
                    </div>
                    <div className="week-chart">
                        {WEEK_STATS.map(day => (
                            <div key={day.day} className="chart-bar-wrap">
                                <div
                                    className="chart-bar"
                                    style={{ height: `${day.value}%` }}
                                ></div>
                                <div className="chart-label">{day.day}</div>
                            </div>
                        ))}
                    </div>
                    <button className="to-progress-btn">
                        К прогрессу →
                    </button>
                </div>
            </aside>
        </div>
    );
}

export default Dashboard;