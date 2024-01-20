const express = require("express");
const router = require("./fileupload");
// const cors = require("cors");
const mysql = require("mysql");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const AWS = require("aws-sdk");

app.use(express.json());
// app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE,PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router);
app.use("/uploads", express.static("./uploads"));

// Configure AWS credentials and region
AWS.config.update({
  accessKeyId: "AKIAWZINXYXWWK5PNM6O",
  secretAccessKey: "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",
  region: "ap-southeast-2",
});

const s3 = new AWS.S3();

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    //     const file = req.file;
    // const params = {
    //   Bucket: 'ergon-s3-rds',
    //   Key: 'myFileName.txt', // The name of the file in S3
    //   Body: file.buffer, // The file content
    //   ContentType: file.mimetype, // Set the correct content type for the file
    // };

    await s3.putObject(params).promise();

    res.status(200).json({ message: "File uploaded successfully." });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Failed to upload file." });
  }
});

// s3.upload(params, (err, data) => {
//   if (err) {
//     console.error('Error uploading file:', err);
//   } else {
//     console.log('File uploaded successfully:', data.Location);
//   }
// });

// Creating  a connection to the MySQL database
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "ergon@123",
  database: "reference_details",
});

//for Connecting to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }

  console.log("Connected to MySQL database");
});
app.use(express.json());

//*******************************rig_details post api */
app.post("/api/data/post", (req, res) => {
  const s_no = req.body.s_no;
  const rig_name = req.body.rig_name;
  const short_name = req.body.short_name;
  const customer_name = req.body.customer_name;
  const details = req.body.details;
  const design = req.body.design;
  const location = req.body.location;
  const hull_no = req.body.hull_no;
  const design_2 = req.body.design_2;
  const new_group = req.body.new_group;
  const details_document_name = req.body.details_document_name;

  connection.query(
    "insert into rig_details values(?,?,?,?,?,?,?,?,?,?,?)",
    [
      s_no,
      rig_name,
      short_name,
      customer_name,
      details,
      design,
      location,
      hull_no,
      design_2,
      new_group,
      details_document_name,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send({ sucess: true, message: "Data insert Successfully" });
      }
    }
  );
});

app.post("/api/data/post", upload.single("signature"), (req, res) => {
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, "uploads", req.file.originalname);
  fs.rename(tempPath, targetPath, (err) => {
    if (err) throw err;
    res.sendStatus(200);
  });
});

app.post("/api/data/post1", (req, res) => {
  //const s_no = req.body.s_no;
  const country = req.body.country;
  const File_name_for_legal_requirements =
    req.body.File_name_for_legal_requirements;
  const Documents = req.body.Documents;
  const Document_Names = req.body.Document_Names;
  connection.query(
    "insert into legal_details (country, File_name_for_legal_requirements, Documents,Document_Names) values(?,?,?,?)",
    [country, File_name_for_legal_requirements, Documents, Document_Names],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error inserting data into the database");
      } else {
        res.send("POSTED");
      }
    }
  );
});

// app.put("/api/data/post1", (req, res) => {
//   const s_no = req.body.s_no;
//   const country = req.body.country;
//   const File_name_for_legal_requirements =
//     req.body.File_name_for_legal_requirements;
//   const Documents = req.body.Documents;

//   connection.query(
//     "update legal_details SET s_no = ?, country = ?, File_name_for_legal_requirements = ?,Documents = ? WHERE s_no = ?",
//     [s_no, country, File_name_for_legal_requirements, Documents, s_no],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         res.send("UPDATED");
//       }
//     }
//   );
// });

// app.post("/api/data/post2", (req, res) => {
//   console.log("post2 end point");
//   const S_No = req.body.S_No;
//   const Customer_Name = req.body.Customer_Name;
//   const Designation = req.body.Designation;
//   const Signature = req.body.Signature;
//   const Components = req.body.Components;
//   const Rigs = req.body.Rigs;
//   const jackingExperience = req.body.jackingExperience;
//   const skiddingExperience = req.body.skiddingExperience;
//   const craneExperience = req.body.craneExperience;
//   const Upcoming_project_duration_RigName =
//     req.body.Upcoming_project_duration_RigName;

//   connection.query(
//     "insert into professional_details values(?,?,?,?,?,?,?,?,?,?)",
//     [
//       S_No,
//       Customer_Name,
//       Designation,
//       Signature,
//       Components,
//       Rigs,
//       jackingExperience,
//       skiddingExperience,
//       craneExperience,
//       Upcoming_project_duration_RigName,
//     ],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         res.send({ success: true, message: "successfully added" });
//       }
//     }
//   );
// });

app.post("/api/data/toolsregister", (req, res) => {
  const {
    Item_No,
    Description,
    Serial_No,
    Manufacturer,
    Model,
    Cal_Date,
    Due_Date,
    Range_Value,
    Nominal_Value,
    Measured_Value,
    Acceptance_Criteria,
    Frequency,
    Cert_No,
    Status,
    Remarks,
  } = req.body;

  const values = {
    Item_No,
    Description,
    Serial_No,
    Manufacturer,
    Model,
    Cal_Date,
    Due_Date,
    Range_Value,
    Nominal_Value,
    Measured_Value,
    Acceptance_Criteria,
    Frequency,
    Cert_No,
    Status,
    Remarks,
  };

  connection.query(
    "insert into reference_details.tools_register set ? ",
    [values],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "data failed to post" });
      } else {
        res.send({ success: true, message: "data  posted successfully" });
      }
    }
  );
});

app.get("/api/data/sparesmobilization_data", (req, res) => {
  connection.query("SELECT * FROM spares_mobilization", (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error retriving spares datails");
    } else {
      const spares_Details = results.map((result) => result);
      res.send(spares_Details);
    }
  });
});

app.post("/api/data/sparesfile_post", (req, res) => {
  const updates = req.body;

  updates.forEach((update) => {
    const {
      ID_No,
      Location,
      Part_Number,
      Item_Name,
      Units,
      Quantity_Required,
      Available_Quantity_On_Rig,
      Status,
    } = update;
    const updatedValues = {
      ID_No,
      Location,
      Part_Number,
      Item_Name,
      Units,
      Quantity_Required,
      Available_Quantity_On_Rig,
      Status,
    };

    connection.query(
      "INSERT INTO reference_details.spares_mobilization SET ?",
      updatedValues,
      (err, result) => {
        if (err) {
          console.log(err);
          res.send({
            success: false,
            message: "Error while adding spares data",
          });
        }
      }
    );
  });

  res.send({ success: true, message: "Data inserted successfully" });
});

app.put("/api/data/sparesmobilization_data_update/:id", (req, res) => {
  const S_No = req.params.id;
  const updates = req.body;

  updates.forEach((update) => {
    const {
      ID_No,
      Location,
      Part_Number,
      Item_Name,
      Units,
      Quantity_Required,
      Available_Quantity_On_Rig,
      Status,
    } = update;
    const updatedValues = {
      ID_No,
      Location,
      Part_Number,
      Item_Name,
      Units,
      Quantity_Required,
      Available_Quantity_On_Rig,
      Status,
    };

    connection.query(
      "UPDATE reference_details.spares_mobilization SET ? WHERE S_No = ?",
      [updatedValues, S_No],
      (err, result) => {
        if (err) {
          console.log(err);
          res.send({
            success: false,
            message: "Error while updating spares data",
          });
        }
      }
    );
  });

  res.send({ success: true, message: "Data updated successfully" });
});

// Consumables

app.get("/api/data/consumables_data", (req, res) => {
  connection.query("SELECT * FROM consumables_tool_details", (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error retriving spares datails");
    } else {
      const spares_Details = results.map((result) => result);
      res.send(spares_Details);
    }
  });
});

app.post("/api/data/consumables", (req, res) => {
  const { ID_No, Item_Name, Quantity, UOM } = req.body;

  const values = {
    ID_No,
    Item_Name,
    Quantity,
    UOM,
  };

  connection.query(
    "INSERT INTO reference_details.consumables_tool_details SET ?",
    values,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, message: "Data inserted successfully" });
      }
    }
  );
});

app.put("/api/data/consumables_data_update/:id", (req, res) => {
  const S_No = req.params.id;
  const updates = req.body;

  updates.forEach((update) => {
    const { ID_No, Item_Name, Quantity, UOM } = update;
    const updatedValues = {
      ID_No,
      Item_Name,
      Quantity,
      UOM,
    };

    connection.query(
      "UPDATE reference_details.consumables_tool_details SET ? WHERE S_No = ?",
      [updatedValues, S_No],
      (err, result) => {
        if (err) {
          console.log(err);
          res.send({
            success: false,
            message: "Error while updating spares data",
          });
        }
      }
    );
  });

  res.send({ success: true, message: "Data updated successfully" });
});

//write app.get function to get all the details if rig_details table from mysql database
app.get("/api/data/getrig_details", (req, res) => {
  connection.query("select * from rig_details", (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// rig short name drpdown to fetch the details
// app.get('/rig_details/short_name', (req, res) => {
//     const { shortName } = req.params;
//     connection.query('SELECT rig_name FROM rig_details WHERE rig_short_name = ?', [shortName], (err, results) => {
//         if (err) {
//             console.log(err);
//             res.send({success : false, message : "Error fetching rig short names"});
//         } else {
//             const rigShortNames = results.map(result => result.rig_short_name);
//             res.send({success : true, data : rigShortNames});
//         }
//     });
// });

// app.get('/rig_short_name', (req, res) => {
//     connection.query('SELECT rig_name FROM rig_details', (err, data) => {
//       if (err) {
//         console.log(err);
//         res.send({ success: false, message: 'Error retrieving rig short names' });
//       } else {
//         res.send({ success: true, data: data });
//       }
//     });
//   });

//get api for personnel mobilization

app.get("/api/data/personalmobilization_details", (req, res) => {
  const { Customer_Name } = req.query;

  connection.query(
    `SELECT * FROM professional_details WHERE Customer_Name="${Customer_Name}"`,
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retriving customers docs");
      } else {
        const customer_details = results.map((result) => result);
        res.send(customer_details);
      }
    }
  );
});

// get api for forward mobilization

app.get("/api/data/forward_mobilization", (req, res) => {
  const { Customer_Name, ID } = req.query;

  connection.query(
    `SELECT * FROM forward_mobilization WHERE Customer_Name="${Customer_Name}" AND ID="${ID}"`,
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retriving forward docs");
        res.send({ success: false, message: err });
      } else {
        const forward_details = results.map((result) => result);
        res.send(forward_details);
      }
    }
  );
});

app.get("/api/data/getforward_mobilization", (req, res) => {
  const { ID } = req.query;

  connection.query(
    "SELECT Customer_Name FROM forward_mobilization WHERE ID = ?",
    [ID],
    (err, results) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .send({ error: "Failed to fetch forward mobilization data" });
        res.send({ success: false, message: err });
      } else {
        const forwardMobilizationData = results.map(
          (result) => result.Customer_Name
        );
        res.send(forwardMobilizationData);
      }
    }
  );
});

// post api for forward mobilization
app.post("/api/data/forward_mobilization", (req, res) => {
  const { Sales_Order_No, Customer_Name, ID } = req.body;
  const values = {
    Sales_Order_No,
    Customer_Name,
    ID,
  };
  connection.query(
    "INSERT INTO reference_details.forward_mobilization SET ?",
    values,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, message: "Posted Sucessfully" });
      }
    }
  );
});

//**************************Post api for daily_attendence */
// attendance
// app.post("/api/data/daily_attendance", (req, res) => {
//   const {
//     ID_No,
//     Tech,
//     Designation,
//     Day,
//     Month,
//     Year,
//     Status,
//     Remarks,
//     Requested_Status,
//     Reason,
//   } = req.body;

//   const values = {
//     ID_No,
//     Tech,
//     Designation,
//     Day,
//     Month,
//     Year,
//     Status,
//     Remarks,
//     Requested_Status,
//     Reason,
//   };

//   connection.query(
//     "INSERT INTO reference_details.daily_attendance SET ?",
//     values,
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.send({ success: false, message: "Failed to insert the data" });
//       } else {
//         res.send({ success: true, message: "Data inserted successfully" });
//       }
//     }
//   );
// });

app.put("/api/data/daily_attendanceUpdation/:id", (req, res) => {
  const S_No = req.params.id;
  const {
    ID_No,
    Tech,
    Designation,
    Day,
    Month,
    Year,
    Status,
    Previous_Attendance,
    Remarks,
    Requested_Status,
    Reason,
  } = req.body;

  const updatedValues = {
    ID_No,
    Tech,
    Designation,
    Day,
    Month,
    Year,
    Status,
    Previous_Attendance,
    Remarks,
    Requested_Status,
    Reason,
  };

  connection.query(
    "UPDATE reference_details.daily_attendance SET ? WHERE S_No = ?",
    [updatedValues, S_No],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "Failed to update data" });
      } else {
        res.send({
          success: true,
          message: "Attenndance Data updated successfully",
          data: result,
        });
      }
    }
  );
});

app.get("/api/data/daily_attendance", (req, res) => {
  connection.query(
    "SELECT * FROM reference_details.daily_attendance",
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "Failed to fetch data" });
      } else {
        res.send({ success: true, data: result });
      }
    }
  );
});

// put api for forward mobilization

app.put("/api/data/forward_mobilization/update", (req, res) => {
  const { Customer_Name, ID } = req.query;
  const Boarding_Airport = req.body.Boarding_Airport;
  const Boarding_Date = req.body.Boarding_Date;
  const Arrival_Airport = req.body.Arrival_Airport;
  const Arrival_Date = req.body.Arrival_Date;
  //const Upload_Tickets = req.body.Upload_Tickets;
  const Hotel_Name = req.body.Hotel_Name;
  const Booking_Dates_checkin = req.body.Booking_Dates_checkin;
  const Booking_Dates_checkout = req.body.Booking_Dates_checkout;
  //const Upload_Bookings = req.body.Upload_Bookings;
  const return_Boarding_Airport = req.body.return_Boarding_Airport;
  const return_Boarding_Date = req.body.return_Boarding_Date;
  const return_Arrival_Airport = req.body.return_Arrival_Airport;
  const return_Arrival_Date = req.body.return_Arrival_Date;
  //const return_Upload_Ticket = req.body.return_Upload_Ticket;
  const return_Hotel_Name = req.body.return_Hotel_Name;
  const return_Booking_Checkin = req.body.return_Booking_Checkin;
  const return_Booking_Checkout = req.body.return_Booking_Checkout;
  //const return_Upload_Booking = req.body.return_Upload_Booking;

  connection.query(
    `UPDATE forward_mobilization SET Boarding_Airport=?, Boarding_Date=?, Arrival_Airport=?, Arrival_Date=?, Hotel_Name=?, Booking_Dates_checkin=?, Booking_Dates_checkout=?, return_Boarding_Airport=?, return_Boarding_Date=?, return_Arrival_Airport=?, return_Arrival_Date=?, return_Hotel_Name=?, return_Booking_Checkin=?, return_Booking_Checkout=? WHERE (Customer_Name="${Customer_Name}" AND ID="${ID}")`,
    [
      Boarding_Airport,
      Boarding_Date,
      Arrival_Airport,
      Arrival_Date,
      Hotel_Name,
      Booking_Dates_checkin,
      Booking_Dates_checkout,
      return_Boarding_Airport,
      return_Boarding_Date,
      return_Arrival_Airport,
      return_Arrival_Date,
      return_Hotel_Name,
      return_Booking_Checkin,
      return_Booking_Checkout,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err });
      } else {
        if (result.affectedRows === 0) {
          res
            .status(404)
            .json({ message: "Forward mobilization data not found" });
        } else {
          res.json({
            message: "Forward mobilization data updated successfully",
          });
        }
      }
    }
  );
});

app.put("/api/data/forward_mobilization_files_uptick/update", (req, res) => {
  const { Customer_Name, ID } = req.query;
  connection.query(
    `UPDATE forward_mobilization SET Upload_Tickets = null WHERE (Customer_Name="${Customer_Name}" AND ID="${ID}")`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err });
      } else {
        if (result.affectedRows === 0) {
          res
            .status(404)
            .json({ message: "Forward mobilization data not found" });
        } else {
          res.json({
            message: "Forward mobilization data updated successfully",
          });
        }
      }
    }
  );
});
app.put("/api/data/forward_mobilization_files_retick/update", (req, res) => {
  const { Customer_Name, ID } = req.query;
  connection.query(
    `UPDATE forward_mobilization SET return_Upload_Ticket = null WHERE (Customer_Name="${Customer_Name}" AND ID="${ID}")`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err });
      } else {
        if (result.affectedRows === 0) {
          res
            .status(404)
            .json({ message: "Forward mobilization data not found" });
        } else {
          res.json({
            message: "Forward mobilization data updated successfully",
          });
        }
      }
    }
  );
});

