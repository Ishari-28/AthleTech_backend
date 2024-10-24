const mysql = require("mysql2/promise");

const mysqlpool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Abeysooriya@0628",
    database: "athletech_db",
});

module.exports = mysqlpool;