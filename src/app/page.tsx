'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt?: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState('all');

  // 获取待办列表
  const fetchTodos = async () => {
    try {
      const res = await fetch('/api/todos');
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    } finally {
      setLoading(false);
    }
  };

  // 页面加载时获取数据
  useEffect(() => {
    fetchTodos();
  }, []);

  // 添加待办
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed === '') return;

    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      });
      if (res.ok) {
        setInput('');
        setDesc('');
        fetchTodos(); // 刷新列表
      }
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  // 删除待办
  const deleteTodo = async (id: number) => {
    try {
      const res = await fetch('/api/todos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchTodos(); // 刷新列表
      }
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  // 切换完成状态（本地状态，API暂不支持PATCH）
  const toggleTodo = async (id: number) => {
    // 当前API不支持PATCH，这里先更新本地状态
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  // 筛选后的待办
  const filteredTodos = todos.filter(task => {
    if (currentFilter === 'pending') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  // 统计数据
  const totalCount = todos.length;
  const completedCount = todos.filter(t => t.completed).length;
  const pendingCount = totalCount - completedCount;

  return (
    <div className="todo-wrapper">
      <header className="header">
        <div className="header-content">
          <div className="logo">Task<span>&bull;</span></div>
          <div className="stats">
            <div className="stat-item">
              <div className="stat-number">{totalCount}</div>
              <div className="stat-label">全部任务</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{completedCount}</div>
              <div className="stat-label">已完成</div>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <aside className="sidebar">
          <div className="sidebar-section">
            <h2 className="sidebar-title">添加任务</h2>
            <form className="add-form" onSubmit={addTodo}>
              <div className="form-group">
                <label className="form-label">任务标题</label>
                <input
                  type="text"
                  className="form-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="输入任务标题..."
                  required
                />
              </div>
              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={input.trim() === ''}
                >
                  添加任务
                </button>
              </div>
            </form>
          </div>

          <div className="sidebar-section">
            <h2 className="sidebar-title">筛选</h2>
            <div className="filter-group">
              <button
                className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
                onClick={() => setCurrentFilter('all')}
              >
                <span>全部</span>
                <span className="filter-count">{totalCount}</span>
              </button>
              <button
                className={`filter-btn ${currentFilter === 'pending' ? 'active' : ''}`}
                onClick={() => setCurrentFilter('pending')}
              >
                <span>待完成</span>
                <span className="filter-count">{pendingCount}</span>
              </button>
              <button
                className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
                onClick={() => setCurrentFilter('completed')}
              >
                <span>已完成</span>
                <span className="filter-count">{completedCount}</span>
              </button>
            </div>
          </div>
        </aside>

        <section className="task-container">
          {loading ? (
            <div className="loading-state">加载中...</div>
          ) : filteredTodos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <h3 className="empty-title">暂无任务</h3>
              <p className="empty-desc">添加第一个任务开始你的待办清单</p>
            </div>
          ) : (
            <div className="task-list">
              {filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`task-item ${todo.completed ? 'completed' : ''}`}
                  data-id={todo.id}
                >
                  <div className="task-header">
                    <div
                      className={`task-checkbox ${todo.completed ? 'checked' : ''}`}
                      onClick={() => toggleTodo(todo.id)}
                    />
                    <div className="task-content">
                      <h3 className="task-title">{todo.text}</h3>
                    </div>
                  </div>
                  <div className="task-meta">
                    <span className="task-meta-item">
                      {todo.createdAt || new Date().toLocaleDateString('zh-CN')}
                    </span>
                    <div className="task-actions">
                      <button
                        className="task-btn delete"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
