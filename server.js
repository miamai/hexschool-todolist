import * as http from "http";
import { v4 as uuidV4 } from "uuid";
import errorHandle from "./errorHandle.js";

let todos = [
  { title: "first todo", id: uuidV4() },
  {
    title: "second todo",
    id: uuidV4(),
  },
];

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, PATCH, GET, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, X-Requested-With, Authorization, Content-Length",
  "Content-Type": "application/json",
};

const sendSuccessResponse = (res) => {
  res.writeHead(200, headers);
  res.write(
    JSON.stringify({
      status: "success",
      data: todos,
    })
  );
  res.end();
};

const requestListener = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  //   GET todos
  if (req.url === "/todos" && req.method === "GET") {
    sendSuccessResponse(res);
  }

  //   POST a todo
  if (req.url === "/todos" && req.method === "POST") {
    req.on("end", () => {
      try {
        const { title } = JSON.parse(body);
        if (title) {
          const newTodo = {
            title: title,
            id: uuidV4(),
          };

          todos.push(newTodo);
          sendSuccessResponse(res);
        } else {
          errorHandle(res, "Title is required.");
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  }

  //   DELETE all todos
  if (req.url === "/todos" && req.method === "DELETE") {
    todos = [];
    sendSuccessResponse(res);
  }

  //   DELETE a todo
  if (req.url.startsWith("/todos") && req.method === "DELETE") {
    const id = req.url.split("/").pop();
    const index = todos.findIndex((todo) => todo.id === id);

    // Handle duplicate request in deleting all todos
    if (todos.length === 0) return;

    if (index === -1) {
      errorHandle(res, "Invalid todo id.");
    } else {
      try {
        todos = todos.filter((todo) => todo.id !== id);
        sendSuccessResponse(res);
      } catch (error) {
        errorHandle(res, "Error in deleting todo.");
      }
    }
  }

  //   PATCH a todo
  if (req.url.startsWith("/todos") && req.method === "PATCH") {
    req.on("end", () => {
      try {
        const { title } = JSON.parse(body);
        const id = req.url.split("/").pop();
        const index = todos.findIndex((todo) => todo.id === id);

        if (index === -1) {
          errorHandle(res, "Invalid todo id.");
        } else {
          todos[index].title = title;
          sendSuccessResponse(res);
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  }

  //   OPTIONS
  if (req.method === "OPTIONS") {
    sendSuccessResponse(res);
  }

  req.on("error", () => {
    errorHandle(res);
  });
};

const server = http.createServer(requestListener);
server.listen(3005);
