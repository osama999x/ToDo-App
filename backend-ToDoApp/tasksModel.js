/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
const mongoose = require("mongoose");

const ToDoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const ToDoModel = mongoose.model("ToDo", ToDoSchema);

module.exports = ToDoModel;