app.put("/api/data/forward_mobilization_files_rebook/update", (req, res) => {
  const { Customer_Name, ID } = req.query;
  connection.query(
    `UPDATE forward_mobilization SET return_Upload_Booking = null WHERE (Customer_Name="${Customer_Name}" AND ID="${ID}")`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err });
      } else {
        if (result.affectedRows === 0) {
          res
            .status(404)
            .json({ message: "Forward mobilization data not found" });
        } else {
          res.json({
            message: "Forward mobilization data updated successfully",
          });
        }
      }
    }
  );
});
app.put("/api/data/forward_mobilization_files_upbook/update", (req, res) => {
  const { Customer_Name, ID } = req.query;
  connection.query(
    `UPDATE forward_mobilization SET Upload_Bookings = null WHERE (Customer_Name="${Customer_Name}" AND ID="${ID}")`,
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err });
      } else {
        if (result.affectedRows === 0) {
          res
            .status(404)
            .json({ message: "Forward mobilization data not found" });
        } else {
          res.json({
            message: "Forward mobilization data updated successfully",
          });
        }
      }
    }
  );
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const noSpaceInName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${noSpaceInName}`);
  },
});

const upload2 = multer({ storage });

app.put(
  "/api/data/forward_mobilization_files/update",
  upload2.fields([
    { name: "Upload_Tickets" },
    { name: "Upload_Bookings" },
    { name: "return_Upload_Ticket" },
    { name: "return_Upload_Booking" },
  ]),
  (req, res) => {
    const { Customer_Name, ID } = req.query;
    const {
      Upload_Tickets,
      Upload_Bookings,
      return_Upload_Ticket,
      return_Upload_Booking,
    } = req.files;

    const upload_Tickets_Path = Upload_Tickets
      ? `${req.protocol}://${req.get("host")}/uploads/${
          Upload_Tickets[0].filename
        }`
      : null;
    const upload_Bookings_Path = Upload_Bookings
      ? `${req.protocol}://${req.get("host")}/uploads/${
          Upload_Bookings[0].filename
        }`
      : null;
    const return_upload_ticket_Path = return_Upload_Ticket
      ? `${req.protocol}://${req.get("host")}/uploads/${
          return_Upload_Ticket[0].filename
        }`
      : null;
    const return_upload_booking_Path = return_Upload_Booking
      ? `${req.protocol}://${req.get("host")}/uploads/${
          return_Upload_Booking[0].filename
        }`
      : null;

    const setFields = [];
    const values = [];

    if (Upload_Tickets) {
      setFields.push("Upload_Tickets = ?");
      values.push(upload_Tickets_Path);
    }

    if (Upload_Bookings) {
      setFields.push("Upload_Bookings = ?");
      values.push(upload_Bookings_Path);
    }

    if (return_Upload_Ticket) {
      setFields.push("return_Upload_Ticket = ?");
      values.push(return_upload_ticket_Path);
    }

    if (return_Upload_Booking) {
      setFields.push("return_Upload_Booking = ?");
      values.push(return_upload_booking_Path);
    }

    if (setFields.length === 0) {
      return res.json({ message: "No files were uploaded for update" });
    }

    const sql = `
    UPDATE forward_mobilization
    SET
    ${setFields.join(", ")}
    WHERE Customer_Name = ? AND ID = ?
  `;

    values.push(Customer_Name, ID);

    connection.query(sql, values, (error, result) => {
      if (error) {
        console.error("Error updating record:", error);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.json({ message: "File URLs updated in the database" });
      }
    });
  }
);

app.delete("/api/data/forward_mobilization", (req, res) => {
  const { Customer_Name, ID } = req.query;
  connection.query(
    `DELETE FROM forward_mobilization WHERE Customer_Name=? AND ID=?`,
    [Customer_Name, ID],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("DELETED");
      }
    }
  );
});

app.get("/api/data/short_name", (req, res) => {
  connection.query("SELECT short_name FROM rig_details", (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error retrieving short names");
    } else {
      const shortNames = results.map((result) => result.short_name);
      res.send(shortNames);
    }
  });
});

app.get("/api/data/get-rig-details-with-shortName", (req, res) => {
  const { short_name } = req.query;

  connection.query(
    `SELECT * FROM reference_details.rig_details where short_name="${short_name}"`,
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving rig details");
      } else {
        const rigDetails = results.map((result) => result);
        res.send(rigDetails);
      }
    }
  );
});

//Search api to search results by using parameters like rig short name,customer name,design,location

app.get("/api/data/rig_details_search", (req, res) => {
  const { rigShortName, customerName, design, location } = req.query;
  console.log("rig details::::::::::");
  let query = "SELECT * FROM rig_details";

  if (rigShortName || customerName || design || location) {
    query += " WHERE";

    if (rigShortName) {
      query += ` short_name = '${rigShortName}'`;
    }

    //   if (customerName) {
    //     query += ` ${rigShortName ? 'AND' : ''} customer_name = '${customerName}'`;
    //   }

    //   if (design) {
    //     query += ` ${rigShortName || customerName ? 'AND' : ''} design = '${design}'`;
    //   }

    //   if (location) {
    //     query += ` ${rigShortName || customerName || design ? 'AND' : ''} location = '${location}'`;
    //   }
  }

  connection.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

//search api for legal details by country name

// app.get("/api/data/legal_details", (req, res) => {
//   const { country } = req.query;

//   let query = "SELECT * FROM legal_details";

//   if (country) {
//     query += ` WHERE country = '${country}'`;
//   }

//   connection.query(query, (err, data) => {
//     if (err) return res.json(err);
//     return res.json(data);
//   });
// });

app.get("/api/data/legal_details", (req, res) => {
  connection.query("select * from legal_details", (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

//Search api for professional_details by customer name and rigs_short_name

app.get("/api/data/professional_details/", (req, res) => {
  const { Customer_Name, Rigs } = req.query;

  let query = "SELECT * FROM professional_details";

  if (Customer_Name || Rigs) {
    query += " WHERE";

    if (Customer_Name) {
      query += ` Customer_name = '${Customer_Name}'`;
    }

    if (Rigs) {
      query += ` ${Customer_Name ? "AND" : ""} Rigs = '${Rigs}'`;
    }
  }

  connection.query(query, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

//api for supervisiors
app.get("/api/data/supervisor_customer_names", (req, res) => {
  connection.query(
    'SELECT Customer_Name FROM professional_details WHERE Designation = "Supervisor"',
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving supervisor customer names");
      } else {
        const customerNames = results.map((result) => result.Customer_Name);
        res.send(customerNames);
      }
    }
  );
});

//api for technicians
app.get("/api/data/technician_customer_names", (req, res) => {
  connection.query(
    'SELECT Customer_Name FROM professional_details WHERE Designation = "Technician"',
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving technician customer names");
      } else {
        const customerNames = results.map((result) => result.Customer_Name);
        res.send(customerNames);
      }
    }
  );
});

//search api for tools_register by Item_No

app.get("/api/data/Item_No", (req, res) => {
  connection.query(
    "SELECT Item_No FROM reference_details.tools_register ",
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving tool Item no");
      } else {
        const Item_No = results.map((result) => result.Item_No);
        res.send(Item_No);
      }
    }
  );
});

app.get("/api/data/get-tools-details-with-Item_No", (req, res) => {
  const { Description } = req.query;

  connection.query(
    `SELECT * FROM reference_details.tools_register where Description="${Description}"`,
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving tools details");
      } else {
        const tools_register = results.map((result) => result);
        res.send(tools_register);
      }
    }
  );
});

app.get("/api/data/get-all-tools-details", (req, res) => {
  const { Item_No } = req.query;

  connection.query(
    `SELECT * FROM reference_details.tools_register where Item_No="${Item_No}"`,
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving all tools details");
      } else {
        const tools_register = results.map((result) => result);
        res.send(tools_register);
      }
    }
  );
});

app.get("/api/data/gettools_register", (req, res) => {
  connection.query("select * from tools_register", (err, data) => {
    if (err) {
      res.send({ success: false, message: "failed to retrieve data" });
    } else {
      res.send({ success: true, message: "  retrieved data", data: data });
    }
  });
});

app.get("/api/data/Description", (req, res) => {
  connection.query(
    "SELECT Description FROM reference_details.tools_register ",
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving tool descriptions");
      } else {
        const descriptions = results.map((result) => result.Description);
        res.send(descriptions);
      }
    }
  );
});

app.get("/api/data/get-Description", (req, res) => {
  const { Description } = req.query;

  connection.query(
    `SELECT * FROM reference_details.tools_register where Description="${Description}"`,
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving rig details");
      } else {
        const tools_register = results.map((result) => result);
        res.send(tools_register);
      }
    }
  );
});

//*****************************************professionaldetails post api***********************************************
app.post("/api/data/professional_details", (req, res) => {
  const {
    Customer_Name,
    Designation,
    Retainership,
    Signature,
    Rigs,
    jackingExperience,
    skiddingExperience,
    craneExperience,
    upcomingProjectDuration,
    Fixation_Experience,
    Seaman_Book_Expiry,
    Seaman_Issuing_Country,
    Seaman_Doc,
    Bosiet_Expiry,
    Bosiet_Doc,
    H2s_Expiry,
    H2s_Doc,
    Medical_Expiry,
    Medical_Doc,
    Insurance_Expiry,
    Insurance_Doc,
    SNT_Eye_Test_Expiry,
    SNT_Eye_Test_Doc,
    Yellow_Fever_Expiry,
    Yellow_Fever_Doc,
    CV_File,
    Passport_Expiry,
    Passport_Issuing_Country,
    Passport_Doc,
    Active_Visas_One,
    Active_Visas_Two,
    Active_Visas_Three,
    Active_Visas_Four,
    Active_Visas_Five,
    Active_Visas_Six,
    Active_Visas_One_Expiry,
    Active_Visas_Two_Expiry,
    Active_Visas_Three_Expiry,
    Active_Visas_Four_Expiry,
    Active_Visas_Five_Expiry,
    Active_Visas_Six_Expiry,
    Active_Visas_One_Doc,
    Active_Visas_Two_Doc,
    Active_Visas_Three_Doc,
    Active_Visas_Four_Doc,
    Active_Visas_Five_Doc,
    Active_Visas_Six_Doc,
    Signature_Doc_Name,
    Seaman_Doc_Name,
    Bosiet_Doc_Name,
    H2S_Doc_Name,
    Medical_Doc_Name,
    Insurance_Doc_Name,
    Snt_Doc_Name,
    Yellow_Fever_Doc_name,
    Passport_Doc_Name,
    Active_Visa1_Doc_Name,
    Active_Visa2_Doc_Name,
    Active_Visa3_Doc_Name,
    Active_Visa4_Doc_Name,
    Active_Visa5_Doc_Name,
    Active_Visa6_Doc_Name,
    Photo_Upload,
    Photo_Upload_Doc_Name,
    Vaccination_Certificate,
    PCC,
    Vaccination_Certificate_Doc_Name,
    PCC_Doc_Name,
    Nationality,
  } = req.body;

  const values = {
    Customer_Name,
    Designation,
    Retainership,
    Signature,
    Rigs,
    jackingExperience,
    skiddingExperience,
    craneExperience,
    upcomingProjectDuration,
    Fixation_Experience,
    Seaman_Book_Expiry,
    Seaman_Issuing_Country,
    Seaman_Doc,
    Bosiet_Expiry,
    Bosiet_Doc,
    H2s_Expiry,
    H2s_Doc,
    Medical_Expiry,
    Medical_Doc,
    Insurance_Expiry,
    Insurance_Doc,
    SNT_Eye_Test_Expiry,
    SNT_Eye_Test_Doc,
    Yellow_Fever_Expiry,
    Yellow_Fever_Doc,
    CV_File,
    Passport_Expiry,
    Passport_Issuing_Country,
    Passport_Doc,
    Active_Visas_One,
    Active_Visas_Two,
    Active_Visas_Three,
    Active_Visas_Four,
    Active_Visas_Five,
    Active_Visas_Six,
    Active_Visas_One_Expiry,
    Active_Visas_Two_Expiry,
    Active_Visas_Three_Expiry,
    Active_Visas_Four_Expiry,
    Active_Visas_Five_Expiry,
    Active_Visas_Six_Expiry,
    Active_Visas_One_Doc,
    Active_Visas_Two_Doc,
    Active_Visas_Three_Doc,
    Active_Visas_Four_Doc,
    Active_Visas_Five_Doc,
    Active_Visas_Six_Doc,
    Signature_Doc_Name,
    Seaman_Doc_Name,
    Bosiet_Doc_Name,
    H2S_Doc_Name,
    Medical_Doc_Name,
    Insurance_Doc_Name,
    Snt_Doc_Name,
    Yellow_Fever_Doc_name,
    Passport_Doc_Name,
    Active_Visa1_Doc_Name,
    Active_Visa2_Doc_Name,
    Active_Visa3_Doc_Name,
    Active_Visa4_Doc_Name,
    Active_Visa5_Doc_Name,
    Active_Visa6_Doc_Name,
    Photo_Upload,
    Photo_Upload_Doc_Name,
    Vaccination_Certificate,
    PCC,
    Vaccination_Certificate_Doc_Name,
    PCC_Doc_Name,
    Nationality,
  };

  connection.query(
    "INSERT INTO reference_details.professional_details SET ?",
    values,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "Failed to insert data" });
      } else {
        res.send({ success: true, message: "Data inserted successfully" });
      }
    }
  );
});
//**************GET api for upcomingprojectduration and sales order no **********************/
app.get("/api/data/project_details/withsalesorderno/duration", (req, res) => {
  connection.query(
    "SELECT Estimated_Date_Of_Commencement, Estimated_Project_Completion_Month, Sales_Order_No FROM project_details",
    (err, results) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "Error fetching data" });
      } else {
        res.send({ success: true, data: results });
      }
    }
  );
});

//*********************************************professional details get api**************************************** */
app.get("/api/data/getprofessional_details", (req, res) => {
  connection.query("select * from professional_details", (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/api/data/getprofessional_details", (req, res) => {
  connection.query(
    "select *, 'AVAILABLE' as status from professional_details where professional_details.Customer_Name not in (select Supervisor_Names from project_details where curdate() between STR_TO_DATE(project_details.Estimated_Date_Of_Commencement, '%d/%m/%Y') and STR_TO_DATE(project_details.Estimated_Project_Completion_Month, '%d/%m/%Y')) and professional_details.Customer_Name not in (select Technician_Names from project_details where curdate() between STR_TO_DATE(project_details.Estimated_Date_Of_Commencement, '%d/%m/%Y') and STR_TO_DATE(project_details.Estimated_Project_Completion_Month, '%d/%m/%Y')) UNION select *, 'ENGAGED' as status from professional_details where professional_details.Customer_Name in (select Supervisor_Names from project_details where curdate() between STR_TO_DATE(project_details.Estimated_Date_Of_Commencement, '%d/%m/%Y') and STR_TO_DATE(project_details.Estimated_Project_Completion_Month, '%d/%m/%Y')) or professional_details.Customer_Name in (select Technician_Names from project_details where curdate() between STR_TO_DATE(project_details.Estimated_Date_Of_Commencement, '%d/%m/%Y') and STR_TO_DATE(project_details.Estimated_Project_Completion_Month, '%d/%m/%Y'));",
    "select professional_details.S_No, professional_details.ID_No, professional_details.Customer_Name, professional_details.Designation, professional_details.Rigs, professional_details.jackingExperience, professional_details.skiddingExperience, professional_details.craneExperience, professional_details.upcomingProjectDuration, professional_details.Fixation_Experience, professional_details.Seaman_Book_Expiry, professional_details.Seaman_Issuing_Country, professional_details.Seaman_Doc, professional_details.Bosiet_Expiry, professional_details.Bosiet_Doc, professional_details.H2s_Expiry, professional_details.H2s_Doc, professional_details.Medical_Expiry, professional_details.Medical_Doc, professional_details.Insurance_Expiry, professional_details.Insurance_Doc, professional_details.SNT_Eye_Test_Expiry, professional_details.SNT_Eye_Test_Doc, professional_details.CV_File, professional_details.Status, professional_details.Signature, professional_details.Passport_Expiry, professional_details.Passport_Issuing_Country, professional_details.Passport_Doc,professional_details.Active_Visas_One,professional_details.Active_Visas_Two,professional_details.Active_Visas_Three,professional_details.Active_Visas_Four,professional_details.Active_Visas_Five,professional_details.Active_Visas_Six,professional_details.Active_Visas_One_Expiry,professional_details.Active_Visas_Two_Expiry,professional_details.Active_Visas_Three_Expiry,professional_details.Active_Visas_Four_Expiry,professional_details.Active_Visas_Five_Expiry,professional_details.Active_Visas_Six_Expiry,professional_details.Active_Visas_One_Doc,professional_details.Active_Visas_Two_Doc,professional_details.Active_Visas_Three_Doc,professional_details.Active_Visas_Four_Doc,professional_details.Active_Visas_Five_Doc,professional_details.Active_Visas_Six_Doc,professional_details.Employee_ID,professional_details.Signature_Doc_Name,professional_details.Seaman_Doc_Name,professional_details.Bosiet_Doc_Name,professional_details.H2S_Doc_Name,professional_details.Medical_Doc_Name,professional_details.Insurance_Doc_Name,professional_details.Snt_Doc_Name,professional_details.Passport_Doc_Name,professional_details.Active_Visa1_Doc_Name,professional_details.Active_Visa2_Doc_Name,professional_details.Active_Visa3_Doc_Name,professional_details.Active_Visa4_Doc_Name,professional_details.Active_Visa5_Doc_Name,professional_details.Active_Visa6_Doc_Name,professional_details.Photo_Upload,professional_details.Photo_Upload_Doc_Name,professional_details.KSA_Exit_Date,professional_details.UAE_Exit_Date,professional_details.Vaccination_Certificate,professional_details.Vaccination_Certificate_Doc_Name,professional_details.PCC,professional_details.PCC_Doc_Name,professional_details.Nationality,professional_details.Retainership, case WHEN curdate() between STR_TO_DATE(project_details.Estimated_Date_Of_Commencement, '%d/%m/%Y') and STR_TO_DATE(project_details.Estimated_Project_Completion_Month, '%d/%m/%Y') THEN 'engaged' when curdate() < STR_TO_DATE(project_details.Estimated_Date_Of_Commencement, '%d/%m/%Y') then 'UPCOMING' when curdate() > STR_TO_DATE(project_details.Estimated_Project_Completion_Month, '%d/%m/%Y') then 'COMPLETED' ELSE 'AVAILABLE' end as status from professional_details left join project_details on professional_details.Customer_Name = project_details.Supervisor_Names or professional_details.Customer_Name = project_details.Technician_Names;",
    (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    }
  );
});

// app.get("/api/data/getprofessional_details", (req, res) => {
//   connection.query(
//     "select *, 'AVAILABLE' as status from professional_details where professional_details.Customer_Name not in (select Supervisor_Names from project_details where curdate() between STR_TO_DATE(project_details.Estimated_Date_Of_Commencement, '%d/%m/%Y') and STR_TO_DATE(project_details.Estimated_Project_Completion_Month, '%d/%m/%Y')) and professional_details.Customer_Name not in (select Technician_Names from project_details where curdate() between STR_TO_DATE(project_details.Estimated_Date_Of_Commencement, '%d/%m/%Y') and STR_TO_DATE(project_details.Estimated_Project_Completion_Month, '%d/%m/%Y')) UNION select *, 'ENGAGED' as status from professional_details where professional_details.Customer_Name in (select Supervisor_Names from project_details where curdate() between STR_TO_DATE(project_details.Estimated_Date_Of_Commencement, '%d/%m/%Y') and STR_TO_DATE(project_details.Estimated_Project_Completion_Month, '%d/%m/%Y')) or professional_details.Customer_Name in (select Technician_Names from project_details where curdate() between STR_TO_DATE(project_details.Estimated_Date_Of_Commencement, '%d/%m/%Y') and STR_TO_DATE(project_details.Estimated_Project_Completion_Month, '%d/%m/%Y'));",
//     "select professional_details.S_No, professional_details.ID_No, professional_details.Customer_Name, professional_details.Designation, professional_details.Rigs, professional_details.jackingExperience, professional_details.skiddingExperience, professional_details.craneExperience, professional_details.upcomingProjectDuration, professional_details.Fixation_Experience, professional_details.Seaman_Book_Expiry, professional_details.Seaman_Issuing_Country, professional_details.Seaman_Doc, professional_details.Bosiet_Expiry, professional_details.Bosiet_Doc, professional_details.H2s_Expiry, professional_details.H2s_Doc, professional_details.Medical_Expiry, professional_details.Medical_Doc, professional_details.Insurance_Expiry, professional_details.Insurance_Doc, professional_details.SNT_Eye_Test_Expiry, professional_details.SNT_Eye_Test_Doc, professional_details.CV_File, professional_details.Status, professional_details.Signature, professional_details.Passport_Expiry, professional_details.Passport_Issuing_Country, professional_details.Passport_Doc,professional_details.Active_Visas_One,professional_details.Active_Visas_Two,professional_details.Active_Visas_Three,professional_details.Active_Visas_Four,professional_details.Active_Visas_Five,professional_details.Active_Visas_Six,professional_details.Active_Visas_One_Expiry,professional_details.Active_Visas_Two_Expiry,professional_details.Active_Visas_Three_Expiry,professional_details.Active_Visas_Four_Expiry,professional_details.Active_Visas_Five_Expiry,professional_details.Active_Visas_Six_Expiry,professional_details.Active_Visas_One_Doc,professional_details.Active_Visas_Two_Doc,professional_details.Active_Visas_Three_Doc,professional_details.Active_Visas_Four_Doc,professional_details.Active_Visas_Five_Doc,professional_details.Active_Visas_Six_Doc,professional_details.Employee_ID,professional_details.Signature_Doc_Name,professional_details.Seaman_Doc_Name,professional_details.Bosiet_Doc_Name,professional_details.H2S_Doc_Name,professional_details.Medical_Doc_Name,professional_details.Insurance_Doc_Name,professional_details.Snt_Doc_Name,professional_details.Passport_Doc_Name,professional_details.Active_Visa1_Doc_Name,professional_details.Active_Visa2_Doc_Name,professional_details.Active_Visa3_Doc_Name,professional_details.Active_Visa4_Doc_Name,professional_details.Active_Visa5_Doc_Name,professional_details.Active_Visa6_Doc_Name,professional_details.Photo_Upload,professional_details.Photo_Upload_Doc_Name,professional_details.KSA_Exit_Date,professional_details.UAE_Exit_Date,professional_details.Vaccination_Certificate,professional_details.Vaccination_Certificate_Doc_Name,professional_details.PCC,professional_details.PCC_Doc_Name,professional_details.Nationality,professional_details.Retainership, case WHEN curdate() between STR_TO_DATE(project_details.Estimated_Date_Of_Commencement, '%d/%m/%Y') and STR_TO_DATE(project_details.Estimated_Project_Completion_Month, '%d/%m/%Y') THEN 'engaged' when curdate() < STR_TO_DATE(project_details.Estimated_Date_Of_Commencement, '%d/%m/%Y') then 'UPCOMING' when curdate() > STR_TO_DATE(project_details.Estimated_Project_Completion_Month, '%d/%m/%Y') then 'COMPLETED' ELSE 'AVAILABLE' end as status from professional_details left join project_details on professional_details.Customer_Name = project_details.Supervisor_Names or professional_details.Customer_Name = project_details.Technician_Names;",
//     (err, data) => {
//       if (err) return res.json(err);
//       return res.json(data);
//     }
//   );
// });
//****************************************************************************************************************** */
// app.get("/api/data/getprofessional_details", (req, res) => {
//   connection.query(
//     "select professional_details.S_No, professional_details.ID_No, professional_details.Customer_Name, professional_details.Designation, professional_details.Rigs, professional_details.jackingExperience, professional_details.skiddingExperience, professional_details.craneExperience, professional_details.upcomingProjectDuration, professional_details.Fixation_Experience, professional_details.Seaman_Book_Expiry, professional_details.Seaman_Issuing_Country, professional_details.Seaman_Doc, professional_details.Bosiet_Expiry, professional_details.Bosiet_Doc, professional_details.H2s_Expiry, professional_details.H2s_Doc, professional_details.Medical_Expiry, professional_details.Medical_Doc, professional_details.Insurance_Expiry, professional_details.Insurance_Doc, professional_details.SNT_Eye_Test_Expiry, professional_details.SNT_Eye_Test_Doc, professional_details.CV_File, professional_details.Status, professional_details.Signature, professional_details.Passport_Expiry, professional_details.Passport_Issuing_Country, professional_details.Passport_Doc,professional_details.Active_Visas_One,professional_details.Active_Visas_Two,professional_details.Active_Visas_Three,professional_details.Active_Visas_Four,professional_details.Active_Visas_Five,professional_details.Active_Visas_Six,professional_details.Active_Visas_One_Expiry,professional_details.Active_Visas_Two_Expiry,professional_details.Active_Visas_Three_Expiry,professional_details.Active_Visas_Four_Expiry,professional_details.Active_Visas_Five_Expiry,professional_details.Active_Visas_Six_Expiry,professional_details.Active_Visas_One_Doc,professional_details.Active_Visas_Two_Doc,professional_details.Active_Visas_Three_Doc,professional_details.Active_Visas_Four_Doc,professional_details.Active_Visas_Five_Doc,professional_details.Active_Visas_Six_Doc,professional_details.Employee_ID,professional_details.Signature_Doc_Name,professional_details.Seaman_Doc_Name,professional_details.Bosiet_Doc_Name,professional_details.H2S_Doc_Name,professional_details.Medical_Doc_Name,professional_details.Insurance_Doc_Name,professional_details.Snt_Doc_Name,professional_details.Passport_Doc_Name,professional_details.Active_Visa1_Doc_Name,professional_details.Active_Visa2_Doc_Name,professional_details.Active_Visa3_Doc_Name,professional_details.Active_Visa4_Doc_Name,professional_details.Active_Visa5_Doc_Name,professional_details.Active_Visa6_Doc_Name,professional_details.Photo_Upload,professional_details.Photo_Upload_Doc_Name,professional_details.KSA_Exit_Date,professional_details.UAE_Exit_Date,professional_details.Vaccination_Certificate,professional_details.Vaccination_Certificate_Doc_Name,professional_details.PCC,professional_details.PCC_Doc_Name,professional_details.Nationality,professional_details.Retainership, case WHEN (project_details.Estimated_Date_Of_Commencement<curdate()<project_details.Estimated_Project_Completion_Month) THEN 'engaged' else 'available' end as status from professional_details left join project_details on professional_details.Customer_Name = project_details.Supervisor_Names or professional_details.Customer_Name = project_details.Technician_Names",
//     (err, data) => {
//       if (err) return res.json(err);
//       return res.json(data);
//     }
//   );
// });

// app.get("/api/data/getprofessional_details", (req, res) => {
//   connection.query(
//     "select  professional_details.ID_No, professional_details.Customer_Name, professional_details.Designation, professional_details.Rigs, professional_details.jackingExperience, professional_details.skiddingExperience, professional_details.craneExperience, professional_details.upcomingProjectDuration, professional_details.Fixation_Experience, professional_details.Seaman_Book_Expiry, professional_details.Seaman_Issuing_Country, professional_details.Seaman_Doc, professional_details.Bosiet_Expiry, professional_details.Bosiet_Doc, professional_details.H2s_Expiry, professional_details.H2s_Doc, professional_details.Medical_Expiry, professional_details.Medical_Doc, professional_details.Insurance_Expiry, professional_details.Insurance_Doc, professional_details.SNT_Eye_Test_Expiry, professional_details.SNT_Eye_Test_Doc, professional_details.CV_File, professional_details.Status, professional_details.Signature, professional_details.Passport_Expiry, professional_details.Passport_Issuing_Country, professional_details.Passport_Doc,professional_details.Active_Visas_One,professional_details.Active_Visas_Two,professional_details.Active_Visas_Three,professional_details.Active_Visas_Four,professional_details.Active_Visas_Five,professional_details.Active_Visas_Six,professional_details.Active_Visas_One_Expiry,professional_details.Active_Visas_Two_Expiry,professional_details.Active_Visas_Three_Expiry,professional_details.Active_Visas_Four_Expiry,professional_details.Active_Visas_Five_Expiry,professional_details.Active_Visas_Six_Expiry,professional_details.Active_Visas_One_Doc,professional_details.Active_Visas_Two_Doc,professional_details.Active_Visas_Three_Doc,professional_details.Active_Visas_Four_Doc,professional_details.Active_Visas_Five_Doc,professional_details.Active_Visas_Six_Doc,professional_details.Employee_ID,professional_details.Signature_Doc_Name,professional_details.Seaman_Doc_Name,professional_details.Bosiet_Doc_Name,professional_details.H2S_Doc_Name,professional_details.Medical_Doc_Name,professional_details.Insurance_Doc_Name,professional_details.Snt_Doc_Name,professional_details.Passport_Doc_Name,professional_details.Active_Visa1_Doc_Name,professional_details.Active_Visa2_Doc_Name,professional_details.Active_Visa3_Doc_Name,professional_details.Active_Visa4_Doc_Name,professional_details.Active_Visa5_Doc_Name,professional_details.Active_Visa6_Doc_Name,professional_details.Photo_Upload,professional_details.Photo_Upload_Doc_Name,professional_details.KSA_Exit_Date,professional_details.UAE_Exit_Date,professional_details.Vaccination_Certificate,professional_details.Vaccination_Certificate_Doc_Name,professional_details.PCC,professional_details.PCC_Doc_Name,professional_details.Nationality,professional_details.Retainership, case WHEN curdate() between STR_TO_DATE(project_details.Estimated_Date_Of_Commencement, '%d/%m/%Y') and STR_TO_DATE(project_details.Estimated_Project_Completion_Month, '%d/%m/%Y') THEN 'engaged' when curdate() < STR_TO_DATE(project_details.Estimated_Date_Of_Commencement, '%d/%m/%Y') then 'UPCOMING' when curdate() > STR_TO_DATE(project_details.Estimated_Project_Completion_Month, '%d/%m/%Y') then 'COMPLETED' ELSE 'AVAILABLE' end as status from professional_details left join project_details on professional_details.Customer_Name = project_details.Supervisor_Names or professional_details.Customer_Name = project_details.Technician_Names;",
//     (err, data) => {
//       if (err) return res.json(err);
//       return res.json(data);
//     }
//   );
// });

//******************************************professional details put  api *****************************************************

app.put("/api/data/professional_detailsupdation/:id", (req, res) => {
  const professionalId = req.params.id;
  const {
    Customer_Name,
    Designation,
    Retainership,
    Employee_ID,
    Signature,
    Rigs,
    jackingExperience,
    skiddingExperience,
    craneExperience,
    upcomingProjectDuration,
    Fixation_Experience,
    Seaman_Book_Expiry,
    Seaman_Issuing_Country,
    Seaman_Doc,
    Bosiet_Expiry,
    Bosiet_Doc,
    H2s_Expiry,
    H2s_Doc,
    Medical_Expiry,
    Medical_Doc,
    Insurance_Expiry,
    Insurance_Doc,
    SNT_Eye_Test_Expiry,
    SNT_Eye_Test_Doc,
    Yellow_Fever_Expiry,
    Yellow_Fever_Doc,
    CV_File,
    Passport_Expiry,
    Passport_Issuing_Country,
    Passport_Doc,
    Active_Visas_One,
    Active_Visas_Two,
    Active_Visas_Three,
    Active_Visas_Four,
    Active_Visas_Five,
    Active_Visas_Six,
    Active_Visas_One_Expiry,
    Active_Visas_Two_Expiry,
    Active_Visas_Three_Expiry,
    Active_Visas_Four_Expiry,
    Active_Visas_Five_Expiry,
    Active_Visas_Six_Expiry,
    Active_Visas_One_Doc,
    Active_Visas_Two_Doc,
    Active_Visas_Three_Doc,
    Active_Visas_Four_Doc,
    Active_Visas_Five_Doc,
    Active_Visas_Six_Doc,
    Signature_Doc_Name,
    Seaman_Doc_Name,
    Bosiet_Doc_Name,
    H2S_Doc_Name,
    Medical_Doc_Name,
    Insurance_Doc_Name,
    Snt_Doc_Name,
    Yellow_Fever_Doc_name,
    Passport_Doc_Name,
    Active_Visa1_Doc_Name,
    Active_Visa2_Doc_Name,
    Active_Visa3_Doc_Name,
    Active_Visa4_Doc_Name,
    Active_Visa5_Doc_Name,
    Active_Visa6_Doc_Name,
    Photo_Upload,
    Photo_Upload_Doc_Name,
    Vaccination_Certificate,
    PCC,
    Vaccination_Certificate_Doc_Name,
    PCC_Doc_Name,
    Nationality,
  } = req.body;

  const updatedValues = {
    Customer_Name,
    Designation,
    Retainership,
    Employee_ID,
    Signature,
    Rigs,
    jackingExperience,
    skiddingExperience,
    craneExperience,
    upcomingProjectDuration,
    Fixation_Experience,
    Seaman_Book_Expiry,
    Seaman_Issuing_Country,
    Seaman_Doc,
    Bosiet_Expiry,
    Bosiet_Doc,
    H2s_Expiry,
    H2s_Doc,
    Medical_Expiry,
    Medical_Doc,
    Insurance_Expiry,
    Insurance_Doc,
    SNT_Eye_Test_Expiry,
    SNT_Eye_Test_Doc,
    Yellow_Fever_Expiry,
    Yellow_Fever_Doc,
    CV_File,
    Passport_Expiry,
    Passport_Issuing_Country,
    Passport_Doc,
    Active_Visas_One,
    Active_Visas_Two,
    Active_Visas_Three,
    Active_Visas_Four,
    Active_Visas_Five,
    Active_Visas_Six,
    Active_Visas_One_Expiry,
    Active_Visas_Two_Expiry,
    Active_Visas_Three_Expiry,
    Active_Visas_Four_Expiry,
    Active_Visas_Five_Expiry,
    Active_Visas_Six_Expiry,
    Active_Visas_One_Doc,
    Active_Visas_Two_Doc,
    Active_Visas_Three_Doc,
    Active_Visas_Four_Doc,
    Active_Visas_Five_Doc,
    Active_Visas_Six_Doc,
    Signature_Doc_Name,
    Seaman_Doc_Name,
    Bosiet_Doc_Name,
    H2S_Doc_Name,
    Medical_Doc_Name,
    Insurance_Doc_Name,
    Snt_Doc_Name,
    Yellow_Fever_Doc_name,
    Passport_Doc_Name,
    Active_Visa1_Doc_Name,
    Active_Visa2_Doc_Name,
    Active_Visa3_Doc_Name,
    Active_Visa4_Doc_Name,
    Active_Visa5_Doc_Name,
    Active_Visa6_Doc_Name,
    Photo_Upload,
    Photo_Upload_Doc_Name,
    Vaccination_Certificate,
    PCC,
    Vaccination_Certificate_Doc_Name,
    PCC_Doc_Name,
    Nationality,
  };

  connection.query(
    "UPDATE reference_details.professional_details SET ? WHERE S_No = ?",
    [updatedValues, professionalId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, message: "Data updated successfully" });
      }
    }
  );
});

//*****************************************two columns added in professional details exit date*************** */

//************************************** */
app.put(
  "/api/data/professional_detailsupdation2/:Customer_Name",
  (req, res) => {
    const customerName = req.params.Customer_Name;
    const { KSA_Exit_Date, UAE_Exit_Date } = req.body;

    const updatedValues = {
      KSA_Exit_Date,
      UAE_Exit_Date,
    };
    connection.query(
      "UPDATE reference_details.professional_details SET ? WHERE Customer_Name = ?",
      [updatedValues, customerName],
      (err, result) => {
        if (err) {
          res.send({ err });
        } else {
          res.send({ success: true, message: "Data updated successfully" });
        }
      }
    );
  }
);
//***************************************professional file remove ************ */
app.put("/api/data/professionaldoc_remove", (req, res) => {
  const { S_No } = req.query;
  const { Doc_name, Expiry } = req.body;
  if (!S_No || !Doc_name || !Expiry) {
    return res.status(400).json({ error: "Missing required parameters" });
  }
  connection.query(
    "UPDATE professional_details SET ?? = null, ?? = null WHERE S_No = ?",
    [Doc_name, Expiry, S_No],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      } else {
        res.send("UPDATED");
      }
    }
  );
});

//***********************************rig details patch api */
app.patch("/api/data/rig_details/fileupdate/:s_no", (req, res) => {
  const s_no = req.params.s_no;
  const { details_document_name, details } = req.body;

  const values = { details_document_name, details };

  connection.query(
    "UPDATE reference_details.rig_details set details_document_name=? where s_no=?",
    [values, s_no],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "Failed to update data of files" });
      } else {
        res.send({
          success: true,
          message: "Data updated successfully for files",
          result: result,
        });
      }
    }
  );
});

//*********************patch api professional details******** */
app.patch("/api/data/professional_file_updation/:id", (req, res) => {
  const professionalId = req.params.id;
  const {
    Signature,
    Seaman_Doc,
    Bosiet_Doc,
    H2s_Doc,
    Medical_Doc,
    Insurance_Doc,
    SNT_Eye_Test_Doc,
    // CV_File,
    Passport_Doc,
    Active_Visas_One_Doc,
    Active_Visas_Two_Doc,
    Active_Visas_Three_Doc,
    Active_Visas_Four_Doc,
    Active_Visas_Five_Doc,
    Active_Visas_Six_Doc,

    Signature_Doc_Name,
    Seaman_Doc_Name,
    Bosiet_Doc_Name,
    H2S_Doc_Name,
    Medical_Doc_Name,
    Insurance_Doc_Name,
    Snt_Doc_Name,
    Passport_Doc_Name,
    Active_Visa1_Doc_Name,
    Active_Visa2_Doc_Name,
    Active_Visa3_Doc_Name,
    Active_Visa4_Doc_Name,
    Active_Visa5_Doc_Name,
    Active_Visa6_Doc_Name,
    Photo_Upload,
    Photo_Upload_Doc_Name,
    Vaccination_Certificate,
    PCC,
    Vaccination_Certificate_Doc_Name,
    PCC_Doc_Name,
  } = req.body;

  const updatedValues = {
    Signature,
    Seaman_Doc,
    Bosiet_Doc,
    H2s_Doc,
    Medical_Doc,
    Insurance_Doc,
    SNT_Eye_Test_Doc,
    // CV_File,
    Passport_Doc,
    Active_Visas_One_Doc,
    Active_Visas_Two_Doc,
    Active_Visas_Three_Doc,
    Active_Visas_Four_Doc,
    Active_Visas_Five_Doc,
    Active_Visas_Six_Doc,

    Signature_Doc_Name,
    Seaman_Doc_Name,
    Bosiet_Doc_Name,
    H2S_Doc_Name,
    Medical_Doc_Name,
    Insurance_Doc_Name,
    Snt_Doc_Name,
    Passport_Doc_Name,
    Active_Visa1_Doc_Name,
    Active_Visa2_Doc_Name,
    Active_Visa3_Doc_Name,
    Active_Visa4_Doc_Name,
    Active_Visa5_Doc_Name,
    Active_Visa6_Doc_Name,
    Photo_Upload,
    Photo_Upload_Doc_Name,
    Vaccination_Certificate,
    PCC,
    Vaccination_Certificate_Doc_Name,
    PCC_Doc_Name,
  };

  connection.query(
    "UPDATE reference_details.professional_details SET ? WHERE S_No = ?",
    [updatedValues, professionalId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "Failed to update data of files" });
      } else {
        res.send({
          success: true,
          message: "Data updated successfully for files",
          result: result,
        });
      }
    }
  );
});

//*******************************************rig_details put api */

app.put("/api/data/updaterigdetails/:s_no", (req, res) => {
  const s_no = req.params.s_no;
  const {
    rig_name,
    short_name,
    customer_name,
    details,
    design,
    location,
    hull_no,
    design_2,
    new_group,

    details_document_name,
  } = req.body;

  const updatedValues = {
    rig_name,
    short_name,
    customer_name,
    details,
    design,
    location,
    hull_no,
    design_2,
    new_group,

    details_document_name,
  };

  connection.query(
    "update reference_details.rig_details set ? where s_no=?",
    [updatedValues, s_no],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ sucess: false, message: "Failed to update Data" });
      } else {
        res.send({
          sucess: true,
          message: "Data updated Successfully",
          result: result,
        });
      }
    }
  );
});

// app.put("/api/data/updatelegal/:s_no", (req, res) => {
//   const s_no = req.body.s_no;
//   const country = req.body.country;
//   const File_name_for_legal_requirements =
//     req.body.File_name_for_legal_requirements;
//   const Documents = req.body.Documents;

//   connection.query(
//     "update legal_details SET s_no = ?, country = ?, File_name_for_legal_requirements = ?,Documents = ? WHERE s_no = ?",
//     [s_no, country, File_name_for_legal_requirements, Documents, s_no],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         res.send("UPDATED");
//       }
//     }
//   );
// });

app.put("/api/data/update_legal_details/:s_no", (req, res) => {
  const s_no = req.params.s_no;
  const {
    country,
    File_name_for_legal_requirements,
    Documents,
    Document_Names,
  } = req.body;

  const updatedValues = {
    country,
    File_name_for_legal_requirements,
    Documents,
    Document_Names,
  };

  connection.query(
    "update reference_details.legal_details set ? WHERE s_no = ?",
    [updatedValues, s_no],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({
          success: false,
          message: "Failed to update legal details Data",
        });
      } else {
        res.send({
          success: true,
          message: " updated legal details Data",
          result: result,
        });
      }
    }
  );
});

//*****************patch api legal details */
app.patch("/api/data/legal_details_file_updation/:s_no", (req, res) => {
  const s_no = req.params.s_no;
  const { Document_Names } = req.body;

  const updatedValues = {
    Document_Names,
  };

  connection.query(
    "UPDATE reference_details.legal_details set ? WHERE s_no = ?",
    [updatedValues, s_no],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "Failed to update data of files" });
      } else {
        res.send({
          success: true,
          message: "Data updated successfully for files",
          result: result,
        });
      }
    }
  );
});

app.put("/api/data/updatetools/:id", (req, res) => {
  const Id_No = req.params.id;
  const Item_No = req.body.Item_No;
  const Description = req.body.Description;
  const Manufacturer = req.body.Manufacturer;
  const Model = req.body.Model;
  const Serial_No = req.body.Serial_No;
  const Cal_Date = req.body.Cal_Date;
  // const Due_Date = req.body.Due_Date;
  const Range_Value = req.body.Range_Value;
  const Nominal_Value = req.body.Nominal_Value;
  const Measured_Value = req.body.Measured_Value;
  const Acceptance_Criteria = req.body.Acceptance_Criteria;
  const Frequency = req.body.Frequency;
  const Cert_No = req.body.Cert_No;
  const Status = req.body.Status;
  const Remarks = req.body.Remarks;

  connection.query(
    "update tools_register SET Id_No = ?, Item_No = ?, Description = ?, Manufacturer = ?, Model = ?, Serial_No = ?, Cal_Date = ?, Range_Value = ?,Nominal_Value = ?,Measured_Value = ?,Acceptance_Criteria = ?,Frequency = ?,Cert_No = ?,Status = ?,Remarks = ? WHERE Id_No = ?",
    [
      Id_No,
      Item_No,
      Description,
      Manufacturer,
      Model,
      Serial_No,
      Cal_Date,
      // Due_Date,
      Range_Value,
      Nominal_Value,
      Measured_Value,
      Acceptance_Criteria,
      Frequency,
      Cert_No,
      Status,
      Remarks,
      Id_No,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("UPDATED");
      }
    }
  );
});

//project details api

// app.post('/project_details', (req, res) => {

//     const Sales_Order_No = req.body.Sales_Order_No;
//     const Po_No = req.body.Po_No;
//     const Po_Days = req.body.Po_Days;
//     const Po_Date = req.body.Po_Date;
//     const Quote_No = req.body.Quote_No;
//     const Sales_Order_Date = req.body.Sales_Order_Date;
//     const Service_Component = req.body.Service_Component;
//     const Document_Date = req.body.Document_Date;
//     const Rig_Name = req.body.Rig_Name;
//     const Customer_Name = req.body.Customer_Name;
//     const Rig_Location = req.body.Rig_Location;
//     const Rig_Type = req.body.Rig_Type;
//     const Estimated_Date_Of_Commencement = req.body.Estimated_Date_Of_Commencement;
//     const Estimated_Project_Completion_Month = req.body.Estimated_Project_Completion_Month;
//     const Supervisor_Names = req.body.Supervisor_Names;

//     const Technician_Names = req.body.Technician_Names;

//     const Tool1  = req.body.Tool1;
//     const Item_ID1 = req.body.Item_ID1;
//     const Make1 = req.body.Make1;
//     const Model1 = req.body.Model1;
//     const Serial_Number1 = req.body.Serial_Number1;
//     const Calibration_Date1 = req.body.Calibration_Date1;
//     const Calibration_Due_Date1 = req.body.Calibration_Due_Date1;
//     const Acceptance_Criteria1 = req.body.Acceptance_Criteria1;
//     const Tool2  = req.body.Tool2;
//     const Item_ID2 = req.body.Item_ID2;
//     const Make2 = req.body.Make52;
//     const Model2 = req.body.Model2;
//     const Serial_Number2 = req.body.Serial_Number2;
//     const Calibration_Date2 = req.body.Calibration_Date2;
//     const Calibration_Due_Date2 = req.body.Calibration_Due_Date2;
//     const Acceptance_Criteria2 = req.body.Acceptance_Criteria2;

//     connection.query('INSERT INTO project_details (Sales_Order_No, Po_No, Po_Days, Po_Date,Quote_No, Sales_Order_Date, Service_Component,Document_Date ,Rig_Name, Customer_Name, Rig_Location, Rig_Type, Estimated_Date_Of_Commencement, Estimated_Project_Completion_Month,Supervisor_Names,Technician_Names,Tool1, Item_ID1,Make1,Model1,Serial_Number1,Calibration_Date1,Calibration_Due_Date1,Acceptance_Criteria1,Tool2,Item_ID2,Make2,Model2,Serial_Number2,Calibration_Date2,Calibration_Due_Date2,Acceptance_Criteria2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?,? ,? ,?)', [Sales_Order_No, Po_No, Po_Days,Po_Date, Quote_No, Sales_Order_Date, Service_Component, Document_Date, Rig_Name, Customer_Name, Rig_Location, Rig_Type, Estimated_Date_Of_Commencement, Estimated_Project_Completion_Month,Supervisor_Names,Technician_Names,Tool1,Item_ID1,Make1,Model1,Serial_Number1,Calibration_Date1,Calibration_Due_Date1,Acceptance_Criteria1,Tool2,Item_ID2,Make2,Model2,Serial_Number2,Calibration_Date2,Calibration_Due_Date2,Acceptance_Criteria2], (err, result) => {
//         if (err) {
//             console.log(err)
//         } else {
//             res.send({success : true,message : "Data inserted Successfully"})
//         }
//     })
// })

// ________________________________________________project details update for step 2 and 3____________________________________________
// app.put("/api/data/project_details/update/:ID_No", (req, res) => {
//   const projectId = req.params.ID_No;

//   const {
//     Sales_Order_No,
//     Po_No,
//     Po_Days,
//     Po_Date,
//     Quote_No,
//     Sales_Order_Date,
//     Service_Component,
//     Document_Date,
//     Rig_Name,
//     Customer_Name,
//     Rig_Location,
//     Rig_Type,
//     Estimated_Date_Of_Commencement,
//     Estimated_Project_Completion_Month,
//     Supervisor_Names,
//     Technician_Names,
//     Tool1,
//     Item_ID1,
//     Make1,
//     Model1,
//     Serial_Number1,
//     Calibration_Date1,
//     Calibration_Due_Date1,
//     Acceptance_Criteria1,
//     Tool2,
//     Item_ID2,
//     Make2,
//     Model2,
//     Serial_Number2,
//     Calibration_Date2,
//     Calibration_Due_Date2,
//     Acceptance_Criteria2,
//   } = req.body;

//   const updatedValues = {
//     Sales_Order_No,
//     Po_No,
//     Po_Days,
//     Po_Date,
//     Quote_No,
//     Sales_Order_Date,
//     Service_Component,
//     Document_Date,
//     Rig_Name,
//     Customer_Name,
//     Rig_Location,
//     Rig_Type,
//     Estimated_Date_Of_Commencement,
//     Estimated_Project_Completion_Month,
//     Supervisor_Names,
//     Technician_Names,
//     Tool1,
//     Item_ID1,
//     Make1,
//     Model1,
//     Serial_Number1,
//     Calibration_Date1,
//     Calibration_Due_Date1,
//     Acceptance_Criteria1,
//     Tool2,
//     Item_ID2,
//     Make2,
//     Model2,
//     Serial_Number2,
//     Calibration_Date2,
//     Calibration_Due_Date2,
//     Acceptance_Criteria2,
//   };

//   connection.query(
//     "UPDATE project_details SET ? WHERE ID_No = ?",
//     [updatedValues, projectId],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.send({ success: false, message: "Failed to update data" });
//       } else {
//         res.send({ success: true, message: "Data updated successfully" });
//       }
//     }
//   );
// });

const storage8 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const noSpaceInName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${noSpaceInName}`);
  },
});

