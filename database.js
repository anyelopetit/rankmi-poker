const { Pool } = require("pg");

const pool = new Pool({
  user: "anyelopetit",
  host: "localhost",
  database: "rankmipoker_development",
  password: "1234",
  port: 5432,
});

module.exports = pool;
