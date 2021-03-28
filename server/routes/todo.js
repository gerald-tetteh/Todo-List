const express = require("express");

const todoControllers = require("../controllers/todo");

const router = express.Router();

router.get("/todo-list", todoControllers.getTodoList);

router.get("/todo/:id", todoControllers.getTodo);

router.post("/create-todo", todoControllers.postCreateTodo);

router.post("/delete-todo", todoControllers.postDeleteTodo);

router.post("/update-todo", todoControllers.postUpdateTodo);

module.exports = router;