const upload8 = multer({ storage: storage8 });

app.put(
  "/api/data/project_details/update_file/:id",
  upload8.single("Work_Plan"),
  (req, res) => {
    const projectId = req.params.id;
    const workplanpath = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;

    if (!req.file) {
      return res.json({
        message: "No file was uploaded for update for workplan",
      });
    }

    connection.query(
      "UPDATE project_details SET Work_Plan_Doc = ? WHERE ID_No = ?",
      [workplanpath, projectId],
      (error, result) => {
        if (error) {
          console.log("Error updating record:", error);
          res.status(500).json({ message: error });
        } else {
          res.json({ message: "File URL updated in the database" });
        }
      }
    );
  }
);

app.put("/api/data/project_details/update/:id", (req, res) => {
  const projectId = req.params.id;

  const {
    Sales_Order_No,
    Po_No,
    Po_Days,
    Po_Date,
    Quote_No,
    Sales_Order_Date,
    Service_Component,
    Document_Date,
    Ops_Engineer,
    Rig_Name,
    Customer_Name,
    Rig_Location,
    Rig_Type,
    Estimated_Date_Of_Commencement,
    Estimated_Project_Completion_Month,
    Supervisor_Names,
    Technician_Names,
    Trainee_Names,
    Tool1,
    Item_ID1,
    Make1,
    Model1,
    Serial_Number1,
    Calibration_Date1,
    Calibration_Due_Date1,
    Acceptance_Criteria1,
    Tool2,
    Item_ID2,
    Make2,
    Model2,
    Serial_Number2,
    Calibration_Date2,
    Calibration_Due_Date2,
    Acceptance_Criteria2,
    Team_Size,
    Old_Commence_Date,
    Time_Stamp_Commence,
  } = req.body;

  const updatedValues = {
    Sales_Order_No,
    Po_No,
    Po_Days,
    Po_Date,
    Quote_No,
    Sales_Order_Date,
    Service_Component,
    Document_Date,
    Ops_Engineer,
    Rig_Name,
    Customer_Name,
    Rig_Location,
    Rig_Type,
    Estimated_Date_Of_Commencement,
    Estimated_Project_Completion_Month,
    Supervisor_Names,
    Technician_Names,
    Trainee_Names,
    Tool1,
    Item_ID1,
    Make1,
    Model1,
    Serial_Number1,
    Calibration_Date1,
    Calibration_Due_Date1,
    Acceptance_Criteria1,
    Tool2,
    Item_ID2,
    Make2,
    Model2,
    Serial_Number2,
    Calibration_Date2,
    Calibration_Due_Date2,
    Acceptance_Criteria2,
    Team_Size,
    Old_Commence_Date,
    Time_Stamp_Commence,
  };

  connection.query(
    "UPDATE project_details SET ? WHERE ID_No = ?",
    [updatedValues, projectId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "Failed to update data" });
      } else {
        res.send({ success: true, message: "Data updated successfully" });
      }
    }
  );
});

