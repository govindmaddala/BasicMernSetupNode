const connection = require("./connectDatabase");

let tableName = "reference_details.tools_register"


exports.insertOne = async (values) => {
    let query = `insert into ${tableName} set ? `;
    connection.query(query, [values], (err, result) => {
        if (err) {
            console.log(err);
            return false;
        } else {
            return result;
        }
    })

}