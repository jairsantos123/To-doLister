import React, { useState, useEffect } from 'react';
import './App.css'

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [isDark, setIsDark] = useState(false);
  const [error, setError] = useState('');

  // Carregar dados do localStorage e tema
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
    }
  }, []);

  // Salvar todos no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Alternar tema
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Adicionar nova tarefa
  const addTodo = (e) => {
    e.preventDefault();
    const text = inputValue.trim();

    if (!text) return;

    if (text.length > 200) {
      setError('O texto da tarefa deve ter, no máximo, 200 caracteres!');
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTodos(prev => [...prev, newTodo]);
    setInputValue('');
    setError('');
  };

  // Alternar status da tarefa
  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id
        ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
        : todo
    ));
  };

  // Editar tarefa
  const editTodo = (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    const newText = prompt('Editar tarefa:', todo.text);
    if (!newText || newText.trim() === todo.text) return;

    if (newText.trim().length > 200) {
      setError('O texto da tarefa deve ter, no máximo, 200 caracteres!');
      return;
    }

    setTodos(prev => prev.map(t =>
      t.id === id
        ? { ...t, text: newText.trim(), updatedAt: new Date().toISOString() }
        : t
    ));
    setError('');
  };

  // Deletar tarefa
  const deleteTodo = (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  // Filtrar tarefas
  const getFilteredTodos = () => {
    switch (currentFilter) {
      case 'completed':
        return todos.filter(t => t.completed);
      case 'pending':
        return todos.filter(t => !t.completed);
      default:
        return todos;
    }
  };

  // Estatísticas
  const getStats = () => {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;

    if (total === 0) return 'Nenhuma tarefa';

    let statsText = `${total} ${total === 1 ? 'tarefa' : 'tarefas'}`;
    if (completed > 0) {
      statsText += ` • ${completed} ${completed === 1 ? 'concluída' : 'concluídas'}`;
    }
    if (pending > 0) {
      statsText += ` • ${pending} ${pending === 1 ? 'pendente' : 'pendentes'}`;
    }
    return statsText;
  };

  const filteredTodos = getFilteredTodos();

  return (
    <div className={`app ${isDark ? 'dark' : ''}`}>
      <button className="theme-toggle" onClick={toggleTheme} title="Alternar tema">
        <span>{isDark ? '☀️' : '🌙'}</span>
      </button>

      <div className="container">
        <div className="header">
          <h1>Lista de Tarefas</h1>
          <p>Organize suas tarefas de forma simples e eficiente</p>
        </div>

        {error && (
          <div className="error-container">
            <div className="alert alert-destructive">{error}</div>
          </div>
        )}

        <form className="input-section" onSubmit={addTodo}>
          <div className="input-container">
            <input
              type="text"
              className="input"
              placeholder="Adicionar nova tarefa..."
              maxLength="200"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Adicionar
            </button>
          </div>
        </form>

        <div className="filters">
          <button
            className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('all')}
          >
            Todas
          </button>
          <button
            className={`filter-btn ${currentFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('pending')}
          >
            Pendentes
          </button>
          <button
            className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setCurrentFilter('completed')}
          >
            Concluídas
          </button>
        </div>

        <div className="stats">
          <span>{getStats()}</span>
        </div>

        <ul className="todo-list">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <div>
                {currentFilter === 'all'
                  ? 'Você ainda não tem tarefas. Adicione uma nova para começar!'
                  : `Nenhuma tarefa ${currentFilter === 'completed' ? 'concluída' : 'pendente'} encontrada.`
                }
              </div>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  className="todo-checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className="todo-text">{todo.text}</span>
                <div className="todo-actions">
                  <button
                    className="btn btn-ghost"
                    onClick={() => editTodo(todo.id)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-destructive"
                    onClick={() => deleteTodo(todo.id)}
                    title="Excluir"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default TodoApp;