app.get("/api/data/trainee_customer_names", (req, res) => {
  connection.query(
    'SELECT Customer_Name FROM professional_details WHERE Designation = "Trainee"',
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error receiving trainee customer names");
      } else {
        const customerNames = results.map((result) => result.Customer_Name);
        res.send(customerNames);
      }
    }
  );
});

// ________________________________________________project details post after step 1____________________________________________

app.post("/api/data/project_details", (req, res) => {
  const {
    ID_No,
    Sales_Order_No,
    Po_No,
    Po_Days,
    Po_Date,
    Quote_No,
    Sales_Order_Date,
    Service_Component,
    Document_Date,
    Ops_Engineer,
    Rig_Name,
    Customer_Name,
    Rig_Location,
    Rig_Type,
    Estimated_Date_Of_Commencement,
    Estimated_Project_Completion_Month,
    Supervisor_Names,
    Technician_Names,
    Tool1,
    Item_ID1,
    Make1,
    Model1,
    Serial_Number1,
    Calibration_Date1,
    Calibration_Due_Date1,
    Acceptance_Criteria1,
    Tool2,
    Item_ID2,
    Make2,
    Model2,
    Serial_Number2,
    Calibration_Date2,
    Calibration_Due_Date2,
    Acceptance_Criteria2,
    Team_Size,
  } = req.body;

  const values = {
    ID_No,
    Sales_Order_No,
    Po_No,
    Po_Days,
    Po_Date,
    Quote_No,
    Sales_Order_Date,
    Service_Component,
    Document_Date,
    Ops_Engineer,
    Rig_Name,
    Customer_Name,
    Rig_Location,
    Rig_Type,
    Estimated_Date_Of_Commencement,
    Estimated_Project_Completion_Month,
    Supervisor_Names,
    Technician_Names,
    Tool1,
    Item_ID1,
    Make1,
    Model1,
    Serial_Number1,
    Calibration_Date1,
    Calibration_Due_Date1,
    Acceptance_Criteria1,
    Tool2,
    Item_ID2,
    Make2,
    Model2,
    Serial_Number2,
    Calibration_Date2,
    Calibration_Due_Date2,
    Acceptance_Criteria2,
    Team_Size,
  };

  connection.query(
    "INSERT INTO project_details SET ?",
    values,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "Failed to insert data" });
      } else {
        const projectId = result.insertId;
        res.send({
          success: true,
          message: "Data inserted successfully",
          ID_No: projectId,
        });
      }
    }
  );
});

