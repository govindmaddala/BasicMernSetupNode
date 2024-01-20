exports.uploadById = async (req, res) => {
    try {
        const ID_No = req.params.id;

        const {
            Team_Selection,
            SQP,
            Risk_Assessment,
            Contract_Review,
            Enquiry,
            Order_Confirmation,
            Customer_Feedback,
            Service_Execution_Feedback,
        } = req.files || {};

        const setFields = [];
        const values = [];

        if (Team_Selection) {
            setFields.push("Team_Selection = ?");
            values.push(
                `${req.protocol}://${req.get("host")}/uploads/${Team_Selection[0].filename
                }`
            );
        }

        if (SQP) {
            setFields.push("SQP = ?");
            values.push(
                `${req.protocol}://${req.get("host")}/uploads/${SQP[0].filename}`
            );
        }

        if (Risk_Assessment) {
            setFields.push("Risk_Assessment = ?");
            values.push(
                `${req.protocol}://${req.get("host")}/uploads/${Risk_Assessment[0].filename
                }`
            );
        }
        if (Contract_Review) {
            setFields.push("Contract_Review = ?");
            values.push(
                `${req.protocol}://${req.get("host")}/uploads/${Contract_Review[0].filename
                }`
            );
        }
        if (Enquiry) {
            setFields.push("Enquiry = ?");
            values.push(
                `${req.protocol}://${req.get("host")}/uploads/${Enquiry[0].filename}`
            );
        }
        if (Order_Confirmation) {
            setFields.push("Order_Confirmation = ?");
            values.push(
                `${req.protocol}://${req.get("host")}/uploads/${Order_Confirmation[0].filename
                }`
            );
        }

        if (Customer_Feedback) {
            setFields.push("Customer_Feedback = ?");
            values.push(
                `${req.protocol}://${req.get("host")}/uploads/${Customer_Feedback[0].filename
                }`
            );
        }

        if (Service_Execution_Feedback) {
            setFields.push("Service_Execution_Feedback = ?");
            values.push(
                `${req.protocol}://${req.get("host")}/uploads/${Service_Execution_Feedback[0].filename
                }`
            );
        }

        if (setFields.length === 0) {
            return console.log("////////////////");
        }

        const sql = `
            UPDATE api_docs
            SET
            ${setFields.join(", ")}
            WHERE ID_No = ?
            `;

        values.push(ID_No);

        console.log(sql);
        connection.query(sql, values, (error, result) => {
            if (error) {
                console.log("Error updating record:", error);
                res.status(500).json({ message: "Internal server error" });
            } else {
                res.json({ message: "File URLs updated in the database" });
            }
        });
    } catch (error) {
        res.send(500).json({ message: "Internal server error" });
    }
}