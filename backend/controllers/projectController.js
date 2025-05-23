// const mongoose = require("mongoose"); // ✅ Needed for ObjectId validation
// const User = require("../models/userModel");
// const Project = require("../models/project");
// const Notification = require("../models/notification");

// // ✅ Get all employees
// exports.getAllEmployee = async (req, res) => {
//   try {
//     const employee = await User.find({ role: 'employee' });
//     res.status(200).json(employee);
//   } catch (error) {
//     res.status(500).json({ message: 'Error in finding the employee', error });
//   }
// };

// // ✅ Get all team leaders
// exports.getTeamLeader = async (req, res) => {
//   try {
//     const teamLead = await User.find({ role: 'teamleader' });
//     res.status(200).json(teamLead);
//   } catch (error) {
//     res.status(500).json({ message: 'Error in finding the team leader', error });
//   }
// };

// // ✅ Create a new project and notify the assigned team leader
// exports.createProject = async (req, res) => {
//   try {
//     const { projectName, description, teamLeader } = req.body;

//     if (!projectName || !description || !teamLeader) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const newProject = new Project({
//       projectName,
//       description,
//       teamLeader,
//     });

//     const savedProject = await newProject.save();

//     // Notify the team leader
//     await Notification.create({
//       userId: teamLeader._id || teamLeader,
//       message: `You have been assigned a new project: ${projectName}`,
//       projectId: savedProject._id,
//     });

//     res.status(201).json({
//       message: "Project saved and team leader notified",
//       project: savedProject,
//     });
//   } catch (error) {
//     console.error("❌ Error creating project:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ✅ Get all projects
// exports.getProjects = async (req, res) => {
//   try {
//     const projects = await Project.find();
//     res.status(200).json(projects);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // ✅ Get project by ID
// exports.getProjectById = async (req, res) => {
//   try {
//     const { projectId } = req.params;

//     const project = await Project.findById(projectId)
//       .populate("employees", "name specificRole") // Include name and specificRole
//       .populate("assignedEmployees", "name specificRole");

//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     res.status(200).json(project);
//   } catch (error) {
//     console.error("❌ Error fetching project:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// exports.getProjectsByEmployee = async (req, res) => {
//   try {
//     const { employeeId } = req.params; // Extract the employee ID from the request parameters

//     console.log('Employee ID:', employeeId); // Log employeeId for debugging purposes

//     // Check if employeeId is valid (e.g., not empty, and ensure it's an ObjectId if you're using MongoDB)
//     if (!employeeId || !/^[0-9a-fA-F]{24}$/.test(employeeId)) {
//       return res.status(400).json({ message: 'Invalid employee ID' });
//     }

//     // Fetch projects that are assigned to the employee
//     const projects = await Project.find({ assignedEmployees: employeeId }).lean(); // Use `.lean()` for a plain JS object response

//     console.log('Fetched Projects:', projects); // Log fetched projects for debugging

//     // If no projects are found, return a 404 status with a message
//     if (!projects || projects.length === 0) {
//       return res.status(404).json({ message: 'No projects found for this employee' });
//     }

//     // Return the fetched projects with a 200 OK response
//     return res.status(200).json(projects);

//   } catch (error) {
//     // Log the error for debugging purposes
//     console.error('Error fetching projects:', error);

//     // Return a 500 status with an error message if there was a server issue
//     return res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

const mongoose = require("mongoose");
const User = require("../models/userModel");
const Project = require("../models/project");
const Notification = require("../models/notification");

// ✅ Get all employees
exports.getAllEmployee = async (req, res) => {
  try {
    const employee = await User.find({ role: 'employee' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error in finding the employee', error });
  }
};

// ✅ Get all team leaders
exports.getTeamLeader = async (req, res) => {
  try {
    const teamLead = await User.find({ role: 'teamleader' });
    res.status(200).json(teamLead);
  } catch (error) {
    res.status(500).json({ message: 'Error in finding the team leader', error });
  }
};

//get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['employee', 'teamleader'] } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// ✅ Create a new project and notify the assigned team leader
exports.createProject = async (req, res) => {
  try {
    const { projectName, description, dueDate, teamLeader } = req.body;

    if (!projectName || !description || !dueDate || !teamLeader) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProject = new Project({
      projectName,
      description,
      dueDate, // ⬅️ No conversion to Date object
      teamLeader,
    });

    const savedProject = await newProject.save();

    await Notification.create({
      userId: teamLeader._id || teamLeader,
      message: `You have been assigned a new project: ${projectName}`,
      projectId: savedProject._id,
    });

    res.status(201).json({
      message: "Project saved and team leader notified",
      project: savedProject,
    });
  } catch (error) {
    console.error("❌ Error creating project:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate("employees", "name specificRole")
      .populate("assignedEmployees", "name specificRole");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("❌ Error fetching project:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getProjectsForEmployee = async (req, res) => {
  const { id } = req.params;
  const projects = await Project.find({ assignedEmployees: id });
  res.json(projects);
};

exports.getProjectsForTeamLeader = async (req, res) => {
  const { id } = req.params;
  try {
    const projects = await Project.find({ 'teamLeader._id': id })
      .populate('assignedEmployees', 'name role'); // Optional: if needed on frontend

    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects for team leader:", error);
    res.status(500).json({ message: "Server error while fetching projects" });
  }
};



 
// ✅ Update Project Status
exports.updateProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Complete', 'Cancel'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const project = await Project.findByIdAndUpdate(
      projectId,
      { status },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({
      success: true, // Add this line
      message: "Project status updated successfully",
      project,
    });    
  } catch (error) {
    console.error("❌ Error updating project status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Project Team Members (Add more employees)
// exports.updateProjectTeamMembers = async (req, res) => {
//   try {
//     const { projectId } = req.params;
//     const { additionalEmployees } = req.body;

//     if (!Array.isArray(additionalEmployees) || additionalEmployees.length === 0) {
//       return res.status(400).json({ message: "No employees provided to add" });
//     }

//     const project = await Project.findById(projectId);

//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     // Add new employees to assignedEmployees
//     project.assignedEmployees = [...new Set([...project.assignedEmployees, ...additionalEmployees])];

//     const updatedProject = await project.save();

//     res.status(200).json({
//       message: "Project team members updated successfully",
//       project: updatedProject,
//     });
//   } catch (error) {
//     console.error("❌ Error updating project team members:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