//*********************************project details delete api */
app.delete("/api/data/project_details/delete/:id", (req, res) => {
  const projectId = req.params.id;

  connection.query(
    "DELETE FROM reference_details.project_details WHERE ID_No = ?",
    [projectId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "Failed to delete data" });
      } else {
        res.send({ success: true, message: "Data deleted successfully" });
      }
    }
  );
});
//********************* */

app.get("/api/data/get_projectDetails_and_checklist_data", (req, res) => {
  connection.query(
    "SELECT reference_details.project_details.*, reference_details.project_checklist.* FROM reference_details.project_details INNER JOIN reference_details.project_checklist ON reference_details.project_details.ID_No = reference_details.project_checklist.ID_No",
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "Failed to Join Table" });
      } else {
        res.send({
          success: true,
          message: "Joined Tables successfully",
          data: result,
        });
      }
    }
  );
});

//project checklist
app.post("/api/data/project_checklist", (req, res) => {
  const {
    ID_No,
    Sales_Order_No,
    Item1,
    Issue1,
    Item2,
    Issue2,
    Item3,
    Issue3,
    Item4,
    Issue4,
    Item5,
    Issue5,
    Item6,
    Issue6,
    Item7,
    Issue7,
    Item8,
    Issue8,
    Item9,
    Issue9,
    Item10,
    Issue10,
    Item11,
    Issue11,
    Item12,
    Issue12,
    Item13,
    Issue13,
    Item14,
    Issue14,
    Item15,
    Issue15,
    Item16,
    Issue16,
    Item17,
    Issue17,
    Item18,
    Issue18,
    Item19,
    Issue19,
    Item20,
    Issue20,
    Item21,
    Issue21,
    Item22,
    Issue22,
    Item23,
    Issue23,
    Item24,
    Issue24,
    Item25,
    Issue25,
    Item26,
    Issue26,
    Item27,
    Issue27,
    Item28,
    Issue28,
    Item29,
    Issue29,
    Item30,
    Issue30,
    Item31,
    Issue31,
    Item32,
    Issue32,
    Item33,
    Issue33,
    Item34,
    Issue34,
    Item35,
    Issue35,
    Item36,
    Issue36,
    Item37,
    Issue37,
    Item38,
    Issue38,
    Item39,
    Issue39,
    Item40,
    Issue40,
    Paused_Status,
  } = req.body;

  const values = {
    ID_No,
    Sales_Order_No,
    Item1,
    Issue1,
    Item2,
    Issue2,
    Item3,
    Issue3,
    Item4,
    Issue4,
    Item5,
    Issue5,
    Item6,
    Issue6,
    Item7,
    Issue7,
    Item8,
    Issue8,
    Item9,
    Issue9,
    Item10,
    Issue10,
    Item11,
    Issue11,
    Item12,
    Issue12,
    Item13,
    Issue13,
    Item14,
    Issue14,
    Item15,
    Issue15,
    Item16,
    Issue16,
    Item17,
    Issue17,
    Item18,
    Issue18,
    Item19,
    Issue19,
    Item20,
    Issue20,
    Item21,
    Issue21,
    Item22,
    Issue22,
    Item23,
    Issue23,
    Item24,
    Issue24,
    Item25,
    Issue25,
    Item26,
    Issue26,
    Item27,
    Issue27,
    Item28,
    Issue28,
    Item29,
    Issue29,
    Item30,
    Issue30,
    Item31,
    Issue31,
    Item32,
    Issue32,
    Item33,
    Issue33,
    Item34,
    Issue34,
    Item35,
    Issue35,
    Item36,
    Issue36,
    Item37,
    Issue37,
    Item38,
    Issue38,
    Item39,
    Issue39,
    Item40,
    Issue40,
    Paused_Status,
  };

  connection.query(
    "INSERT INTO reference_details.project_checklist SET ?",
    values,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "Failed to insert data" });
      } else {
        res.send({ success: true, message: "Datainserted successfully" });
      }
    }
  );
});

//get api
app.get("/api/data/project-checklistgetdetails", (req, res) => {
  connection.query(
    "SELECT * FROM reference_details.project_checklist",
    (err, rows) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "Failed to retrieve data" });
      } else {
        res.send({ success: true, data: rows });
      }
    }
  );
});

//put api

app.put("/api/data/project_checklist/:ID_No", (req, res) => {
  const ID_No = req.params.ID_No;
  const {
    Sales_Order_No,
    Item1,
    Issue1,
    Item2,
    Issue2,
    Item3,
    Issue3,
    Item4,
    Issue4,
    Item5,
    Issue5,
    Item6,
    Issue6,
    Item7,
    Issue7,
    Item8,
    Issue8,
    Item9,
    Issue9,
    Item10,
    Issue10,
    Item11,
    Issue11,
    Item12,
    Issue12,
    Item13,
    Issue13,
    Item14,
    Issue14,
    Item15,
    Issue15,
    Item16,
    Issue16,
    Item17,
    Issue17,
    Item18,
    Issue18,
    Item19,
    Issue19,
    Item20,
    Issue20,
    Item21,
    Issue21,
    Item22,
    Issue22,
    Item23,
    Issue23,
    Item24,
    Issue24,
    Item25,
    Issue25,
    Item26,
    Issue26,
    Item27,
    Issue27,
    Item28,
    Issue28,
    Item29,
    Issue29,
    Item30,
    Issue30,
    Item31,
    Issue31,
    Item32,
    Issue32,
    Item33,
    Issue33,
    Item34,
    Issue34,
    Item35,
    Issue35,
    Item36,
    Issue36,
    Item37,
    Issue37,
    Item38,
    Issue38,
    Item39,
    Issue39,
    Item40,
    Issue40,
    Paused_Status,
  } = req.body;

  const updatedValues = {
    Sales_Order_No,
    Item1,
    Issue1,
    Item2,
    Issue2,
    Item3,
    Issue3,
    Item4,
    Issue4,
    Item5,
    Issue5,
    Item6,
    Issue6,
    Item7,
    Issue7,
    Item8,
    Issue8,
    Item9,
    Issue9,
    Item10,
    Issue10,
    Item11,
    Issue11,
    Item12,
    Issue12,
    Item13,
    Issue13,
    Item14,
    Issue14,
    Item15,
    Issue15,
    Item16,
    Issue16,
    Item17,
    Issue17,
    Item18,
    Issue18,
    Item19,
    Issue19,
    Item20,
    Issue20,
    Item21,
    Issue21,
    Item22,
    Issue22,
    Item23,
    Issue23,
    Item24,
    Issue24,
    Item25,
    Issue25,
    Item26,
    Issue26,
    Item27,
    Issue27,
    Item28,
    Issue28,
    Item29,
    Issue29,
    Item30,
    Issue30,
    Item31,
    Issue31,
    Item32,
    Issue32,
    Item33,
    Issue33,
    Item34,
    Issue34,
    Item35,
    Issue35,
    Item36,
    Issue36,
    Item37,
    Issue37,
    Item38,
    Issue38,
    Item39,
    Issue39,
    Item40,
    Issue40,
    Paused_Status,
  };

  connection.query(
    "UPDATE reference_details.project_checklist SET ? WHERE ID_No = ?",
    [updatedValues, ID_No],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "Failed to update data" });
      } else {
        res.send({ success: true, message: "Data updated successfully" });
      }
    }
  );
});
// Update the table name and column names in the SQL query below

// app.post("/api/data/supervisor_checklist",(req,res)=>{
//   const{
//     ID_No
//   }
// })
//get api
app.get("/api/data/getproject_details", (req, res) => {
  connection.query("SELECT * FROM project_details", (err, results) => {
    if (err) {
      console.log(err);
      res.send({ success: false, message: "Error fetching data" });
    } else {
      res.send({ success: true, data: results });
    }
  });
});

//get for formdata 1
app.get("/api/data/project_details/formdata1", (req, res) => {
  connection.query(
    "SELECT Sales_Order_No, Po_No, Po_Days, Po_Date, Quote_No, Sales_Order_Date, Service_Component, Document_Date, Rig_Name, Customer_Name, Rig_Location, Rig_Type, Estimated_Date_Of_Commencement, Estimated_Project_Completion_Month FROM project_details",
    (err, results) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "Error fetching data" });
      } else {
        res.send({ success: true, data: results });
      }
    }
  );
});

//get api for formdata2

app.get("/api/data/project_details/formdata2", (req, res) => {
  const { Supervisor_Names, Technician_Names } = req.query;

  let query = "SELECT Supervisor_Names, Technician_Names FROM project_details";

  // Check if supervisor and technicians parameters are provided
  if (Supervisor_Names && Technician_Names) {
    query += ` WHERE Supervisor_Names = '${Supervisor_Names}' AND Technician_Names = '${Technician_Names}'`;
  } else if (Supervisor_Names) {
    query += ` WHERE Supervisor_Names = '${Supervisor_Names}'`;
  } else if (Technician_Names) {
    query += ` WHERE Technician_Names = '${Technician_Names}'`;
  }

  connection.query(query, (err, results) => {
    if (err) {
      console.log(err);
      res.send({ success: false, message: "Error fetching data" });
    } else {
      res.send({ success: true, data: results });
    }
  });
});

//get api to fetch data from formdata3

app.get("/api/data/project_details/formdata3", (req, res) => {
  connection.query(
    "SELECT Tool1, Item_ID1, Make1, Model1, Serial_Number1, Calibration_Date1, Calibration_Due_Date1, Acceptance_Criteria1, Tool2, Item_ID2, Make2, Model2, Serial_Number2, Calibration_Date2, Calibration_Due_Date2, Acceptance_Criteria2 FROM project_details",
    (err, results) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "Error fetching data" });
      } else {
        res.send({ success: true, data: results });
      }
    }
  );
});

//get api based on sales order no
// app.get('/project_details/:salesOrderNo', (req, res) => {
//   const Sales_Order_No = req.params.Sales_Order_No;

//   connection.query('SELECT * FROM project_details WHERE Sales_Order_No = ?', [salesOrderNo], (err, results) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send({ success: false, message: 'Error fetching data' });
//     } else {
//       res.send({ success: true, data: results });
//     }
//   });
// });

//update api for project details
// app.put('/project_details/update', (req, res) => {

//     const Sales_Order_No = req.body.Sales_Order_No;
//     const Po_No = req.body.Po_No;
//     const Po_Days = req.body.Po_Days;
//     const Quote_No = req.body.Quote_No;
//     const Sales_Order_Date = req.body.Sales_Order_Date;
//     const Service_Component = req.body.Service_Component;
//     const Nature_Of_Service = req.body.Nature_Of_Service;
//     const Rig_Name = req.body.Rig_Name;
//     const Customer_Name = req.body.Customer_Name;
//     const Rig_Location = req.body.Rig_Location;
//     const Rig_Type = req.body.Rig_Type;
//     const Estimated_Date_Of_Commencement = req.body.Estimated_Date_Of_Commencement;
//     const Estimated_Project_Completion_Month = req.body.Estimated_Project_Completion_Month;
//     const Torque_Wrench = req.body.Torque_Wrench;
//     const Dial_Indicator = req.body.Dial_Indicator;
//     const Team_Member  = req.body.Team_Member;
//     const Designation = req.body.Designation;

//     connection.query('UPDATE project_details SET Sales_Order_No = ?, Po_No = ?, Po_Days = ?, Quote_No = ?, Sales_Order_Date = ?, Service_Component = ?, Nature_Of_Service = ?, Rig_Name = ?, Customer_Name = ?, Rig_Location = ?  Rig_Type = ?, Estimated_Date_Of_Commencement = ?, Estimated_Project_Completion_Month = ?, Torque_Wrench = ?, Dial_Indicator WHERE ID_No = ?', [ID_no, rig_name, short_name, customer_name, details, design, location, hull_no, design_2, new_group, ID_No], (err, result) => {
//         if (err) {
//             console.log(err)
//         } else {
//             res.send({sucess : true,message : "Data updated Successfully"})
//         }
//     })
// })

//For deleting the details from table

app.delete("/api/data/post", (req, res) => {
  const S_No = req.query.S_No;
  connection.query(
    "DELETE FROM rig_details WHERE S_No = ?",
    [S_No],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("DELETED");
      }
    }
  );
});

app.delete("/api/data/post1", (req, res) => {
  const S_No = req.query.S_No;
  connection.query(
    "DELETE FROM legal_details WHERE S_No = ?",
    [S_No],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("DELETED");
      }
    }
  );
});

app.delete("/api/data/post2", (req, res) => {
  const S_No = req.query.S_No;
  connection.query(
    "DELETE FROM professional_details WHERE S_No = ?",
    [S_No],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("DELETED");
      }
    }
  );
});

app.delete("/api/data/post3", (req, res) => {
  const Id_No = req.query.Id_No;
  connection.query(
    "DELETE FROM tools_register WHERE Id_No = ?",
    [Id_No],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("DELETED");
      }
    }
  );
});

app.get("/", (req, res) => {
  res.json("hello this from backened");
});

app.get("/api/data/getrig_details", (req, res) => {
  const query = "SELECT * FROM rig_details";
  connection.query((err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
//workshop
app.get("/api/data/timesheetwork_data", (req, res) => {
  connection.query("SELECT * FROM workshop_timesheet", (err, results) => {
    if (err) {
      console.log(err);
      res.send({ success: false, message: "Error fetching data" });
    } else {
      res.send({ success: true, data: results });
    }
  });
});

app.put("/api/data/workshoptimesheet_update", (req, res) => {
  const S_No = req.query.S_No;
  const payload = req.body;
  connection.query(
    "UPDATE reference_details.workshop_timesheet SET ? WHERE S_No = ?",
    [payload, S_No],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, message: "updated Sucessfully" });
      }
    }
  );
});

app.post("/api/data/workshoptimesheet_insert", (req, res) => {
  const payload = req.body;
  connection.query(
    "INSERT INTO reference_details.workshop_timesheet SET ?",
    payload,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, message: "Posted Sucessfully" });
      }
    }
  );
});

app.get("/api/data/techworkshop_data", (req, res) => {
  connection.query("SELECT * FROM tech_workshop", (err, results) => {
    if (err) {
      console.log(err);
      res.send({ success: false, message: "Error fetching data" });
    } else {
      res.send({ success: true, data: results });
    }
  });
});

app.get("/api/data/toolbox_data", (req, res) => {
  connection.query("SELECT * FROM toolbox_talk", (err, results) => {
    if (err) {
      console.log(err);
      res.send({ success: false, message: "Error fetching data" });
    } else {
      res.send({ success: true, data: results });
    }
  });
});

app.put("/api/data/techworkshop_update", (req, res) => {
  const { Supervisor, Technicians, Trainee } = req.body;

  const updated = {
    Supervisor,
    Technicians,
    Trainee,
  };

  connection.query(
    "UPDATE tech_workshop SET ? WHERE S_No = 1",
    [updated],
    (err, results) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, message: "Data updated successfully" });
      }
    }
  );
});

app.get("/api/data/trainee_customer_names", (req, res) => {
  connection.query(
    'SELECT Customer_Name FROM professional_details WHERE Designation = "Trainee"',
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error receiving trainee customer names");
      } else {
        const customerNames = results.map((result) => result.Customer_Name);
        res.send(customerNames);
      }
    }
  );
});

// toolbox talk

app.get("/api/data/toolbox_talk_get", (req, res) => {
  const seldate = req.query.seldate;
  connection.query(
    "SELECT * FROM reference_details.toolbox_talk WHERE Date = ?",
    seldate,
    (err, results) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, data: results });
      }
    }
  );
});

app.post("/api/data/toolbox_talk_insert", (req, res) => {
  const payload = req.body;
  connection.query(
    "INSERT INTO reference_details.toolbox_talk SET ?",
    payload,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, message: "Posted Sucessfully" });
      }
    }
  );
});

app.put("/api/data/toolbox_talk_update", (req, res) => {
  const s_no = req.query.s_no;
  const payload = req.body;
  connection.query(
    "UPDATE reference_details.toolbox_talk SET ? WHERE S_no = ?",
    [payload, s_no],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, message: "updated Sucessfully" });
      }
    }
  );
});

app.delete("/api/data/toolbox_talk_remove/:id", (req, res) => {
  const S_no = req.params.id;  // Change from req.query.S_no to req.params.id
  // Create a payload with null values for all fields
  // const payload = {
  //   Task_description: null,
  //   Project_so: null,
  //   Team_assigned: null,
  //   Target_units: null,
  //   UOM: null,
  //   Additional_Tools: null,
  // };

  let deleteQuery = `delete from reference_details.toolbox_talk where S_no = ${S_no};`

  connection.query(
    deleteQuery,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, message: "updated Successfully" });
      }
    }
  );
});



//for login page
app.post("/api/data/loginpage", (req, res) => {
  const { Useremail, Password } = req.body;
  console.log("Useremail", Useremail);
  console.log("Password", Password);
  const query = `SELECT * FROM loginpage WHERE Useremail = '${Useremail}' AND password = '${Password}'`;

  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("results", results);
      if (results.length > 0) {
        // user found, redirect to admin dashboard page
        res.send(results.map((result) => result));
      } else {
        res.status(401).send("Unauthorized");
      }
    }
  });
});

//admin permission

app.get("/api/data/adminpermission_user", (req, res) => {
  connection.query(
    "SELECT S_No, Useremail, Name, `Group` FROM loginpage",
    (err, results) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "Error fetching admin data" });
      } else {
        const users = results.map((result) => result);
        res.send(users);
      }
    }
  );
});

