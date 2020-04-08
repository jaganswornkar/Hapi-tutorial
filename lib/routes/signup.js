const Joi = require("@hapi/joi");
const signup = require("../controlers/signup");
const verifyToken = require("../../config/auth/jwt");

exports.register = server => {
  server.route({
    method: "POST",
    path: "/signup",
    options: {
      tags: ["api", "signup"],
      description: "My route description",
      notes: "My route notes"
    },
    handler: signup.createUser
  });

  server.route({
    method: "GET",
    path: "/signup",
    options: {
      tags: ["api", "signup"],
      description: "My route description",
      notes: "My route notes"
    },
    handler: signup.getUser
  });
};

exports.pkg = {
  name: "signup"
};
