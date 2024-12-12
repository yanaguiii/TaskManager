import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { HTML5Backend } from 'react-dnd-html5-backend'
import update from 'immutability-helper';
import {DndProvider} from "react-dnd";
import TaskCard from './components/TaskCard';


function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tasks/');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/tasks/', {
        title,
        description,
        completed: false
      });
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleComplete = async (taskId, completed) => {
    try {
      await axios.patch(`http://localhost:8000/api/tasks/${taskId}/`, {
        completed: !completed
      });
      // Atualiza o estado local em vez de fazer fetch
      setTasks(tasks.map(task =>
          task.id === taskId
              ? { ...task, completed: !completed }
              : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };


  const startEditing = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/tasks/${editingTask.id}/`, {
        title,
        description,
        completed: editingTask.completed
      });
      setEditingTask(null);
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${taskId}/`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const moveTask = (dragIndex, hoverIndex) => {
    const draggedTask = tasks[dragIndex];
    setTasks(update(tasks, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, draggedTask]
      ]
    }));
  };

  return (
      <DndProvider backend={HTML5Backend}>
        <div className="container">
          <h1>Task Manager</h1>

          <form onSubmit={editingTask ? updateTask : addTask} className="task-form">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="input-field"
                required
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description"
                className="input-field"
            />
            <button type="submit" className="submit-btn">
              {editingTask ? 'Update Task' : 'Add Task'}
            </button>
            {editingTask && (
                <button
                    type="button"
                    onClick={() => {
                      setEditingTask(null);
                      setTitle('');
                      setDescription('');
                    }}
                    className="cancel-btn"
                >
                  Cancel
                </button>
            )}
          </form>

          <div className="task-list">
            {tasks.map((task, index) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    moveTask={moveTask}
                    startEditing={startEditing}
                    deleteTask={deleteTask}
                    toggleComplete={toggleComplete}
                />
            ))}
          </div>
        </div>
      </DndProvider>
  );
}

export default App;