app.post("/api/data/adminpermission_add", (req, res) => {
  const { Useremail, Password, Name, Group } = req.body;

  const values = {
    Useremail,
    Password,
    Name,
    Group,
  };

  connection.query(
    "INSERT INTO reference_details.loginpage SET ?",
    values,
    (err, results) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, message: "Posted Sucessfully" });
      }
    }
  );
});

app.delete("/api/data/adminpermission_delete", (req, res) => {
  const S_No = req.query.S_No;
  connection.query(
    "DELETE FROM loginpage WHERE S_No = ?",
    [S_No],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send("USER DELETED ");
      }
    }
  );
});

app.put("/api/data/adminpermission_update", (req, res) => {
  const S_No = req.query.S_No;
  const { Useremail, Name, Group } = req.body;

  const updated = {
    Useremail,
    Name,
    Group,
  };

  connection.query(
    "UPDATE loginpage SET ? WHERE S_No = ?",
    [updated, S_No],
    (err, results) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "Failed to update data" });
      } else {
        res.send({ success: true, message: "Data updated successfully" });
      }
    }
  );
});

app.get("/api/data/adminpermission_group", (req, res) => {
  connection.query("SELECT * FROM groupfeatures", (err, results) => {
    if (err) {
      console.log(err);
      res.send({ success: false, message: "Error fetching admin group data" });
    } else {
      const res1 = results.map((result) => result);
      res.send(res1);
    }
  });
});

app.post("/api/data/adminpermission_group_add", (req, res) => {
  const { Group_Name, Header_Name, Feature_Name, Access } = req.body;

  const values = {
    Group_Name,
    Header_Name,
    Feature_Name,
    Access,
  };

  connection.query(
    "INSERT INTO groupfeatures SET ?",
    values,
    (err, results) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, message: "Group Posted Sucessfully" });
      }
    }
  );
});

app.put("/api/data/adminpermission_group_update", async (req, res) => {
  const updates = req.body;

  try {
    for (const update of updates) {
      const Sno = update.Sno;
      const { Group_Name, Header_Name, Feature_Name, Access } = update;

      const updated = {
        Group_Name,
        Header_Name,
        Feature_Name,
        Access,
      };

      // Use await to ensure each update is processed sequentially
      await new Promise((resolve, reject) => {
        connection.query(
          "UPDATE groupfeatures SET ? WHERE Sno = ?",
          [updated, Sno],
          (err, results) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    }

    res.send({
      success: true,
      message: "Admin group data updated successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update admin group data" });
  }
});

app.get("/api/data/adminpermission_headerandfeatures", (req, res) => {
  connection.query("SELECT * FROM headerandfeatures", (err, results) => {
    if (err) {
      console.log(err);
      res.send({ success: false, message: "Error fetching admin data" });
    } else {
      const res1 = results.map((result) => result);
      res.send(res1);
    }
  });
});

// ------------------------ supervisor checklist api --------------------

app.post("/api/data/supervisor_checklist_post", (req, res) => {
  const {
    ID_No,
    OEM_Manual_Radio,
    OEM_Manual_Comments,
    SOW_Radio,
    SOW_Comments,
    Legal_Radio,
    Legal_Comments,
    Tools_Radio,
    Tools_Comments,
    Risk_Assessment_Radio,
    Risk_Assessment_Comments,
    Job_Records_Radio,
    Job_Records_Comments,
    Workplan_Radio,
    Workplan_Comments,
    Mobilization_Plan_Radio,
    Mobilization_Plan_Comments,
  } = req.body;

  const values = {
    ID_No,
    OEM_Manual_Radio,
    OEM_Manual_Comments,
    SOW_Radio,
    SOW_Comments,
    Legal_Radio,
    Legal_Comments,
    Tools_Radio,
    Tools_Comments,
    Risk_Assessment_Radio,
    Risk_Assessment_Comments,
    Job_Records_Radio,
    Job_Records_Comments,
    Workplan_Radio,
    Workplan_Comments,
    Mobilization_Plan_Radio,
    Mobilization_Plan_Comments,
  };

  connection.query(
    "INSERT INTO reference_details.supervisor_checklist SET ?",
    values,
    (err, results) => {
      if (err) {
        console.log(err);
        res.send({
          success: false,
          message: "Failed to insert data in supervisor checklist",
        });
      } else {
        res.send({
          success: true,
          message: "Data inserted successfully in supervisor checklist",
        });
      }
    }
  );
});

app.put("/api/data/put_super_checklist/:id", (req, res) => {
  const ID_No = req.params.id;

  const {
    OEM_Manual_Radio,
    OEM_Manual_Comments,
    SOW_Radio,
    SOW_Comments,
    Legal_Radio,
    Legal_Comments,
    Tools_Radio,
    Tools_Comments,
    Risk_Assessment_Radio,
    Risk_Assessment_Comments,
    Job_Records_Radio,
    Job_Records_Comments,
    Workplan_Radio,
    Workplan_Comments,
    Mobilization_Plan_Radio,
    Mobilization_Plan_Comments,
  } = req.body;

  const values = {
    OEM_Manual_Radio,
    OEM_Manual_Comments,
    SOW_Radio,
    SOW_Comments,
    Legal_Radio,
    Legal_Comments,
    Tools_Radio,
    Tools_Comments,
    Risk_Assessment_Radio,
    Risk_Assessment_Comments,
    Job_Records_Radio,
    Job_Records_Comments,
    Workplan_Radio,
    Workplan_Comments,
    Mobilization_Plan_Radio,
    Mobilization_Plan_Comments,
  };

  connection.query(
    "UPDATE reference_details.supervisor_checklist SET ? WHERE ID_No = ?",
    [values, ID_No],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({
          success: false,
          message: "failed to update supervisor checklist data",
        });
      } else {
        res.send({
          success: true,
          message: "data updated successfully in supervisor checklist",
          data: result,
        });
      }
    }
  );
});

app.get("/api/data/get_Super_Checklist_Data", (req, res) => {
  connection.query(
    "SELECT * FROM reference_details.supervisor_checklist",
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({
          success: false,
          message: "failed to get supervisor checklist data",
        });
      } else {
        res.send({
          success: true,
          message: "successfully fetched data of supervisor checklist",
          data: result,
        });
      }
    }
  );
});

app.post("/api/data/sparesmobilization_data", (req, res) => {
  const {
    S_No,
    ID_No,
    Location,
    Part_Number,
    Item_Name,
    Units,
    Quantity_Required,
    Available_Quantity_On_Rig,
    Status,
  } = req.body;

  const values = {
    S_No,
    ID_No,
    Location,
    Part_Number,
    Item_Name,
    Units,
    Quantity_Required,
    Available_Quantity_On_Rig,
    Status,
  };

  connection.query(
    "INSERT INTO reference_details.spares_mobilization SET ?",
    values,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, message: "Data inserted successfully" });
      }
    }
  );
});

app.delete("/api/data/sparesmobilization_data_remove/:id", (req, res) => {
  const S_No = parseInt(req.params.id);
  if (!isNaN(S_No)) {
  connection.query(
    "DELETE FROM reference_details.spares_mobilization WHERE S_No = ?",
    [S_No],
    (err, result) => {
      if (err) {
        return res.send({success:false,
        message:err})
        console.log(err);
      } else {
       return res.send({success:true,
      message:"Data deleted successfully"});
      }
    }
  );
  }
});

app.put("/api/data/sparesmobilization_data_update/:id", (req, res) => {
  const S_No = req.params.id;
  const updates = req.body;

  updates.forEach((update) => {
    const {
      ID_No,
      Location,
      Part_Number,
      Item_Name,
      Units,
      Quantity_Required,
      Available_Quantity_On_Rig,
      Status,
    } = update;
    const updatedValues = {
      ID_No,
      Location,
      Part_Number,
      Item_Name,
      Units,
      Quantity_Required,
      Available_Quantity_On_Rig,
      Status,
    };

    connection.query(
      "UPDATE reference_details.spares_mobilization SET ? WHERE S_No = ?",
      [updatedValues, S_No],
      (err, result) => {
        if (err) {
          console.log(err);
          res.send({
            success: false,
            message: "Error while updating spares data",
          });
        }
      }
    );
  });

  res.send({ success: true, message: "Data updated successfully" });
});

// forward mobil
app.get("/api/data/forward_mobilization", (req, res) => {
  const { Customer_Name, Sales_Order_No, ID } = req.query;

  connection.query(
    `SELECT Boarding_Airport, Boarding_Date, Arrival_Airport, Arrival_Date, Upload_Tickets, Hotel_Name, Booking_Dates_checkin, Booking_Dates_checkout, Upload_Bookings, return_Boarding_Airport, return_Boarding_Date, return_Arrival_Airport, return_Arrival_Date, return_Upload_Ticket, return_Hotel_Name, return_Booking_Checkin, return_Booking_Checkout, return_Upload_Booking FROM forward_mobilization WHERE Customer_Name="${Customer_Name}" AND Sales_Order_No="${Sales_Order_No}" AND ID="${ID}"`,
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retriving forward docs");
        res.send({ success: false, message: err });
      } else {
        const forward_details = results.map((result) => result);
        res.send(forward_details);
      }
    }
  );
});

app.get("/api/data/getforward_mobilization", (req, res) => {
  const { ID } = req.query;

  connection.query(
    "SELECT Customer_Name FROM forward_mobilization WHERE ID = ?",
    [ID],
    (err, results) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .send({ error: "Failed to fetch forward mobilization data" });
        res.send({ success: false, message: err });
      } else {
        const forwardMobilizationData = results.map(
          (result) => result.Customer_Name
        );
        res.send(forwardMobilizationData);
      }
    }
  );
});

// post api for forward mobilization

app.post("/api/data/forward_mobilization", (req, res) => {
  const { Sales_Order_No, Customer_Name } = req.body;
  const values = {
    Sales_Order_No,
    Customer_Name,
  };
  connection.query(
    "INSERT INTO reference_details.forward_mobilization SET ?",
    values,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, message: "Posted Sucessfully" });
      }
    }
  );
});

app.put("/api/data/forward_mobilization/update", (req, res) => {
  const { Customer_Name, Sales_Order_No, ID } = req.query;
  const Boarding_Airport = req.body.Boarding_Airport;
  const Boarding_Date = req.body.Boarding_Date;
  const Arrival_Airport = req.body.Arrival_Airport;
  const Arrival_Date = req.body.Arrival_Date;
  //const Upload_Tickets = req.body.Upload_Tickets;
  const Hotel_Name = req.body.Hotel_Name;
  const Booking_Dates_checkin = req.body.Booking_Dates_checkin;
  const Booking_Dates_checkout = req.body.Booking_Dates_checkout;
  //const Upload_Bookings = req.body.Upload_Bookings;
  const return_Boarding_Airport = req.body.return_Boarding_Airport;
  const return_Boarding_Date = req.body.return_Boarding_Date;
  const return_Arrival_Airport = req.body.return_Arrival_Airport;
  const return_Arrival_Date = req.body.return_Arrival_Date;
  //const return_Upload_Ticket = req.body.return_Upload_Ticket;
  const return_Hotel_Name = req.body.return_Hotel_Name;
  const return_Booking_Checkin = req.body.return_Booking_Checkin;
  const return_Booking_Checkout = req.body.return_Booking_Checkout;
  //const return_Upload_Booking = req.body.return_Upload_Booking;

  connection.query(
    `UPDATE forward_mobilization SET Boarding_Airport=?, Boarding_Date=?, Arrival_Airport=?, Arrival_Date=?, Hotel_Name=?, Booking_Dates_checkin=?, Booking_Dates_checkout=?, return_Boarding_Airport=?, return_Boarding_Date=?, return_Arrival_Airport=?, return_Arrival_Date=?, return_Hotel_Name=?, return_Booking_Checkin=?, return_Booking_Checkout=? WHERE (Customer_Name="${Customer_Name}" AND Sales_Order_No="${Sales_Order_No}" AND ID="${ID}")`,
    [
      Boarding_Airport,
      Boarding_Date,
      Arrival_Airport,
      Arrival_Date,
      Hotel_Name,
      Booking_Dates_checkin,
      Booking_Dates_checkout,
      return_Boarding_Airport,
      return_Boarding_Date,
      return_Arrival_Airport,
      return_Arrival_Date,
      return_Hotel_Name,
      return_Booking_Checkin,
      return_Booking_Checkout,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err });
      } else {
        if (result.affectedRows === 0) {
          res
            .status(404)
            .json({ message: "Forward mobilization data not found" });
        } else {
          res.json({
            message: "Forward mobilization data updated successfully",
          });
        }
      }
    }
  );
});
const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const noSpaceInName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${noSpaceInName}`);
  },
});

const upload3 = multer({ storage: storage2 });

app.put(
  "/api/data/forward_mobilization_files/update",
  upload3.fields([
    { name: "Upload_Tickets" },
    { name: "Upload_Bookings" },
    { name: "return_Upload_Ticket" },
    { name: "return_Upload_Booking" },
  ]),
  (req, res) => {
    const { Customer_Name, Sales_Order_No, ID } = req.query;
    const {
      Upload_Tickets,
      Upload_Bookings,
      return_Upload_Ticket,
      return_Upload_Booking,
    } = req.files;

    const upload_Tickets_Path = Upload_Tickets
      ? `${req.protocol}://${req.get("host")}/uploads/${
          Upload_Tickets[0].filename
        }`
      : null;
    const upload_Bookings_Path = Upload_Bookings
      ? `${req.protocol}://${req.get("host")}/uploads/${
          Upload_Bookings[0].filename
        }`
      : null;
    const return_upload_ticket_Path = return_Upload_Ticket
      ? `${req.protocol}://${req.get("host")}/uploads/${
          return_Upload_Ticket[0].filename
        }`
      : null;
    const return_upload_booking_Path = return_Upload_Booking
      ? `${req.protocol}://${req.get("host")}/uploads/${
          return_Upload_Booking[0].filename
        }`
      : null;

    const setFields = [];
    const values = [];

    if (Upload_Tickets) {
      setFields.push("Upload_Tickets = ?");
      values.push(upload_Tickets_Path);
    }

    if (Upload_Bookings) {
      setFields.push("Upload_Bookings = ?");
      values.push(upload_Bookings_Path);
    }

    if (return_Upload_Ticket) {
      setFields.push("return_Upload_Ticket = ?");
      values.push(return_upload_ticket_Path);
    }

    if (return_Upload_Booking) {
      setFields.push("return_Upload_Booking = ?");
      values.push(return_upload_booking_Path);
    }

    if (setFields.length === 0) {
      return res.json({ message: "No files were uploaded for update" });
    }

    const sql = `
    UPDATE forward_mobilization
    SET
    ${setFields.join(", ")}
    WHERE Customer_Name = ? AND Sales_Order_No = ? AND ID = ?
  `;

    values.push(Customer_Name, Sales_Order_No, ID);

    connection.query(sql, values, (error, result) => {
      if (error) {
        console.error("Error updating record:", error);
        res.status(500).json({ message: "Internal server error" });
      } else {
        res.json({ message: "File URLs updated in the database" });
      }
    });
  }
);

app.delete("/api/data/forward_mobilization", (req, res) => {
  const { Customer_Name, Sales_Order_No, ID } = req.query;
  connection.query(
    `DELETE FROM forward_mobilization WHERE Customer_Name=? AND Sales_Order_No=? AND ID=?`,
    [Customer_Name, Sales_Order_No, ID],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("DELETED");
      }
    }
  );
});

//*******************************************mobilisation get api *******/
app.get("/api/data/forward_mobilization_all", (req, res) => {
  connection.query("SELECT * FROM forward_mobilization", (err, results) => {
    if (err) {
      res.send({ success: false, message: err });
    } else {
      return res.json(results);
    }
  });
});

// attendance
app.post("/api/data/daily_attendancePost", (req, res) => {
  const {
    ID_No,
    Tech,
    Designation,
    Day,
    Month,
    Year,
    Status,
    Previous_Attendance,
    Remarks,
    Requested_Status,
    Reason,
  } = req.body;

  const values = {
    ID_No,
    Tech,
    Designation,
    Day,
    Month,
    Year,
    Status,
    Previous_Attendance,
    Remarks,
    Requested_Status,
    Reason,
  };

  connection.query(
    "INSERT INTO reference_details.daily_attendance SET ?",
    values,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "Failed to insert the data" });
      } else {
        res.send({ success: true, message: "Data inserted successfully" });
      }
    }
  );
});

// Consumables get

app.get("/api/data/consumables_data", (req, res) => {
  const { Sales_Order_ID, ID } = req.query;

  connection.query(
    `SELECT * FROM consumables_tool_details WHERE Sales_Order_ID = ${Sales_Order_ID} AND ID =${ID}`,
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retriving spares datails");
      } else {
        const consum_Details = results.map((result) => result);
        res.send(consum_Details);
      }
    }
  );
});

// Post request for Consumables

app.post("/api/data/consumables", (req, res) => {
  const { ID, Item_Name, Quantity, UOM, Sales_Order_ID } = req.body;
  const values = {
    ID,
    Item_Name,
    Quantity,
    UOM,
    Sales_Order_ID,
  };
  connection.query(
    "INSERT INTO reference_details.consumables_tool_details SET ?",
    values,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, message: "Posted Sucessfully" });
      }
    }
  );
});

// Put request for Consumables

app.put("/api/data/consumbles_update", (req, res) => {
  const { Sales_Order_ID, S_No } = req.query;
  const Item_Name = req.body.Item_Name;
  const Quantity = req.body.Quantity;
  const UOM = req.body.UOM;

  connection.query(
    `UPDATE consumables_tool_details SET Item_Name=?, Quantity=?, UOM=? WHERE Sales_Order_ID=${Sales_Order_ID} AND S_No=${S_No}`,
    [Item_Name, Quantity, UOM],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err });
      } else {
        if (result.affectedRows === 0) {
          res.status(404).json({ message: "Consumablesdata not found" });
        } else {
          res.json({ message: "Consumables data updated successfully" });
        }
      }
    }
  );
});

app.get("/api/data/timesheetdata", (req, res) => {
  const { ID_No, Month, Year } = req.query;

  // Define a mapping of month names to month numbers
  const monthNameToNumber = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };

  // Check if the provided month name is valid
  const monthNumber = monthNameToNumber[Month];
  if (monthNumber === undefined) {
    return res.status(400).send("Invalid month name");
  }

  connection.query(
    `SELECT Status, Designation, Day, Tech FROM daily_attendance WHERE ID_No="${ID_No}" AND Month="${monthNumber}" AND Year="${Year}"`,
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving daily attendance");
      } else {
        if (results.length > 0) {
          const data = results.map((result) => ({
            status: result.Status,
            tech: result.Tech,
            designation: result.Designation,
            day: result.Day,
          }));
          res.send(data);
        } else {
          res.send([]);
        }
      }
    }
  );
});

app.get("/api/data/timesheet_path", (req, res) => {
  const { ID_No, Month, Year } = req.query;

  // Define a mapping of month names to month numbers
  const monthNameToNumber = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };

  // Check if the provided month name is valid
  const monthNumber = monthNameToNumber[Month];

  if (monthNumber === undefined) {
    return res.status(400).send("Invalid month name");
  }

  connection.query(
    `SELECT Time_sheet FROM daily_attendance WHERE ID_No="${ID_No}" AND Month="${monthNumber}" AND Year="${Year}"`,
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving daily attendance");
      } else {
        if (results.length > 0) {
          const data2 = {
            timesheet: results[0].Time_sheet,
          };
          res.send(data2);
        } else {
          res.send(null);
        }
      }
    }
  );
});

const storage3 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const noSpaceInName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${noSpaceInName}`);
  },
});

