const router = require('express').Router();
const multer = require("multer");
const { uploadById } = require('../controllers/manualDocs.controller');

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

router.get("/")

router.put("/:id", upload5.fields([
    { name: "Team_Selection" },
    { name: "SQP" },
    { name: "Risk_Assessment" },
    { name: "Contract_Review" },
    { name: "Enquiry" },
    { name: "Order_Confirmation" },
    { name: "Customer_Feedback" },
    { name: "Service_Execution_Feedback" },
]), uploadById)
module.exports = router;