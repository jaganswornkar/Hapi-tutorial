require('dotenv').config()
const url = `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`;

module.exports = {
  url: url,
  settings: {
    poolSize: 10,
    useUnifiedTopology: true
  },
  decorate: true
};