const upload4 = multer({ storage: storage3 });

app.put(
  "/api/data/timesheetdata_update",
  upload4.single("Time_sheet"),
  (req, res) => {
    const { ID_No, Month, Year } = req.query;

    // Define a mapping of month names to month numbers
    const monthNameToNumber = {
      January: "01",
      February: "02",
      March: "03",
      April: "04",
      May: "05",
      June: "06",
      July: "07",
      August: "08",
      September: "09",
      October: "10",
      November: "11",
      December: "12",
    };

    // Check if the provided month name is valid
    const monthNumber = monthNameToNumber[Month];

    if (monthNumber === undefined) {
      return res.status(400).send("Invalid month name");
    }

    const Time_sheet_path = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;

    if (!req.file) {
      return res.json({ message: "No file was uploaded for update" });
    }

    connection.query(
      "UPDATE reference_details.daily_attendance SET Time_sheet = ? WHERE ID_No = ? AND Month = ? AND Year = ?",
      [Time_sheet_path, ID_No, monthNumber, Year],
      (error, result) => {
        if (error) {
          console.log("Error updating record:", error);
          res.status(500).json({ message: error });
        } else {
          res.json({ message: "File URL updated in the database" });
        }
      }
    );
  }
);

app.put(
  "/api/data/workshoptimesheetdata_update",
  upload4.single("Workshop_Time_sheet"),
  (req, res) => {
    const date = req.query.date;
    const Time_sheet_path = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;
    if (!req.file) {
      return res.json({ message: "No file was uploaded for update" });
    }
    connection.query(
      "UPDATE reference_details.workshop_timesheet SET Time_sheet_doc = ? WHERE Date = ?",
      [Time_sheet_path, date],
      (error, result) => {
        if (error) {
          console.log("Error updating record:", error);
          res.status(500).json({ message: error });
        } else {
          res.json({ message: "File URL updated in the database" });
        }
      }
    );
  }
);

app.put(
  "/api/data/professionaldoc_renew",
  upload4.single("Renew_Doc"),
  (req, res) => {
    const S_no = req.query.S_No;
    const renewpath = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;
    const { Doc_name, Expiry, Date } = req.body;

    connection.query(
      "UPDATE professional_details SET ?? = ?, ?? = ? WHERE S_No = ?",
      [Doc_name, renewpath, Expiry, Date, S_no],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Database error" });
        } else {
          res.send("UPDATED");
        }
      }
    );
  }
);

app.put(
  "/api/data/visafile_update",
  upload4.single("Temp_Visa_Doc"),
  (req, res) => {
    const { Customer_Name, ID } = req.query;
    const renewpath = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;
    const { Temp_Visa_Expiry } = req.body;
    const queryParams = [];
    let sqlQuery = "UPDATE forward_mobilization SET";
    if (renewpath) {
      sqlQuery += " Temp_Visa_Doc = ?";
      queryParams.push(renewpath);
    }

    if (Temp_Visa_Expiry) {
      if (renewpath) {
        sqlQuery += ",";
      }
      sqlQuery += " Temp_Visa_Expiry = ?";
      queryParams.push(Temp_Visa_Expiry);
    }
    sqlQuery += " WHERE Customer_Name = ? AND ID = ?";
    queryParams.push(Customer_Name, ID);

    connection.query(sqlQuery, queryParams, (error, results) => {
      if (error) {
        res.status(500).json({ error: "Database error" });
      } else {
        res.status(200).json({ message: "Record updated successfully" });
      }
    });
  }
);

app.put("/api/data/project_details/remove_visa", (req, res) => {
  const { Customer_Name, ID } = req.query;
  connection.query(
    "UPDATE forward_mobilization SET Temp_Visa_Doc = null WHERE Customer_Name = ? AND ID = ?",
    [Customer_Name, ID],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, message: "Data updated successfully" });
      }
    }
  );
});

app.delete("/api/data/remove_visa/:S_No", (req, res) => {
  const { S_No } = req.params; // Use params to get S_No from the URL
  if (!S_No) {
    return res.status(400).json({ error: "Missing S_No parameter" });
  }

  connection.query(
    "UPDATE reference_details.professional_details SET Active_Visas_One_Doc = null,Active_Visas_Two_Doc = null,Active_Visas_Three_Doc = null,Active_Visas_Four_Doc = null,Active_Visas_Five_Doc = null,Active_Visas_Six_Doc = null, Active_Visas_One_Expiry = null,Active_Visas_Two_Expiry = null,Active_Visas_Three_Expiry = null,Active_Visas_Four_Expiry = null,Active_Visas_Five_Expiry = null,Active_Visas_Six_Expiry = null,Signature = null,Passport_Doc = null,Passport_Issuing_Country = null,Passport_Expiry = null,Seaman_Doc = null,Seaman_Issuing_Country = null, Seaman_Book_Expiry = null,Bosiet_Expiry = null,Bosiet_Doc = null,H2s_Expiry = null,H2s_Doc  = null,Medical_Expiry = null,Medical_Doc = null,Insurance_Expiry = null,Insurance_Doc = null,SNT_Eye_Test_Expiry = null,SNT_Eye_Test_Doc = null,Signature = null WHERE S_No = ?",
    [S_No],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      } else {
        res.send("DELETED");
      }
    }
  );
});


//***********************************************************************workshop apis************* */
app.post("/api/data/workshopprojectdetails_post", (req, res) => {
  const {
    ID_No,
    Sales_Order_No,
    PO_No,
    PO_Date,
    Quote_No,
    Quote_Date,
    Costing_ID,
    Project_Name,
    Project_Description,
    Scope,
    Quantity,
    Customer_Name,
    First_Arrival,
    Estimated_Date_Of_Commencement,
    Target_Days_For_Completion,
    Target_Manhours,
    Ops_Engineer,
    Current_Status,
    Design,
    Scope_Description,
    Dmcc_fze,
    Fze_dmcc_po,
  } = req.body;

  const values = {
    ID_No,
    Sales_Order_No,
    PO_No,
    PO_Date,
    Quote_No,
    Quote_Date,
    Costing_ID,
    Project_Name,
    Project_Description,
    Scope,
    Quantity,
    Customer_Name,
    First_Arrival,
    Estimated_Date_Of_Commencement,
    Target_Days_For_Completion,
    Target_Manhours,
    Ops_Engineer,
    Current_Status,
    Project_Description,
    Design,
    Scope_Description,
    Dmcc_fze,
    Fze_dmcc_po,
  };
  connection.query(
    "INSERT INTO reference_details.workshop_project_details SET ?",
    values,
    (err, results) => {
      if (err) {
        console.log(err);
        res.send({
          success: false,
          message: err,
        });
      } else {
        const projectId = results.insertId;
        res.send({
          success: true,
          message: "Data posted successfully ",
          ID_No: projectId,
        });
      }
    }
  );
});

app.get("/api/data/workshop_project_details", (req, res) => {
  connection.query(
    "SELECT * FROM reference_details.workshop_project_details",
    (err, rows) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "Failed to retrieve data" });
      } else {
        res.send({ success: true, data: rows });
      }
    }
  );
});

app.put("/api/data/workshopprojectdetails_put/:id", (req, res) => {
  const ID_No = req.params.id;
  const {
    Sales_Order_No,
    PO_No,
    PO_Date,
    Quote_No,
    Quote_Date,
    Costing_ID,
    Project_Name,
    Scope,
    Quantity,
    Customer_Name,
    First_Arrival,
    Estimated_Date_Of_Commencement,
    Target_Days_For_Completion,
    Target_Manhours,
    Ops_Engineer,
    Current_Status,
    Project_Description,
    Design,
    Scope_Description,
    Dmcc_fze,
    Fze_dmcc_po,
  } = req.body;

  const updatedValues = {
    Sales_Order_No,
    PO_No,
    PO_Date,
    Quote_No,
    Quote_Date,
    Costing_ID,
    Project_Name,
    Scope,
    Quantity,
    Customer_Name,
    First_Arrival,
    Estimated_Date_Of_Commencement,
    Target_Days_For_Completion,
    Target_Manhours,
    Ops_Engineer,
    Current_Status,
    Project_Description,
    Design,
    Scope_Description,
    Dmcc_fze,
    Fze_dmcc_po,
  };

  connection.query(
    "UPDATE reference_details.workshop_project_details SET ? WHERE ID_No = ?",
    [updatedValues, ID_No],
    (err, result) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .send({ success: false, message: "Internal Server Error" });
      } else {
        res.send({ success: true, message: "Data updated successfully" });
      }
    }
  );
});

//****************************************************workshop project checklist********************* */

app.post("/api/data/workshopproject_checklist", (req, res) => {
  const {
    ID_No,
    Sales_Order_No,
    Item1,
    Issue1,
    Item2,
    Issue2,
    Item3,
    Issue3,
    Item4,
    Issue4,
    Item5,
    Issue5,
    Item6,
    Issue6,
    Item7,
    Issue7,
    Item8,
    Issue8,
    Item9,
    Issue9,
    Item10,
    Issue10,
    Item11,
    Issue11,
    Item12,
    Issue12,
    Item13,
    Issue13,
    Item14,
    Issue14,
    Item15,
    Issue15,
    Item16,
    Issue16,
    Item17,
    Issue17,
    Item17A,
    Issue17A,
    Item18,
    Issue18,
    Item19,
    Issue19,
    Item20,
    Issue20,
    Item21,
    Issue21,
    Item22,
    Issue22,
    Item23,
    Issue23,
    Item24,
    Issue24,
    Item25,
    Issue25,
    Item26,
    Issue26,
    Item27,
    Issue27,
    Item28,
    Issue28,
    Item29,
    Issue29,
    Item30,
    Issue30,
    Item30A,
    Issue30A,
    Item31,
    Issue31,
    Item32,
    Issue32,
    Item33,
    Issue33,
    Item34,
    Issue34,
    Item35,
    Issue35,
    Item36,
    Issue36,
    Item37,
    Issue37,
    Item38,
    Issue38,
    Item39,
    Issue39,
    Item40,
    Issue40,
    Item41,
    Issue41,
    Item42,
    Issue42,
    Item43,
    Issue43,
    Item44,
    Issue44,
  } = req.body;

  const values = {
    ID_No,
    Sales_Order_No,
    Item1,
    Issue1,
    Item2,
    Issue2,
    Item3,
    Issue3,
    Item4,
    Issue4,
    Item5,
    Issue5,
    Item6,
    Issue6,
    Item7,
    Issue7,
    Item8,
    Issue8,
    Item9,
    Issue9,
    Item10,
    Issue10,
    Item11,
    Issue11,
    Item12,
    Issue12,
    Item13,
    Issue13,
    Item14,
    Issue14,
    Item15,
    Issue15,
    Item16,
    Issue16,
    Item17,
    Issue17,
    Item17A,
    Issue17A,
    Item18,
    Issue18,
    Item19,
    Issue19,
    Item20,
    Issue20,
    Item21,
    Issue21,
    Item22,
    Issue22,
    Item23,
    Issue23,
    Item24,
    Issue24,
    Item25,
    Issue25,
    Item26,
    Issue26,
    Item27,
    Issue27,
    Item28,
    Issue28,
    Item29,
    Issue29,
    Item30,
    Issue30,
    Item30A,
    Issue30A,
    Item31,
    Issue31,
    Item32,
    Issue32,
    Item33,
    Issue33,
    Item34,
    Issue34,
    Item35,
    Issue35,
    Item36,
    Issue36,
    Item37,
    Issue37,
    Item38,
    Issue38,
    Item39,
    Issue39,
    Item40,
    Issue40,
    Item41,
    Issue41,
    Item42,
    Issue42,
    Item43,
    Issue43,
    Item44,
    Issue44,
  };

  connection.query(
    "INSERT INTO reference_details.workshop_project_checklist SET ?",
    values,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, message: "Datainserted successfully" });
      }
    }
  );
});

app.get("/api/data/workshopproject-checklistgetdetails", (req, res) => {
  connection.query(
    "SELECT * FROM reference_details.workshop_project_checklist",
    (err, rows) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: "Failed to retrieve data" });
      } else {
        res.send({ success: true, data: rows });
      }
    }
  );
});

app.put("/api/data/workshopproject_checklist/update/:ID_No", (req, res) => {
  const ID_No = req.params.ID_No;
  const {
    Sales_Order_No,
    Item1,
    Issue1,
    Item2,
    Issue2,
    Item3,
    Issue3,
    Item4,
    Issue4,
    Item5,
    Issue5,
    Item6,
    Issue6,
    Item7,
    Issue7,
    Item8,
    Issue8,
    Item9,
    Issue9,
    Item10,
    Issue10,
    Item11,
    Issue11,
    Item12,
    Issue12,
    Item13,
    Issue13,
    Item14,
    Issue14,
    Item15,
    Issue15,
    Item16,
    Issue16,
    Item17,
    Issue17,
    Item17A,
    Issue17A,
    Item18,
    Issue18,
    Item19,
    Issue19,
    Item20,
    Issue20,
    Item21,
    Issue21,
    Item22,
    Issue22,
    Item23,
    Issue23,
    Item24,
    Issue24,
    Item25,
    Issue25,
    Item26,
    Issue26,
    Item27,
    Issue27,
    Item28,
    Issue28,
    Item29,
    Issue29,
    Item30,
    Issue30,
    Item30A,
    Issue30A,
    Item31,
    Issue31,
    Item32,
    Issue32,
    Item33,
    Issue33,
    Item34,
    Issue34,
    Item35,
    Issue35,
    Item36,
    Issue36,
    Item37,
    Issue37,
    Item38,
    Issue38,
    Item39,
    Issue39,
    Item40,
    Issue40,
    Item41,
    Issue41,
    Item42,
    Issue42,
    Item43,
    Issue43,
    Item44,
    Issue44,
  } = req.body;

  const updatedValues = {
    Sales_Order_No,
    Item1,
    Issue1,
    Item2,
    Issue2,
    Item3,
    Issue3,
    Item4,
    Issue4,
    Item5,
    Issue5,
    Item6,
    Issue6,
    Item7,
    Issue7,
    Item8,
    Issue8,
    Item9,
    Issue9,
    Item10,
    Issue10,
    Item11,
    Issue11,
    Item12,
    Issue12,
    Item13,
    Issue13,
    Item14,
    Issue14,
    Item15,
    Issue15,
    Item16,
    Issue16,
    Item17,
    Issue17,
    Item17A,
    Issue17A,
    Item18,
    Issue18,
    Item19,
    Issue19,
    Item20,
    Issue20,
    Item21,
    Issue21,
    Item22,
    Issue22,
    Item23,
    Issue23,
    Item24,
    Issue24,
    Item25,
    Issue25,
    Item26,
    Issue26,
    Item27,
    Issue27,
    Item28,
    Issue28,
    Item29,
    Issue29,
    Item30,
    Issue30,
    Item30A,
    Issue30A,
    Item31,
    Issue31,
    Item32,
    Issue32,
    Item33,
    Issue33,
    Item34,
    Issue34,
    Item35,
    Issue35,
    Item36,
    Issue36,
    Item37,
    Issue37,
    Item38,
    Issue38,
    Item39,
    Issue39,
    Item40,
    Issue40,
    Item41,
    Issue41,
    Item42,
    Issue42,
    Item43,
    Issue43,
    Item44,
    Issue44,
  };

  connection.query(
    "UPDATE reference_details.workshop_project_checklist SET ? WHERE ID_No = ?",
    [updatedValues, ID_No],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, message: "Data updated successfully" });
      }
    }
  );
});

//team details workshop apis****************//

app.get("/api/data/trainee_customer_names/workshop", (req, res) => {
  connection.query(
    'SELECT Customer_Name FROM professional_details WHERE Designation = "Trainee"',
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error receiving trainee customer names");
      } else {
        const customerNames = results.map((result) => result.Customer_Name);
        res.send(customerNames);
      }
    }
  );
});

app.get("/api/data/technician_customer_names/workshop", (req, res) => {
  connection.query(
    'SELECT Customer_Name FROM professional_details WHERE Designation = "Technician"',
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving technician customer names");
      } else {
        const customerNames = results.map((result) => result.Customer_Name);
        res.send(customerNames);
      }
    }
  );
});

