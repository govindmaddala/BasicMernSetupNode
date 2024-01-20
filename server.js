require("dotenv")
const express = require("express");
const app = express();
const cors = require('cors')
const bodyParser = require("body-parser");
const morgan = require('morgan')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.use(morgan('dev'))

let port = process.env.PORT || 5000


app.get("/", (req, res, next) => {
    res.status(200).json({
        message: "message from backend server.js"
    })
})

app.use("/users", require('./routes/users.routes'))
app.use("/api/data/updatemanualdocs",require("./routes/manualDocs.routes"))


app.use("/api/data/sparesmobilization_data",require("./routes/sparesmobilization.routes"))


app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
})

