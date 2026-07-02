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
    const [filter, setFilter] = useState('all');
    const [tasks, setTasks] = useState([]);
    const [goals, setGoals] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showNewTaskModal, setShowNewTaskModal] = useState(false);
    const [showNewGoalModal, setShowNewGoalModal] = useState(false);

    const [taskError, setTaskError] = useState('');
    const [goalError, setGoalError] = useState('');

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

    useEffect(() => {
        loadData();
    }, [filter]);

    const loadData = async () => {
        try {
            setLoading(true);

            let apiFilter = 'all';
            if (filter === 'active') apiFilter = 'active';
            else if (filter === 'completed') apiFilter = 'completed';

            const [tasksData, goalsData] = await Promise.all([
                getTasks({ filter: apiFilter }),
                getGoals()
            ]);

            // Статистику загружаем отдельно
            let statsData = { total: 0, completed: 0, productivity: 0 };
            try {
                statsData = await getTaskStats();
            } catch (statsError) {
                console.warn('⚠️ Статистика недоступна, вычисляем локально');
                const completed = tasksData.filter(t => t.is_completed).length;
                statsData = {
                    total: tasksData.length,
                    completed: completed,
                    productivity: tasksData.length > 0 ? Math.round((completed / tasksData.length) * 100) : 0
                };
            }

            setTasks(tasksData || []);
            setGoals(goalsData || []);
            setStats(statsData);
        } catch (error) {
            console.error('❌ Ошибка загрузки:', error);
            setTasks([]);
            setGoals([]);
            setStats({ total: 0, completed: 0, productivity: 0 });
        } finally {
            setLoading(false);
        }
    };

    const handleSidebarClick = (clickedFilter) => {
        setFilter(clickedFilter);
    };

    // ✅ Переключение задачи — только статус (выполнено/не выполнено)
    const handleToggleTask = async (id) => {
        try {
            const updatedTask = await toggleTask(id);
            setTasks(tasks.map(t => t.id === id ? updatedTask : t));
            loadData();
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setTaskError('');

        if (!newTask.title.trim()) {
            setTaskError('Введите название задачи');
            return;
        }

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
            console.error('❌ Ошибка создания задачи:', error);
            setTaskError(error.message || 'Не удалось создать задачу');
        }
    };

    const handleCreateGoal = async (e) => {
        e.preventDefault();
        setGoalError('');

        if (!newGoal.title.trim()) {
            setGoalError('Введите название цели');
            return;
        }

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
            console.error('Ошибка создания цели:', error);
            setGoalError(error.message || 'Не удалось создать цель');
        }
    };

    const handleDeleteGoal = async (id) => {
        if (!confirm('Удалить цель?')) return;
        try {
            await deleteGoal(id);
            setGoals(goals.filter(g => g.id !== id));
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    // ✅ Изменение прогресса цели
    const handleChangeGoalProgress = async (goalId, delta) => {
        const goal = goals.find(g => g.id === goalId);
        if (!goal) return;

        let newValue = goal.current_value + delta;
        if (newValue < 0) newValue = 0;
        if (goal.target_value && newValue > goal.target_value) newValue = goal.target_value;

        try {
            const updatedGoal = await updateGoalProgress(goalId, newValue);
            setGoals(goals.map(g => g.id === goalId ? updatedGoal : g));
        } catch (error) {
            console.error('Ошибка обновления прогресса:', error);
        }
    };

    const getFilteredTasks = () => {
        if (filter === 'today') {
            const today = new Date().toISOString().split('T')[0];
            return tasks.filter(t => t.due_date === today);
        }
        if (filter === 'week') {
            const today = new Date();
            const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            return tasks.filter(t => {
                if (!t.due_date) return false;
                const dueDate = new Date(t.due_date);
                return dueDate >= today && dueDate <= weekFromNow;
            });
        }
        if (filter === 'goals') {
            return [];
        }
        return tasks;
    };

    const displayTasks = getFilteredTasks();
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
                            {tasks.filter(t => t.due_date === new Date().toISOString().split('T')[0]).length}
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
                    <h1 className="dash-title">
                        {filter === 'all' && 'Мои задачи'}
                        {filter === 'today' && 'Задачи на сегодня'}
                        {filter === 'week' && 'Задачи на неделю'}
                        {filter === 'goals' && 'Мои цели'}
                        {filter === 'active' && 'Активные задачи'}
                        {filter === 'completed' && 'Завершённые задачи'}
                    </h1>
                    <button
                        className="paper-btn primary-btn new-task-btn"
                        onClick={() => { setShowNewTaskModal(true); setTaskError(''); }}
                    >
                        + Новая задача
                    </button>
                </div>

                <div className="dash-filters">
                    <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Все</button>
                    <button className={`filter-btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Активные</button>
                    <button className={`filter-btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Завершённые</button>
                </div>

                {/* Если выбран фильтр "Цели" — показываем цели в центре */}
                {filter === 'goals' ? (
                    <div className="goals-center-view">
                        {goals.length === 0 ? (
                            <div className="empty-tasks">
                                <p>🎯 Нет целей</p>
                                <p>Создайте первую цель!</p>
                            </div>
                        ) : (
                            goals.map(goal => (
                                <div key={goal.id} className="goal-card-center">
                                    <span className="goal-icon-large">{goal.icon}</span>
                                    <div className="goal-info">
                                        <h3>{goal.title}</h3>
                                        <div className="goal-bar-large">
                                            <div className="goal-fill" style={{ width: `${goal.progress}%` }}></div>
                                        </div>
                                        {goal.target_value > 0 && (
                                            <div className="goal-progress-text">
                                                {goal.current_value} / {goal.target_value}
                                            </div>
                                        )}
                                    </div>

                                    {/* ✅ Кнопки +/- для изменения прогресса */}
                                    <div className="goal-progress-controls">
                                        <button
                                            className="progress-btn minus"
                                            onClick={() => handleChangeGoalProgress(goal.id, -1)}
                                            title="Уменьшить"
                                        >
                                            −
                                        </button>
                                        <span className="progress-value">{goal.progress}%</span>
                                        <button
                                            className="progress-btn plus"
                                            onClick={() => handleChangeGoalProgress(goal.id, 1)}
                                            title="Увеличить"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button className="delete-goal-btn" onClick={() => handleDeleteGoal(goal.id)}>✕</button>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="tasks-list">
                        {displayTasks.length === 0 ? (
                            filter === 'completed' ? (
                                <div className="empty-completed">
                                    <p>🎉 Нет завершённых задач</p>
                                    <p>Выполняйте задачи, чтобы видеть их здесь!</p>
                                </div>
                            ) : (
                                <div className="empty-tasks">
                                    <p>📭 Нет задач</p>
                                    <p>Создайте первую задачу!</p>
                                </div>
                            )
                        ) : (
                            <>
                                {/* Если есть завершённые задачи и мы не в фильтре "Завершённые" */}
                                {filter !== 'completed' && displayTasks.some(t => t.is_completed) && (
                                    <div className="completed-section-header">
                                        Завершённые задачи ({displayTasks.filter(t => t.is_completed).length})
                                    </div>
                                )}

                                {displayTasks.map(task => (
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

                                        {task.is_completed ? (
                                            <span className="task-completed-badge" title="Выполнено">✓</span>
                                        ) : (
                                            <span className="task-pending-badge" title="В процессе">○</span>
                                        )}

                                        <button className="delete-task-btn" onClick={() => deleteTask(task.id).then(loadData)}>✕</button>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </main>

            {/* Right panel */}
            <aside className="dash-right">
                <div className="panel">
                    <div className="panel-header">
                        <h3>Мои цели</h3>
                        <button className="panel-add" onClick={() => { setShowNewGoalModal(true); setGoalError(''); }}>+</button>
                    </div>
                    <div className="goals-list">
                        {goals.length === 0 ? (
                            <p className="empty-goals">Нет целей</p>
                        ) : (
                            goals.slice(0, 5).map(goal => (
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
                            ))
                        )}
                    </div>
                </div>

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

            {/* Модалка задачи */}
            {showNewTaskModal && (
                <div className="modal-overlay" onClick={() => setShowNewTaskModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Новая задача</h2>
                        {taskError && <div className="modal-error">⚠️ {taskError}</div>}
                        <form onSubmit={handleCreateTask}>
                            <div className="form-group">
                                <label>Название *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Введите название задачи"
                                    value={newTask.title}
                                    onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Описание</label>
                                <textarea
                                    placeholder="Описание (необязательно)"
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
                                <label>Срок выполнения <span className="optional-hint">(необязательно)</span></label>
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

            {/* Модалка цели */}
            {showNewGoalModal && (
                <div className="modal-overlay" onClick={() => setShowNewGoalModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Новая цель</h2>
                        {goalError && <div className="modal-error">⚠️ {goalError}</div>}
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
                                    <option value="🎯">🎯 Цель</option>
                                    <option value="📚">📚 Книги</option>
                                    <option value="💪">💪 Спорт</option>
                                    <option value="💧">💧 Вода</option>
                                    <option value="🏃">🏃 Бег</option>
                                    <option value="📝">📝 Учёба</option>
                                    <option value="🌟">🌟 Другое</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Целевое значение <span className="optional-hint">(необязательно)</span></label>
                                <input
                                    type="number"
                                    placeholder="Например: 10"
                                    value={newGoal.target_value}
                                    onChange={e => setNewGoal({ ...newGoal, target_value: e.target.value })}
                                    min="0"
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