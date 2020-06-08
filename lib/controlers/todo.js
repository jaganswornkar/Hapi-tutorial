const Joi = require("@hapi/joi");
const verifyToken = require("../../config/auth/verifyToken");

module.exports = {

  /** 
  * @author Jagannath 
  * @description getting all todos of user with jwt validation
  * @verifyToken to validate and verify the user 
  * @returns an array of todos of that user
  */
  getTodo: async (request, h) => {
    const db = request.mongo.db;    

    const tokenData = await verifyToken(request.headers.auth);
    
    /** checking for valid token / user */
    if(tokenData === "Invalid_token"){
      return h.response("Invalid_user / Invalid_token").code(401)
    }

    /** getting user todo list from db and converting to an array with toArray() */
    var allTodos = await db.collection('todos').find({email: tokenData.email}).toArray()
    
    return h.response(allTodos).code(200)
  },


  /** 
  * @author Jagannath 
  * @description creating a new todo for the user
  * @verifyToken to validate and verify the user 
  * @returns returning a success message
  */
  createTodo: async (request, h) => {
    const db = request.mongo.db;    

    const tokenData = await verifyToken(request.headers.auth);
    
    /** checking for valid token / user */
    if(tokenData === "Invalid_token"){
      return h.response("Invalid_user / Invalid_token").code(401)
    }

    /** validating todo with Joi (todo interface) */
    let todo = Joi.string().required().validate(request.payload.todo)

    /** inserting todo into db */
    var newTodo = await db.collection('todos').insertOne({ todo: todo.value, email: tokenData.email })
    console.log("newTodo", newTodo.ops[0])

    return h.response(newTodo.ops[0]).code(201).message("todo added successfully")

  }
};
