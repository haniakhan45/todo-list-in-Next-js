"use client";

import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTaskText, setEditedTaskText] = useState<string>("");
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks) as Task[]);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isMounted]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startEditingTask = (id: number, text: string) => {
    setEditingTaskId(id);
    setEditedTaskText(text);
  };

  const updateTask = () => {
    if (editedTaskText.trim()) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId ? { ...task, text: editedTaskText } : task
        )
      );
      setEditingTaskId(null);
      setEditedTaskText("");
    }
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-8">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800 dark:text-gray-100">
        Todo List
        </h1>
        <div className="flex mb-6">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
            className="flex-1 px-4 py-3 rounded-l-full text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 border-none focus:outline-none focus:ring-4 focus:ring-indigo-400"
          />
          <button
            onClick={addTask}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-r-full shadow-lg transform transition duration-300 hover:scale-105"
          >
            Add
          </button>
        </div>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)}
                  className="h-6 w-6 text-indigo-600 focus:ring-indigo-500 rounded-full"
                />
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    value={editedTaskText}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedTaskText(e.target.value)}
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && updateTask()}
                    className="ml-4 flex-1 px-2 py-1 text-gray-900 dark:text-gray-100 bg-transparent focus:ring-0 border-b border-gray-300 dark:border-gray-500"
                  />
                ) : (
                  <span
                    className={`ml-4 text-lg ${
                      task.completed ? "line-through text-gray-500 dark:text-gray-400" : "text-gray-800 dark:text-gray-100"
                    }`}
                  >
                    {task.text}
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                {editingTaskId === task.id ? (
                  <button
                    onClick={updateTask}
                    className="text-sm bg-green-600 text-white px-4 py-1 rounded-full hover:bg-green-700 transform transition duration-300"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startEditingTask(task.id, task.text)}
                    className="text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-sm bg-red-600 text-white px-4 py-1 rounded-full hover:bg-red-700 transform transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
