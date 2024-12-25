import './index.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import TaskForm from '../TaskForm';
const TaskTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');


  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleAddTask = () => {
    setTaskToEdit(null); // Clear any task for editing
    setModalOpen(true); // Open the modal to add a new task
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task); // Set the task to be edited
    setModalOpen(true); // Open the modal for editing
  };

  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (confirmDelete) {
      try {
        await axios.delete(`/tasks/${taskId}`);
        fetchTasks(); // Reload tasks after deletion
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };

  const handleStatusFilter = (e) => {
    setFilterStatus(e.target.value);
  };

  const filteredTasks = filterStatus === 'All' ? tasks : tasks.filter(task => task.status === filterStatus);
  return (
    <div className="app bg-gray-100 min-h-screen flex flex-col items-center p-5 transition-all duration-300">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Task Tracker</h1>

      {/* Filter tasks by status */}
      <select
        onChange={handleStatusFilter}
        className="mb-5 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      >
        <option value="All">All</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      {/* Button to add a new task */}
      <button
        onClick={handleAddTask}
        className="mb-5 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
      >
        Add Task
      </button>

      {/* Task List */}
      <div className="task-list w-full space-y-5">
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className={`task-item p-5 bg-white rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 ${task.status.toLowerCase()}`}
          >
            <h3 className="text-xl font-semibold">{task.name}</h3>
            <p className="text-gray-600">{task.description}</p>
            <p className="text-gray-500">Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p className="text-gray-500">Status: {task.status}</p>
            <p className="text-gray-500">Priority: {task.priority}</p>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => handleEditTask(task)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteTask(task._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Task Form Modal */}
      {modalOpen && (
        <TaskForm
          task={taskToEdit}
          onClose={() => setModalOpen(false)}
          onSave={fetchTasks}
        />
      )}
    </div>
  )
}
export default TaskTracker