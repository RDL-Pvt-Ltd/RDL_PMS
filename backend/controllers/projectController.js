
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Project = require("../models/project");
const Notification = require("../models/notification");

//  Get all employees
exports.getAllEmployee = async (req, res) => {
  try {
    const employee = await User.find({ role: 'employee' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error in finding the employee', error });
  }
};

//  Get all team leaders
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

//  Create a new project and notify the assigned team leader
exports.createProject = async (req, res) => {
  try {
    const { projectName, description, dueDate, teamLeader } = req.body;

    if (!projectName || !description || !dueDate || !teamLeader) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProject = new Project({
      projectName,
      description,
      dueDate, 
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
    console.error(" Error creating project:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//  Get project by ID
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
    console.error(" Error fetching project:", error);
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



 
//  Update Project Status
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
    console.error(" Error updating project status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//update pending percentage

exports.updatePendingPercentage = async (req, res) => {
  const { projectId } = req.params;
  const { pendingPercentage } = req.body;

  if (pendingPercentage < 0 || pendingPercentage > 100) {
    return res.status(400).json({ message: 'Percentage must be between 0 and 100.' });
  }

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Only update if the project is still pending
    if (project.status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot update percentage unless status is Pending.' });
    }

    project.pendingPercentage = pendingPercentage;
    await project.save();

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error updating pending percentage', error });
  }
};

