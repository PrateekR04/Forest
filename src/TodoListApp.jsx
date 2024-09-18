import React, { useState, useEffect, useRef } from 'react';

function TodoListApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const removeButtonRefs = useRef([]);
  const audioContext = useRef(null);

  const handleAddTodo = () => {
    if (newTodo.trim() === '') return; // Don't add empty todos

    setIsLoading(true);

    setTimeout(() => {
      setTodos((prevTodos) => [
        ...prevTodos,
        { text: newTodo, completed: false, deadline: newDeadline, triggerAlarm: false },
      ]);
      setNewTodo('');
      setNewDeadline('');
      setIsLoading(false);
    }, 1000);
  };

  const handleToggleCompleted = (index) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleRemoveTodo = (index) => {
    const removeButton = removeButtonRefs.current[index];
    if (removeButton) {
      removeButton.classList.add('vanishing-button');
      setTimeout(() => {
        setTodos((prevTodos) => prevTodos.filter((_, i) => i !== index));
      }, 500);
    }
  };

  // Function to play a beep sound
  const playBeepSound = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);

    oscillator.frequency.setValueAtTime(440, audioContext.current.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioContext.current.currentTime);

    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, 1000);
  };

  // Function to trigger the alarm
  const triggerAlarm = (index) => {
    alert(`Deadline reached for task: ${todos[index].text}`);

    // Create AudioContext inside the triggerAlarm function
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, 1000);

    setTodos((prevTodos) =>
      prevTodos.map((todo, i) =>
        i === index ? { ...todo, triggerAlarm: true } : todo
      )
    );
  };

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      todos.forEach((todo, index) => {
        const deadline = new Date(todo.deadline);
        if (now >= deadline && !todo.triggerAlarm) {
          triggerAlarm(index);
        }
      });
    };

    const intervalId = setInterval(checkAlarms, 60000);
    return () => clearInterval(intervalId);
  }, [todos]);

  return (
    <div>
      <h1>Forest 🍀</h1>

      <div className="add-todo-container"> {/* Add container div */}
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo"
        />
        <input
          type="datetime-local"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.target.value)}
        />
        <button onClick={handleAddTodo} disabled={isLoading}>
          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : (
            'Add Todo'
          )}
        </button>
      </div> {/* Close container div */}

      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleCompleted(index)}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text} - {new Date(todo.deadline).toLocaleString()}
            </span>
            <button
              ref={(el) => (removeButtonRefs.current[index] = el)}
              onClick={() => handleRemoveTodo(index)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoListApp;