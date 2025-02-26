/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const ToDoApp = () => {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/tasks");
            const data = await response.json();
            setTasks(data);
        } catch (err) {
            toast.error("Error fetching tasks");
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle("dark");
    };

    const addTask = async () => {
        if (task.trim() === "") {
            toast.error("Task cannot be empty!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: darkMode ? "dark" : "light",
            });
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: task }),
            });
            const newTask = await response.json();
            setTasks([...tasks, newTask]);
            setTask("");

            toast.success("Task added successfully!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: darkMode ? "dark" : "light",
            });
        } catch (err) {
            toast.error("Error adding task");
        }
    };

    const toggleComplete = async (id) => {
        try {
            const taskToUpdate = tasks.find((t) => t._id === id);
            const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completed: !taskToUpdate.completed }),
            });
            const updatedTask = await response.json();
            setTasks(tasks.map((t) => (t._id === id ? updatedTask : t)));
        } catch (err) {
            toast.error("Error updating task");
        }
    };

    const deleteTask = async (id) => {
        try {
            await fetch(`http://localhost:3000/api/tasks/${id}`, {
                method: "DELETE",
            });
            setTasks(tasks.filter((t) => t._id !== id));

            toast.success("Task deleted successfully!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: darkMode ? "dark" : "light",
            });
        } catch (err) {
            toast.error("Error deleting task");
        }
    };

    const startEditing = (id, text) => {
        setEditingId(id);
        setTask(text);
    };

    const saveTask = async () => {
        if (task.trim() === "") {
            toast.error("Task cannot be empty!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: task }),
            });
            const updatedTask = await response.json();
            setTasks(tasks.map((t) => (t._id === editingId ? updatedTask : t)));
            setTask("");
            setEditingId(null);

            toast.success("Task updated successfully!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: darkMode ? "dark" : "light",
            });
        } catch (err) {
            toast.error("Error updating task");
        }
    };

    return (
        <div
            className={`w-screen h-screen ${darkMode
                ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
                : "bg-gradient-to-br from-blue-200 via-blue-100 to-blue-50"
                } flex items-center justify-center p-10`}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={`w-full h-full max-w-6x2 ${darkMode ? "bg-gray-800" : "bg-white"
                    } shadow-2xl rounded-3xl p-10 overflow-y-auto`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2
                        className={`text-4xl font-bold text-center tracking-wide relative whitespace-nowrap overflow-hidden w-max
        ${darkMode ? "text-white" : "text-gray-800"} typing-animation`}
                    >
                        📝 <span className="inline-block">To Do App...</span>
                    </h2>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleDarkMode}
                        className={`px-6 py-2 rounded-full shadow-md ${darkMode
                            ? "bg-gray-700 text-white hover:bg-gray-600"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            } transition-all duration-200`}
                    >
                        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                    </motion.button>
                </div>

                {/* Task Input */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        editingId ? saveTask() : addTask();
                    }}
                    className="flex gap-4 mb-6"
                >
                    <input
                        type="text"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        placeholder="Add a new task..."
                        className={`flex-1 px-4 py-2 text-lg border-2 ${darkMode
                            ? "border-gray-600 bg-gray-700 text-white"
                            : "border-gray-300 bg-white text-gray-800"
                            } rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all`}
                    />
                    {editingId ? (
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-purple-500 text-white border border-purple-600 hover:bg-purple-600 hover:border-purple-700 active:bg-purple-700 active:border-purple-800 rounded-xl transition-all duration-200 px-6 py-3 text-lg w-40 shadow-lg"
                        >
                            Save
                        </motion.button>
                    ) : (
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-500 text-white border border-blue-600 hover:bg-blue-600 hover:border-blue-700 active:bg-blue-700 active:border-blue-800 rounded-xl transition-all duration-200 px-6 py-3 text-lg w-40 shadow-lg"
                        >
                            Add
                        </motion.button>
                    )}
                </form>

                {/* Task List */}
                <ul className="grid grid-cols-2 gap-6">
                    {tasks.map((t, index) => (
                        <motion.li
                            key={t._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            className={`p-6 flex flex-col ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"
                                } shadow-lg rounded-2xl transform hover:scale-105 transition-all duration-300 ease-in-out`}
                        >
                            {/* <span className="text-lg font-semibold">TaskNo: {t._id}</span> */}
                            <span className="text-lg font-semibold"> {t.text}</span>
                            <span className="text-sm text-gray-400">
                                📅 {new Date(t.date).toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-400">
                                ✔️ {t.completed ? "Completed" : "Pending"}
                            </span>

                            <div className="flex gap-3 mt-4">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => toggleComplete(t._id)}
                                    className={`px-4 py-2 rounded-xl shadow-md text-white transition-all duration-200 ${t.completed
                                        ? "bg-yellow-500 hover:bg-yellow-600"
                                        : "bg-green-500 hover:bg-green-600"
                                        }`}
                                >
                                    {t.completed ? "Undo" : "Complete"}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => deleteTask(t._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 shadow-md transition-all duration-200"
                                >
                                    Delete
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => startEditing(t._id, t.text)}
                                    className="bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600 shadow-md transition-all duration-200"
                                >
                                    Edit
                                </motion.button>
                            </div>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
            <ToastContainer />
        </div>
    );
};

export default ToDoApp;
