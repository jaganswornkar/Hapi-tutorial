exports.register = async server => {
  const options = {
    includes: {
      request: ["headers", "payload"],
      response: ["headers", "payload"]
    },
    ops: {
      interval: 60*10000
    },
    reporters: {
      myConsoleReporters: [
        {
          module: "good-squeeze",
          name: "Squeeze",
          args: [{ log: "*", response: "*", ops: "*", request: "*" }]
        },
        {
          module: "good-console"
        },
        "stdout"
      ],
      fileReporter: [
        {
          module: "good-squeeze",
          name: "Squeeze",
          args: [{ response: "*" }]
        },
        {
          module: "white-out",
          args: [
            {
              authorization: "censor"
            },
            {
              root: "headers"
            }
          ]
        },
        {
          module: "good-squeeze",
          name: "SafeJson"
        },
        {
          module: "good-file",
          args: ["logfile"]
        }
      ]
    }
  };

  await server.register({
    plugin: require("good"),
    options
  });
};

exports.pkg = {
  name: "logging"
};
