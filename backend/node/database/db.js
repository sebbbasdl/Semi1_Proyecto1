const mysql = require('mysql2');

let db_credentials = {
  host: process.env.HOST,
  port: process.env.PORT,
  user: 'admin',
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
}

var conn = mysql.createPool(db_credentials)

module.exports = conn