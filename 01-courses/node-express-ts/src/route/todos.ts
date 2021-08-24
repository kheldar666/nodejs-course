import { Router } from "express";
import { Todo } from "../models/todo";

let todos: Array<Todo> = [];

type RequestBody = { text: string };
type RequestParams = { todoId: string };

const router = Router();

router.get("/", (req, res, next) => {
  res.status(200).json({ todos: todos });
});

router.post("/todo", (req, res, next) => {
  const body = req.body as RequestBody;
  const newTodo: Todo = {
    id: new Date().getTime().toString(),
    text: body.text,
  };

  todos.push(newTodo);
  return res
    .status(201)
    .json({ message: "Todo added", todo: newTodo, todos: todos });
});

router.put("/todo/:todoId", (req, res, next) => {
  const params = req.params as RequestParams;
  const body = req.body as RequestBody;
  const tId = params.todoId;
  const index = todos.findIndex((t) => t.id === tId);
  if (index >= 0) {
    todos[index] = { id: tId, text: body.text };
    return res.status(200).json({ message: "Todo updated", todos: todos });
  }
  res.status(404).json({ message: "Todo not found" });
});

router.delete("/todo/:todoId", (req, res, next) => {
  const params = req.params as RequestParams;
  const tid = params.todoId;
  todos = todos.filter((t) => t.id !== tid);
  return res.status(200).json({ message: "Todo deleted", todos: todos });
});

export default router;
