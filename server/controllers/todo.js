const assert = require("assert");

const TodoModel = require("../models/Todo");

exports.getTodoList = async (req, res, next) => {
  try {
    const todoList = await TodoModel.find({}).sort({ date: "desc" }).exec();
    res.json(todoList);
  } catch (e) {
    res.status(500).end();
  }
};

// exports.getTodo = async (req, res, next) => {
//   try {
//     const todo = await TodoModel.find({ _id: req.params.id });
//     res.json(todo);
//   } catch (e) {
//     res.status(500).json({ error: `${e.message}` });
//   }
// };

exports.postCreateTodo = async (req, res, next) => {
  const todo = new TodoModel({
    title: req.body.title,
  });
  try {
    await todo.save();
    res.status(201).end();
  } catch (e) {
    res.status(500).end();
  }
};

exports.postDeleteTodo = async (req, res, next) => {
  try {
    const id = req.body.id;
    const { deletedCount } = await TodoModel.deleteOne({ _id: id });
    assert(deletedCount === 1);
    res.status(200).end();
  } catch (e) {
    res.status(500).end();
  }
};

exports.postUpdateTodo = async (req, res, next) => {
  try {
    const id = req.body.id;
    const title = req.body.title;
    const completed = req.body.completed;
    await TodoModel.updateOne(
      { _id: id },
      { title: title, completed: completed }
    );
    res.status(201).end();
  } catch (e) {
    res.status(500).end();
  }
};
