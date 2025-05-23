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
