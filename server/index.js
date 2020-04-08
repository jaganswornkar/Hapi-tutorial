const Glue = require("@hapi/glue");
const manifest = require("./manifest");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

const options = {
  relativeTo: __dirname
};

module.exports.compose = () => {
  return Glue.compose(manifest, options);
};

const startServer = async function() {
  try {
    const server = await module.exports.compose();
    await server.start();
    console.log(`Server started on port: ${manifest.server.port}`);
    server.log(["success"], {
      message: `server started on port ${manifest.server.port} using NODE_ENV ${process.env.NODE_ENV}`
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};


if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });

  cluster.fork().on('listening', (address) => {
    console.log("worker is running......")
  });
} else {
  startServer();
  // console.log(`Worker ${process.pid} started`);
}
