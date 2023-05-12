require("dotenv").config();
const env = process.env;

const development = {
  username: `${env.SQL_USERNAME}`,
  password: `${env.SQL_PASSWORD}`,
  database: `${env.SQL_DATABASE}`,
  host: `${env.SQL_HOST}`,
  dialect: "mysql",
};

const test = {
  username: "root",
  password: null,
  database: "database_test",
  host: "127.0.0.1",
  dialect: "mysql",
};

const production = {
  username: "root",
  password: null,
  database: "database_production",
  host: "127.0.0.1",
  dialect: "mysql",
};

module.exports = { development, test, production };
