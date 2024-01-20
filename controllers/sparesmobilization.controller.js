const connection = require("../models/connectDatabase");
const { insertOne } = require("../models/users.model");

exports.sparesmobilizationData = async (req, res, next) => {
    try {
        res.json({ message: "Message from sparesmobilization_data" });
    } catch (error) {
        res.send(500).json({ message: "Internal server error", error });
    }
}

exports.authentication = async (req, res, next) => {
    try {
        if (req.body.hasOwnProperty("username")) {
            next()
        } else {
            res.status(401).json({ message: "Unauthorized" });
        }
    } catch (error) {
        res.send(500).json({ message: "Internal server error", error });
    }
}

exports.sendData = async (req, res, next) => {
    try {
        let resp = insertOne("123")
        if(resp == false){

        }else{
            res.json({ message: "Message from sparesmobilization_data" });
        }
    } catch (error) {
        res.send(500).json({ message: "Internal server error", error });
    }
}