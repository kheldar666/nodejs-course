import express from "express";

import todosRoute from "./route/todos";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());

app.use(todosRoute);

app.listen(3000);
