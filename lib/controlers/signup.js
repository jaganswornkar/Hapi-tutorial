const Joi = require("@hapi/joi");
const createToken = require("../../config/auth/jwt");
const verifyToken = require("../../config/auth/verifyToken");
var ObjectID = require("mongodb").ObjectID;

module.exports = {
  /**
   * @author Jagannath
   * @description creating a new user (signup user)
   * @createToken creating jwt token for new user
   * @Joi to validate user interface (schema- creted an interface to validate user inputs)
   * @db mongodb connection with atlas
   * @existingUser checking if the user already exists or not
   * @return a success message with basic user details
   */
  createUser: async (request, h) => {
    /** logging */

    request.log(["info"], {
      message: "Hello",
    });

    /**
     * @description creatign user interface for signup with joi validation (schema)
     */
    const schema = Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required(),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
      repeat_password: Joi.ref("password"),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      }),
    });

    /** validating user input with joi schema (interface) */
    const newUser = schema.validate(request.payload);

    /** initializing db */
    const db = request.mongo.db;

    /** checking for duplicate user entry */
    const existingUser = await db
      .collection("Users")
      .findOne({ email: newUser.value.email });
    if (existingUser !== null) {
      return h.response("duplicate user, User already exists!").code(409);
    }

    /** if user not exists already creating new user in db and returning back user details */
    const insertedData = await db.collection("Users").insertOne(newUser.value);
    const result = insertedData.ops[0];
    delete result.password;
    delete result.repeat_password;

    /** creating jwt token for new user  */
    const token = createToken(result);
    return h
      .response({ status: "ok", token: token, body: result })
      .state("auth", token)
      .code(201);
  },

  /**
   * @author Jagannath
   * @description getting user details with user token
   * @verifyToken verifying a user using user jwt token
   * @returns user details if user is valid
   */
  getUser: async (request, h) => {
    request.log(["info"], {
      message: "Hello",
    });

    /** verifying user token (user exists/valid) and decode and returns token data */
    const tokenData = await verifyToken(request.headers.auth);
    if (tokenData === "Invalid_token") {
      return h.response("Invalid_user / Invalid_token").code(401);
    }
    const id = tokenData._id;

    const db = request.mongo.db;
    const data = await db.collection("Users").findOne({ _id: ObjectID(id) });

    /** deleting passwords from output */
    delete data.password;
    delete data.repeat_password;
    return data;
  },
};
