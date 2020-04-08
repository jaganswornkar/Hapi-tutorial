const todos = require("../controlers/todo");
exports.register = server => {
  server.route({
    method: "GET",
    path: "/todo",
    options: {
      tags: ["api", "todo"],
      description: "My route description",
      notes: "My route notes"
    },
    handler: todos.getTodo
  });

  server.route({
    method: "POST",
    path: "/todo",
    options: {
      tags: ["api", "todo"],
      description: "My route description",
      notes: "My route notes"
    },
    handler: todos.createTodo
  });
};

exports.pkg = {
  name: "todo"
};
