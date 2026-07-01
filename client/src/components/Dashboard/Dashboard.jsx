import { useState, useEffect } from 'react';
import {
    getTasks,
    createTask,
    toggleTask,
    deleteTask,
    getTaskStats,
    getGoals,
    createGoal,
    updateGoalProgress
} from "../../api";
import './Dashboard.css';

function Dashboard({ user }) {
    const [filter, setFilter] = useState('all');
    const [tasks, setTasks] = useState([]);
    const [goals, setGoals] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showNewTaskModal, setShowNewTaskModal] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        category: 'Общее',
        priority: 'средний',
        due_date: ''
    });

    // Загрузка данных
    useEffect(() => {
        loadData();
    }, [filter]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [tasksData, goalsData, statsData] = await Promise.all([
                getTasks({ filter }),
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

    // Переключение задачи
    const handleToggleTask = async (id) => {
        try {
            const updatedTask = await toggleTask(id);
            setTasks(tasks.map(t => t.id === id ? updatedTask : t));
            loadData(); // Перезагрузить статистику
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось обновить задачу');
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

    // Удаление задачи
    const handleDeleteTask = async (id) => {
        if (!confirm('Удалить задачу?')) return;
        try {
            await deleteTask(id);
            setTasks(tasks.filter(t => t.id !== id));
            loadData();
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось удалить задачу');
        }
    };

    // Обновление прогресса цели
    const handleUpdateGoalProgress = async (goalId, currentValue) => {
        try {
            const updatedGoal = await updateGoalProgress(goalId, currentValue);
            setGoals(goals.map(g => g.id === goalId ? updatedGoal : g));
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось обновить прогресс');
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
                    <div className={`sidebar-item ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                        <span>Все задачи</span>
                        <span className="sidebar-badge">{stats?.total || tasks.length}</span>
                    </div>
                    <div className={`sidebar-item ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>
                        <span>📅 Сегодня</span>
                        <span className="sidebar-badge">{stats?.active || tasks.filter(t => !t.is_completed).length}</span>
                    </div>
                    <div className="sidebar-item">
                        <span>📆 Неделя</span>
                        <span className="sidebar-badge">8</span>
                    </div>
                    <div className="sidebar-item">
                        <span>🎯 Цели</span>
                    </div>
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
                                    onClick={() => handleDeleteTask(task.id)}
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
                        <button className="panel-add" onClick={() => alert('Функция создания цели')}>+</button>
                    </div>
                    <div className="goals-list">
                        {goals.map(goal => (
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
        </div>
    );
}

export default Dashboard;