app.get("/api/data/supervisor_customer_names/workshop", (req, res) => {
  connection.query(
    'SELECT Customer_Name FROM professional_details WHERE Designation = "Supervisor"',
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving supervisor customer names");
      } else {
        const customerNames = results.map((result) => result.Customer_Name);
        res.send(customerNames);
      }
    }
  );
});

app.put("/api/data/addteamdetails/:id", (req, res) => {
  const teamId = req.params.id;
  const { Supervisors, Technicians, Trainees } = req.body;

  const updatedValues = {
    Supervisors,
    Technicians,
    Trainees,
  };

  connection.query(
    "UPDATE reference_details.workshop_project_details SET ? WHERE ID_No = ?",
    [updatedValues, teamId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, message: "Data updated successfully" });
      }
    }
  );
});

//******************************************************************end******************************* */

//finance apis ************************//
app.post("/api/data/employeedatabase_data", (req, res) => {
  const {
    s_no,
    employee_code,
    employee_name,
    designation,
    bankacnumber,
    swiftcode,
    bankname,
    dob,
    place,
    nationality,
    gender,
    day_rate,
    retainership_status,
    monthly_retainer_cost,
    currency,
  } = req.body;

  const values = {
    s_no,
    employee_code,
    employee_name,
    designation,
    bankacnumber,
    swiftcode,
    bankname,
    dob,
    place,
    nationality,
    gender,
    day_rate,
    retainership_status,
    monthly_retainer_cost,
    currency,
  };

  connection.query(
    "INSERT INTO reference_details.employee_database SET ?",
    values,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, message: "Data inserted successfully" });
      }
    }
  );
});

//******************************************** */

app.get("/api/data/employeedatabase_data", (req, res) => {
  connection.query(
    "SELECT * FROM reference_details.employee_database",
    (err, results) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, data: results });
      }
    }
  );
});

//****************************************************** */

app.get("/api/data/getfinance_details", (req, res) => {
  connection.query("SELECT * FROM payroll_sheet", (err, results) => {
    if (err) {
      console.log(err);
      res.send({ success: false, message: "Error fetching data" });
    } else {
      res.send({ success: true, data: results });
    }
  });
});

app.get("/api/data/getfinance_details/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM payroll_sheet WHERE s_no = ?",
    [id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, data: results });
      }
    }
  );
});

app.get("/api/data/employeedatabase_data/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM reference_details.employee_database WHERE s_no = ?",
    [id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, data: results });
      }
    }
  );
});

//******************************** */
// app.put("/api/data/employeeDatabaseUpdation/:id", (req, res) => {
//   const s_no = req.params.id;
//   const {
//     employee_code,
//     employee_name,
//     designation,
//     bankacnumber,
//     swiftcode,
//     bankname,
//     dob,
//     place,
//     nationality,
//     gender,
//     day_rate,
//     retainership_status,
//     monthly_retainer_cost,
//     currency,
//   } = req.body;

//   const updatedValues = {
//     employee_code,
//     employee_name,
//     designation,
//     bankacnumber,
//     swiftcode,
//     bankname,
//     dob,
//     place,
//     nationality,
//     gender,
//     day_rate,
//     retainership_status,
//     monthly_retainer_cost,
//     currency,
//   };

//   connection.query(
//     "UPDATE reference_details.employee_database SET ? WHERE s_no = ?",
//     [updatedValues, s_no],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.send({ success: false, message: err });
//       } else {
//         res.send({
//           success: true,
//           message: "Data updated successfully",
//           data: result,
//         });
//       }
//     }
//   );
// });

app.put("/api/data/employeeDatabaseUpdation/:id", (req, res) => {
  const s_no = req.params.id;
  const {
    employee_code,

    employee_name,

    designation,

    bankacnumber,

    swiftcode,

    bankname,

    dob,

    place,

    nationality,

    gender,

    day_rate,

    retainership_status,

    monthly_retainer_cost,

    currency,
  } = req.body;
  const updatedValues = {
    employee_code,
    employee_name,
    designation,
    bankacnumber,
    swiftcode,
    bankname,
    dob,
    place,
    nationality,
    gender,
    day_rate,
    retainership_status,
    monthly_retainer_cost,
    currency,
    //
  }; // Copy all fields from the request body

  Object.keys(updatedValues).forEach((key) => {
    if (updatedValues[key] === undefined || updatedValues[key] === null) {
      delete updatedValues[key];
    }
  });

  connection.query(
    "UPDATE reference_details.employee_database SET ? WHERE s_no = ?",
    [updatedValues, s_no],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({
          success: true,
          message: "Data updated successfully",
          data: result,
        });
      }
    }
  );
});

//*********************monthly tracker****************** */
app.post("/api/data/monthlytracker_data", (req, res) => {
  const {
    professional_name,
    designation,
    total_work_days,
    total_travel_days,
    total_standby_days,
    total_retainer_days,
    project,
  } = req.body;

  const values = {
    professional_name,
    designation,
    total_work_days,
    total_travel_days,
    total_standby_days,
    total_retainer_days,
    project,
  };

  connection.query(
    "INSERT INTO reference_details.monthly_tracker SET ?",
    [values],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, message: values, s_no: result.insertId });
      }
    }
  );
});
//************************************************************* */

app.get("/api/data/getmonthlytracker", (req, res) => {
  connection.query("SELECT * FROM monthly_tracker", (err, results) => {
    if (err) {
      console.log(err);
      res.send({ success: false, message: "Error fetching data" });
    } else {
      res.send({ success: true, data: results });
    }
  });
});

//*****************************************monthly attendance updated api********** */

// app.put("/api/data/monthlytracker_data_update/:id", (req, res) => {
//   const s_no = req.params.s_no;
//   const updates = req.body;

//   updates.forEach((update) => {
//     const {
//       professional_name,
//       designation,
//       total_work_days,
//       total_travel_days,
//       total_standby_days,
//       total_retainer_days,
//       project,
//     } = update;

//     const updatedValues = {
//       professional_name,
//       designation,
//       total_work_days,
//       total_travel_days,
//       total_standby_days,
//       total_retainer_days,
//       project,
//     };

//     connection.query(
//       "UPDATE reference_details.monthly_tracker SET ? WHERE s_no = ?",
//       [updatedValues, s_no],
//       (err, result) => {
//         if (err) {
//           console.log(err);
//           res.send({
//             success: false,
//             message: "Error while updating spares data",
//           });
//         }
//       }
//     );
//   });

//   res.send({ success: true, message: "Data updated successfully" });
// });

app.put("/api/data/monthlytrackerupdation/:id", (req, res) => {
  const s_no = req.params.id;
  const {
    professional_name,
    designation,
    total_work_days,
    total_travel_days,
    total_standby_days,
    total_retainer_days,
    project,
  } = req.body;
  const updatedValues = {
    professional_name,
    designation,
    total_work_days,
    total_travel_days,
    total_standby_days,
    total_retainer_days,
    project,
  };
  connection.query(
    "UPDATE reference_details.monthly_tracker SET ? WHERE s_no = ?",
    [updatedValues, s_no],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send({ success: false, message: err });
      } else {
        res.send({ success: true, message: result });
      }
    }
  );
});

app.delete("/api/data/monthlytracker_data_remove/:id", (req, res) => {
  const s_no = parseInt(req.params.id);
  // Check if s_no is a valid number before proceeding with the DELETE query
  if (!isNaN(s_no)) {
    connection.query(
      "DELETE FROM reference_details.monthly_tracker WHERE s_no = ?",
      [s_no],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("DELETED monthlytracker details");
        }
      }
    );
  } else {
    res.status(400).send("Invalid s_no provided");
  }
});

//************************************payroll sheet apis ************ */
app.post("/api/data/payrollsheet_data", (req, res) => {
  const {
    s_no,
    professional_name,
    designation,
    days_in_current_month,
    work_earnings,
    travel_earnings,
    standby_earnings,
    retainer_earnings,
    previous_month_pending_earnings,
    overtime,
    gross_earnings,
    travel_expenses,
    fna_expenses,
    comm_expenses,
    medical_expenses,
    others,
    total_expenses,
    total_salary,
    advance,
    tds,
    other,
    total_deductions,
    net_salary,
    respective_currency,
    conversion,
    salary_in_respective_currency,
    salarycredited,
  } = req.body;

  const values = {
    s_no,
    professional_name,
    designation,
    days_in_current_month,
    work_earnings,
    travel_earnings,
    standby_earnings,
    retainer_earnings,
    previous_month_pending_earnings,
    overtime,
    gross_earnings,
    travel_expenses,
    fna_expenses,
    comm_expenses,
    medical_expenses,
    others,
    total_expenses,
    total_salary,
    advance,
    tds,
    other,
    total_deductions,
    net_salary,
    respective_currency,
    conversion,
    salary_in_respective_currency,
    salarycredited,
  };

  connection.query(
    "INSERT INTO reference_details.payroll_sheet SET ?",
    values,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, message: "Data inserted successfully" });
      }
    }
  );
});

app.get("/api/data/getpayrolldata", (req, res) => {
  connection.query(
    "SELECT * FROM reference_details.payroll_sheet",
    (err, results) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, data: results });
      }
    }
  );
});

app.get("/api/data/getpayrolldata/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM reference_details.payroll_sheet WHERE s_no = ?",
    [id],
    (err, results) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, data: results });
      }
    }
  );
});

app.put("/api/data/payrollsheetupdation/:id", (req, res) => {
  const payrollId = req.params.id;
  const {
    year,
    month,
    previous_month_pending_earnings,
    overtime,
    travel_expenses,
    fna_expenses,
    comm_expenses,
    work_earnings,
    travel_earnings,
    standby_earnings,
    retainer_earnings,
    medical_expenses,
    total_expenses,
    others,
    advance,
    tds,
    total_deductions,
  } = req.body;
  const updatedValues = {
    year,
    month,
    previous_month_pending_earnings,
    overtime,
    travel_expenses,
    fna_expenses,
    comm_expenses,
    work_earnings,
    travel_earnings,
    standby_earnings,
    retainer_earnings,
    medical_expenses,
    total_expenses,
    others,
    advance,
    tds,
    total_deductions,
  };
  connection.query(
    "UPDATE reference_details.payroll_sheet SET ? WHERE s_no = ?",
    [updatedValues, payrollId],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send({ success: false, message: err });
      } else {
        res.send({ success: true, message: "Data updated successfully" });
      }
    }
  );
});

// api docs manualupload apis
app.post("/api/data/manualUpload", (req, res) => {
  const {
    ID_No,
    Sales_Order_No,
    Team_Selection,
    SQP,
    Risk_Assessment,
    Contract_Review,
    Enquiry,
    Order_Confirmation,
  } = req.body;

  const values = {
    ID_No,
    Sales_Order_No,
    Team_Selection,
    SQP,
    Risk_Assessment,
    Contract_Review,
    Enquiry,
    Order_Confirmation,
  };

  connection.query(
    "INSERT INTO reference_details.api_docs SET ? ",
    values,
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ success: false, message: err });
      } else {
        res.send({ success: true, message: "Data inserted Successfully" });
      }
    }
  );
});

app.get("/api/data/getmanualdocs", (req, res) => {
  connection.query(
    "SELECT * FROM reference_details.api_docs",
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
      } else {
        res
          .status(200)
          .json({
            success: true,
            data: results,
            message: "Data retrieved successfully",
          });
      }
    }
  );
});

app.get("/api/data/getmanualdocs/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM reference_details.api_docs WHERE ID_No = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
      } else {
        res
          .status(200)
          .json({
            success: true,
            data: results,
            message: "Data retrieved successfully",
          });
      }
    }
  );
});

const storage4 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const noSpaceInName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${noSpaceInName}`);
  },
});

const upload5 = multer({ storage: storage4 });

app.put("/api/data/removemanualdocs/:id",(req, res) => {
  const ID_No = req.params.id;
  const type = req.body.type
  connection.query("UPDATE api_docs SET ?? = null WHERE ID_No = ?", [type, ID_No], (err, result) => {
    if (err) {
      console.log(err);
      // return res.status(500).json({ error: "Database error" });
    } else {
      res.send("UPDATED");
    }
  })
})

app.put("/api/data/updatemanualdocs/:id",
  upload5.fields([
    { name: "Team_Selection" },
    { name: "SQP" },
    { name: "Risk_Assessment" },
    { name: "Contract_Review" },
    { name: "Enquiry" },
    { name: "Order_Confirmation" },
    { name: "Customer_Feedback" },
    { name: "Service_Execution_Feedback" },
  ]),
  (req, res) => {
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
        `${req.protocol}://${req.get("host")}/uploads/${
          Team_Selection[0].filename
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
        `${req.protocol}://${req.get("host")}/uploads/${
          Risk_Assessment[0].filename
        }`
      );
    }
    if (Contract_Review) {
      setFields.push("Contract_Review = ?");
      values.push(
        `${req.protocol}://${req.get("host")}/uploads/${
          Contract_Review[0].filename
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
        `${req.protocol}://${req.get("host")}/uploads/${
          Order_Confirmation[0].filename
        }`
      );
    }

    if (Customer_Feedback) {
      setFields.push("Customer_Feedback = ?");
      values.push(
        `${req.protocol}://${req.get("host")}/uploads/${
          Customer_Feedback[0].filename
        }`
      );
    }

    if (Service_Execution_Feedback) {
      setFields.push("Service_Execution_Feedback = ?");
      values.push(
        `${req.protocol}://${req.get("host")}/uploads/${
          Service_Execution_Feedback[0].filename
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
  }
);

// app.put("/api/data/professional_detailsupdation/:id", (req, res) => {
//   const professionalId = req.params.id;
//   const {
//     Team_Selection,
//           SQP,
//           Risk_Assessment,
//           Contract_Review,
//           Enquiry,
//           Order_Confirmation,
//   } = req.body;

//   const updatedValues = {
//     Team_Selection,
//     SQP,
//     Risk_Assessment,
//     Contract_Review,
//     Enquiry,
//     Order_Confirmation,
//   };

//   connection.query(
//     "UPDATE reference_details.api_docs SET ? WHERE ID_No = ?",
//     [updatedValues, professionalId],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.send({ success: false, message: err });
//       } else {
//         res.send({ success: true, message: "Data updated successfully" });
//       }
//     }
//   );
// });

// //field docs apis 


// app.post("/api/data/customerfeedbackdocs",(req,res)=>{
//   const {
//     Customer_Feedback,
//     Service_Execution_Feedback,
//   } = req.body;

//   const values = {
//     Customer_Feedback,
//     Service_Execution_Feedback,
//   };

//   connection.query(
//     "INSERT INTO reference_details.field_docs SET ? ",
// (err,results)=>{
//     if(err){
//       console.log(err);
//       res.send({success:false,message:err});
//     } else {
//       results.send({success:true,message:"Data Inserted Successfully"});
//     }

//   }
//   );
// })

// app.get("/api/data/getcustomerfeedbackdocs",(req,res)=>{
//   connection.query(
//     "SELECT * FROM reference_details.field_docs",
//     (err,results)=>{

//     if(err){
//       console.error(err);
//       res.status(500).json({success:false,error:err.message});
//     } else {
//       res.status(200).json({success:true,
//       data:results,
// message:"Data retrieved Successfully",});

//     }
//   }
//   );

// })

// app.get("/api/data/getcustomerfeedbackdocs/:id",(req,res)=>{
//   const id = req.params.id;
//   connection.query(
//     "SELECT * FROM reference_details.field_docs WHERE ID_No = ?",[id],
//     (err,results)=>{
//     if(err){
//       console.error(err);
//       res.status(500).json({success:false,error:err.message});
//     }else{
//       res.status(200).json({success:true,
//         data:results,
//         message:"Data retrieved successfully",
//       });
//     }
//   }
//   );
// });


// const storage5 = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads");
//   },
//   filename: function (req, file, cb) {
//     const noSpaceInName = file.originalname.replace(/\s+/g, "_");
//     cb(null, `${Date.now()}-${noSpaceInName}`);
//   },
// });

// const upload6 = multer({ storage: storage5 });

// app.put("/api/data/removecustomerfeedbackdocs/:id",(req, res) => {
//   const ID_No = req.params.id;
//   const type = req.body.type
//   connection.query("UPDATE field_docs SET ?? = null WHERE ID_No = ?", [type, ID_No], (err, result) => {
//     if (err) {
//       console.log(err);
//       // return res.status(500).json({ error: "Database error" });
//     } else {
//       res.send("UPDATED");
//     }
//   })
// })

// app.put("/api/data/updatecustomerfeedbackdocs/:id",
//   upload5.fields([
//     { name: "Customer_Feedback" },
//     { name: "Service_Execution_Feedback" },
   
//   ]),
//   (req, res) => {
//     const ID_No = req.params.id;

//     const {
//       Customer_Feedback,
//       Service_Execution_Feedback,
    
//     } = req.files || {};

//     const setFields = [];
//     const values = [];

//     if (Customer_Feedback) {
//       setFields.push("Customer_Feedback = ?");
//       values.push(
//         `${req.protocol}://${req.get("host")}/uploads/${
//           Customer_Feedback[0].filename
//         }`
//       );
//     }

//     if (Service_Execution_Feedback) {
//       setFields.push("Service_Execution_Feedback = ?");
//       values.push(
//         `${req.protocol}://${req.get("host")}/uploads/${Service_Execution_Feedback[0].filename}`
//       );
//     }

  

//     if (setFields.length === 0) {
//       return console.log("////////////////");
//     }

//     const sql = `
//     UPDATE field_docs
//     SET
//     ${setFields.join(", ")}
//     WHERE ID_No = ?
//   `;

//     values.push(ID_No);

//     console.log(sql);
//     connection.query(sql, values, (error, result) => {
//       if (error) {
//         console.log("Error updating record:", error);
//         res.status(500).json({ message: "Internal server error" });
//       } else {
//         res.json({ message: "File URLs updated in the database" });
//       }
//     });
//   }
// );

app.listen(8002, () => {
  console.log("Server started on port 8002");
});

module.exports = connection;

module.exports = router;
