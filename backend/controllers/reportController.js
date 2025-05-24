const Report = require("../models/reportModel");
const Project = require("../models/project");

exports.createReport = async (req, res) => {
  const { projectId } = req.params;
  const { reportDetails } = req.body;
  const teamLeaderId = req.user.id;
  // from auth middleware

  // console.log('Team Leader ID:', teamLeaderId);  // Debugging step

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const report = new Report({
      project: projectId,
      teamLeader: teamLeaderId,  // Ensure this is being set
      reportDetails,
    });

    await report.save();
    res.status(201).json(report);
  } catch (err) {
    console.error("Error creating report:", err);
    res.status(500).json({ message: "Server error while creating report" });
  }
};


//get report details

exports.getReportsByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const reports = await Report.find({ project: projectId })
      .populate("teamLeader", "name") // populate team leader's name
      .sort({ createdAt: -1 }); // latest reports first

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

