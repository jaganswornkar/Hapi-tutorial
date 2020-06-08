require("dotenv").config();
const Path = require("path");
const Inert = require("inert");
const Vision = require("vision");
// const HapiSwagger = ;

module.exports = {
  server: {
    port: process.env.SERVER_PORT || 4200,
    host: process.env.SERVER_HOST || 'localhost'
  },
  register: {
    plugins: [
      Inert,
      Vision,
      {
        plugin: require("hapi-swaggered"),
        options: {
          info: {
            title: "Hapi js API",
            contact: {
              name: "jagannath",
              email: "jagannath@mobifyi.com"
            },
            description: "Simple Hapi js API boilerplate",
            version: "1.0"
          }
        }
      },
      {
        plugin: require("hapi-swaggered-ui"),
        options: {
          title: "Hapi js API",
          path: "/docs",
          authorization: {
            field: "apiKey",
            scope: "header", // header works as well
            // valuePrefix: 'bearer ', // prefix incase
            defaultValue: "demoKey",
            placeholder: "Enter your apiKey here"
          },
          swaggerOptions: {
            validatorUrl: null
          }
        }
      },
      {
        plugin: require("../common/logging")
      },
      {
        plugin: require("hapi-mongodb"),
        options: require("../config/db/dbConfig")
      },
      { plugin: require("../lib/routes/todo") },
      { plugin: require("../lib/routes/signup") }
    ]
  }
};
