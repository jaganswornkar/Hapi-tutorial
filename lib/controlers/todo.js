const Joi = require("@hapi/joi");
const verifyToken = require("../../config/auth/verifyToken");

module.exports = {

  getTodo: async (request, h) => {
    const db = request.mongo.db;    

    const tokenData = await verifyToken(request.headers.auth);
    
    //checking for valid token / user
    if(tokenData === "Invalid_token"){
      return h.response("Invalid_user / Invalid_token").code(401)
    }
    var allTodos = await db.collection('todos').find({email: tokenData.email}).toArray()
    
    return h.response(allTodos).code(200)
  },


  // creating new todo
  createTodo: async (request, h) => {
    const db = request.mongo.db;    

    const tokenData = await verifyToken(request.headers.auth);
    
    //checking for valid token / user
    if(tokenData === "Invalid_token"){
      return h.response("Invalid_user / Invalid_token").code(401)
    }

    //validating todo with Joi
    let todo = Joi.string().required().validate(request.payload.todo)

    // inserting todo into db
    var newTodo = await db.collection('todos').insertOne({ todo: todo.value, email: tokenData.email })
    console.log("newTodo", newTodo.ops[0])

    return h.response(newTodo.ops[0]).code(201).message("todo added successfully")

  }
};
