const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "ergon@123",
    database: "reference_details",
});

module.exports = connection;