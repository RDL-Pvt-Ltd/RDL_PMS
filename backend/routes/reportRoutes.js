const express = require('express');
const { createReport, getReportsByProject } = require("../controllers/reportController");
const { authenticateToken } = require("../middlewares/authMiddleware") ;

const router = express.Router();

router.post("/reports/:projectId", authenticateToken, createReport); // Submit report
router.get("/reports/project/:projectId", authenticateToken, getReportsByProject);

module.exports= router;
