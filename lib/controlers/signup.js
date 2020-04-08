const Joi = require("@hapi/joi");
const createToken = require("../../config/auth/jwt");
const verifyToken = require("../../config/auth/verifyToken");
var ObjectID = require("mongodb").ObjectID;

module.exports = {

  // Creating a new user
  createUser: async (request, h) => {

    // logging
    request.log(['info'],{
      message: "Hello"
    })

    // Joi schema for validation
    const schema = Joi.object({
      username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
      repeat_password: Joi.ref("password"),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] }
      })
    });
    // validating user input with joi
    const newUser = schema.validate(request.payload);

    const db = request.mongo.db;

    // checking for duplicate user entry
    const existingUser = await db.collection("Users").findOne({email: newUser.value.email})
    if(existingUser !== null){
      return h.response("duplicate user").code(409)
    }

    // if user not exists already
    const insertedData = await db.collection("Users").insertOne(newUser.value);
    const result = insertedData.ops[0];
    delete result.password;
    delete result.repeat_password;

    const token = createToken(result); // creating jwt token
    return h
      .response({ status: "ok", token: token, body: result })
      .state("auth", token)
      .code(201);
  },


  // GET method to get all users details
  getUser: async (request, h) => {

    request.log(['info'],{
      message: "Hello"
    })
    
    // verifying user token
    const tokenData = await verifyToken(request.headers.auth);
    if(tokenData === "Invalid_token"){
      return h.response("Invalid_user / Invalid_token").code(401)
    }
    const id = tokenData._id
    
    const db = request.mongo.db;
    const data = await db.collection("Users").findOne({_id: ObjectID(id)});
    
    // deleting passwords from output
    delete data.password;
    delete data.repeat_password;
    return data;
  }
};
