const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

module.exports = {
  port: process.env.PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  cluster: process.env.DB_CLUSTER,
  name: process.env.DB_NAME,
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
};
