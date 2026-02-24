'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

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
  const addTodo = async () => {
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

  // 处理回车键
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-8 text-center">
          待办清单
        </h1>

        {/* 输入区域 */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入新任务..."
            className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTodo}
            disabled={input.trim() === ''}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors"
          >
            添加
          </button>
        </div>

        {/* 加载状态 */}
        {loading && (
          <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
            加载中...
          </div>
        )}

        {/* 待办列表 */}
        {!loading && (
          <div className="space-y-2">
            {todos.length === 0 ? (
              <div className="text-center py-8 text-zinc-400 dark:text-zinc-500">
                暂无任务，添加一个吧！
              </div>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700"
                >
                  <span className="text-zinc-800 dark:text-zinc-100">
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                  >
                    删除
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* 统计 */}
        {!loading && todos.length > 0 && (
          <div className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 text-center">
            共 {todos.length} 项任务
          </div>
        )}
      </div>
    </div>
  );
}
