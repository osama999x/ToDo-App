/* eslint-disable no-undef */
const express = require("express");
const mongoose = require("mongoose");
const ToDoModel = require("./tasksModel");
const app = express();
const cors = require("cors");



app.use(cors());


app.use(express.json());

const MONGO_URI = "mongodb://127.0.0.1:27017/todoapp";

mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

app.post("/api/tasks", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Task text is required" });
        }

        const newTask = new ToDoModel({ text });
        await newTask.save();
        res.status(201).json(newTask);
        // eslint-disable-next-line no-unused-vars
    } catch (err) {
        res.status(500).json({ error: "Error creating task" });
    }
});

app.get("/api/tasks", async (req, res) => {
    try {
        const tasks = await ToDoModel.find();
        res.json(tasks);
        // eslint-disable-next-line no-unused-vars
    } catch (err) {
        res.status(500).json({ error: "Error fetching tasks" });
    }
});

app.put("/api/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { text, completed } = req.body;

        const updatedTask = await ToDoModel.findByIdAndUpdate(
            id,
            { text, completed },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json(updatedTask);
        // eslint-disable-next-line no-unused-vars
    } catch (err) {
        res.status(500).json({ error: "Error updating task" });
    }
});

app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await ToDoModel.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.json({ message: "Task deleted successfully" });
        // eslint-disable-next-line no-unused-vars
    } catch (err) {
        res.status(500).json({ error: "Error deleting task" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
