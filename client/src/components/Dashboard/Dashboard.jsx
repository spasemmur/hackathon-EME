import { useState, useEffect } from 'react';
import {
    getTasks,
    createTask,
    toggleTask,
    deleteTask,
    getTaskStats,
    getGoals,
    createGoal,
    updateGoalProgress,
    deleteGoal
} from "../../api";
import './Dashboard.css';

function Dashboard({ user }) {
    const [filter, setFilter] = useState('all'); // all, today, week, goals
    const [tasks, setTasks] = useState([]);
    const [goals, setGoals] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showNewTaskModal, setShowNewTaskModal] = useState(false);
    const [showNewGoalModal, setShowNewGoalModal] = useState(false);

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        category: 'Общее',
        priority: 'средний',
        due_date: ''
    });

    const [newGoal, setNewGoal] = useState({
        title: '',
        icon: '🎯',
        target_value: ''
    });

    // Загрузка данных
    useEffect(() => {
        loadData();
    }, [filter]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [tasksData, goalsData, statsData] = await Promise.all([
                getTasks({ filter: filter === 'all' ? 'all' : filter === 'completed' ? 'completed' : 'active' }),
                getGoals(),
                getTaskStats()
            ]);

            setTasks(tasksData);
            setGoals(goalsData);
            setStats(statsData);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Обработчик клика по сайдбару
    const handleSidebarClick = (clickedFilter) => {
        setFilter(clickedFilter);
    };

    // Переключение задачи
    const handleToggleTask = async (id) => {
        try {
            const updatedTask = await toggleTask(id);
            setTasks(tasks.map(t => t.id === id ? updatedTask : t));
            loadData();
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    // Создание задачи
    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const createdTask = await createTask(newTask);
            setTasks([createdTask, ...tasks]);
            setShowNewTaskModal(false);
            setNewTask({
                title: '',
                description: '',
                category: 'Общее',
                priority: 'средний',
                due_date: ''
            });
            loadData();
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось создать задачу');
        }
    };

    // ✅ Создание цели
    const handleCreateGoal = async (e) => {
        e.preventDefault();
        try {
            const createdGoal = await createGoal({
                ...newGoal,
                target_value: parseInt(newGoal.target_value) || 0
            });
            setGoals([...goals, createdGoal]);
            setShowNewGoalModal(false);
            setNewGoal({
                title: '',
                icon: '🎯',
                target_value: ''
            });
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось создать цель');
        }
    };

    // Удаление цели
    const handleDeleteGoal = async (id) => {
        if (!confirm('Удалить цель?')) return;
        try {
            await deleteGoal(id);
            setGoals(goals.filter(g => g.id !== id));
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    // Обновление прогресса цели
    const handleUpdateGoalProgress = async (goalId, currentValue) => {
        try {
            const updatedGoal = await updateGoalProgress(goalId, currentValue);
            setGoals(goals.map(g => g.id === goalId ? updatedGoal : g));
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    const completedCount = stats?.completed || tasks.filter(t => t.is_completed).length;
    const productivity = stats?.productivity || (tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0);

    if (loading) {
        return <div className="loading">Загрузка...</div>;
    }

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className="dash-sidebar">
                <div className="sidebar-nav">
                    <div
                        className={`sidebar-item ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => handleSidebarClick('all')}
                    >
                        <span>📋 Все задачи</span>
                        <span className="sidebar-badge">{stats?.total || tasks.length}</span>
                    </div>
                    <div
                        className={`sidebar-item ${filter === 'today' ? 'active' : ''}`}
                        onClick={() => handleSidebarClick('today')}
                    >
                        <span>📅 Сегодня</span>
                        <span className="sidebar-badge">
                            {tasks.filter(t => {
                                const today = new Date().toISOString().split('T')[0];
                                return t.due_date === today;
                            }).length}
                        </span>
                    </div>
                    <div
                        className={`sidebar-item ${filter === 'week' ? 'active' : ''}`}
                        onClick={() => handleSidebarClick('week')}
                    >
                        <span>📆 Неделя</span>
                        <span className="sidebar-badge">
                            {tasks.filter(t => {
                                if (!t.due_date) return false;
                                const dueDate = new Date(t.due_date);
                                const today = new Date();
                                const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                                return dueDate >= today && dueDate <= weekFromNow;
                            }).length}
                        </span>
                    </div>
                    <div
                        className={`sidebar-item ${filter === 'goals' ? 'active' : ''}`}
                        onClick={() => handleSidebarClick('goals')}
                    >
                        <span>🎯 Цели</span>
                        <span className="sidebar-badge">{goals.length}</span>
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
                    <button
                        className="paper-btn primary-btn new-task-btn"
                        onClick={() => setShowNewTaskModal(true)}
                    >
                        + Новая задача
                    </button>
                </div>

                <div className="dash-filters">
                    <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Все</button>
                    <button className={`filter-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Активные</button>
                    <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Завершенные</button>
                </div>

                <div className="tasks-list">
                    {tasks.length === 0 ? (
                        <div className="empty-tasks">
                            <p>📭 Нет задач</p>
                            <p>Создайте первую задачу!</p>
                        </div>
                    ) : (
                        tasks.map(task => (
                            <div key={task.id} className={`task-card ${task.is_completed ? 'done' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={task.is_completed}
                                    onChange={() => handleToggleTask(task.id)}
                                    className="task-checkbox"
                                />
                                <div className="task-content">
                                    <div className={`task-title ${task.is_completed ? 'strikethrough' : ''}`}>
                                        {task.title}
                                    </div>
                                    <span className="task-category">{task.category}</span>
                                </div>
                                <span className="task-date">📅 {task.due_date || 'Без даты'}</span>
                                <div className="task-progress-circle" style={{
                                    background: `conic-gradient(#7a8b5c ${task.progress}%, #e8e0d0 ${task.progress}%)`
                                }}>
                                    <div className="progress-inner">{task.progress}%</div>
                                </div>
                                <button
                                    className="delete-task-btn"
                                    onClick={() => deleteTask(task.id).then(loadData)}
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Right panel */}
            <aside className="dash-right">
                {/* Goals */}
                <div className="panel">
                    <div className="panel-header">
                        <h3>Мои цели</h3>
                        <button className="panel-add" onClick={() => setShowNewGoalModal(true)}>+</button>
                    </div>
                    <div className="goals-list">
                        {goals.length === 0 ? (
                            <p className="empty-goals">Нет целей</p>
                        ) : (
                            goals.map(goal => (
                                <div key={goal.id} className="goal-item">
                                    <span className="goal-icon">{goal.icon}</span>
                                    <div className="goal-content">
                                        <div className="goal-title">{goal.title}</div>
                                        <div className="goal-bar">
                                            <div className="goal-fill" style={{ width: `${goal.progress}%` }}></div>
                                        </div>
                                    </div>
                                    <span className="goal-percent">{goal.progress}%</span>
                                    <button
                                        className="delete-goal-btn"
                                        onClick={() => handleDeleteGoal(goal.id)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="panel stats-panel">
                    <h3>Статистика</h3>
                    <div className="stats-grid">
                        <div className="stat-box">
                            <div className="stat-value">{stats?.total || tasks.length}</div>
                            <div className="stat-label">Задач всего</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-value">{stats?.completed || completedCount}</div>
                            <div className="stat-label">Завершено</div>
                        </div>
                        <div className="stat-box">
                            <div className="stat-value">{productivity}%</div>
                            <div className="stat-label">Продуктивность</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Modal for new task */}
            {showNewTaskModal && (
                <div className="modal-overlay" onClick={() => setShowNewTaskModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Новая задача</h2>
                        <form onSubmit={handleCreateTask}>
                            <div className="form-group">
                                <label>Название *</label>
                                <input
                                    type="text"
                                    required
                                    value={newTask.title}
                                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Описание</label>
                                <textarea
                                    value={newTask.description}
                                    onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Категория</label>
                                <select
                                    value={newTask.category}
                                    onChange={e => setNewTask({ ...newTask, category: e.target.value })}
                                >
                                    <option>Общее</option>
                                    <option>Личное</option>
                                    <option>Работа</option>
                                    <option>Здоровье</option>
                                    <option>Развитие</option>
                                    <option>Привычка</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Приоритет</label>
                                <select
                                    value={newTask.priority}
                                    onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                                >
                                    <option>низкий</option>
                                    <option>средний</option>
                                    <option>высокий</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Срок выполнения</label>
                                <input
                                    type="date"
                                    value={newTask.due_date}
                                    onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="paper-btn secondary-btn" onClick={() => setShowNewTaskModal(false)}>
                                    Отмена
                                </button>
                                <button type="submit" className="paper-btn primary-btn">
                                    Создать
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ✅ Modal for new goal */}
            {showNewGoalModal && (
                <div className="modal-overlay" onClick={() => setShowNewGoalModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Новая цель</h2>
                        <form onSubmit={handleCreateGoal}>
                            <div className="form-group">
                                <label>Название *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Например: Прочитать 10 книг"
                                    value={newGoal.title}
                                    onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Иконка</label>
                                <select
                                    value={newGoal.icon}
                                    onChange={e => setNewGoal({ ...newGoal, icon: e.target.value })}
                                >
                                    <option value="🎯"></option>
                                    <option value="📚">📚</option>
                                    <option value="💪">💪</option>
                                    <option value="💧">💧</option>
                                    <option value="🏃">🏃</option>
                                    <option value="📝">📝</option>
                                    <option value="🌟">🌟</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Целевое значение</label>
                                <input
                                    type="number"
                                    placeholder="Например: 10"
                                    value={newGoal.target_value}
                                    onChange={e => setNewGoal({ ...newGoal, target_value: e.target.value })}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="paper-btn secondary-btn" onClick={() => setShowNewGoalModal(false)}>
                                    Отмена
                                </button>
                                <button type="submit" className="paper-btn primary-btn">
                                    Создать
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;