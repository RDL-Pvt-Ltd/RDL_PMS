const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Function to initialize admin if not already present
exports.initializeAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ role: 'admin' });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
            await User.create({
                name: 'Admin',
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
                role: 'admin' // ❌ Removed specificRole since it's not needed for admin
            });

            console.log('Admin user initialized successfully');
        }
    } catch (error) {
        console.error('Error initializing admin:', error);
    }
};


// Admin Login
exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await User.findOne({ email, role: 'admin' });

        if (!admin) {
            return res.status(401).json({ message: 'Admin not found' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Admin logged in successfully', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add User (Only Admin Can Do This)
exports.addUser = async (req, res) => {
    const { name, email, password, role, specificRole } = req.body;

    try {
        // Validate role
        if (!['teamleader', 'employee'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Ensure specificRole is provided only for employees
        const userData = { name, email, password: await bcrypt.hash(password, 10), role };
        if (role === 'employee') {
            if (!['Web Developer', 'App Developer', 'Cloud Engineer', 'DevOps', 'Tester'].includes(specificRole)) {
                return res.status(400).json({ message: 'Invalid specific role for employee' });
            }
            userData.specificRole = specificRole;
        }

        // Check if user already exists
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const newUser = await User.create(userData);
        res.status(201).json({ message: `${role} added successfully`, user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//delete user

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Normal User Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // Build the base response
      const responsePayload = {
        token,
        role: user.role,
        userId: user._id,
      };
  
      // Include specificRole only for employee
      if (user.role === 'employee') {
        responsePayload.specificRole = user.specificRole;
      }
  
      res.json(responsePayload);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
