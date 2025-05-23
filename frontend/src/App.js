

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Pages & Components
import Login from "./pages/Login";
import ADDashboard from "./pages/Ad_Dashboard";
import Navbar from "./components/Navbar";
import Report from "./pages/Report";
import Register from "./pages/Register";
import Assign from "./pages/Assign";
import Cancel from "./pages/Cancel";
import Pending from "./pages/Pending";
import ReportIssueTable from "./pages/Complaint";
import DailyUpdateForm from "./pages/Update";
import TLDashboard from "./pages/TL_Dashboard";
import EMDashboard from "./pages/Em_Dashboard";
import Complete from "./pages/Complete";
import Addproject from "./pages/Addproject";
import Assign_Lead from "./pages/Assign_Lead";
import Emproject from "./pages/emproject";
import NotificationsPage from "./pages/notification";
import AssignEmployees from "./pages/AssignEmployee";
import AssignEmployeesList from "./pages/AssignEmployeeList";
import ProjectDetails from "./pages/ProjectDetails";
import TeamLeadTasks from "./pages/TeamLeadTasks"
import TLprojectDetails from "./pages/TLprojectDetails";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import ProjectReport from "./pages/Report";
import ProjectList from "./pages/projectList";
import DeleteEmployee from "./pages/DeleteEmployee";

// Route Protection Component
const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const specificRole = localStorage.getItem("specificRole");

  if (!token) return <Navigate to="/" />;

  if (
    roleRequired === "employee" &&
    role === "employee" &&
    !["Web Developer", "App Developer", "Cloud Engineer", "DevOps", "Tester"].includes(specificRole)
  ) {
    return <Navigate to="/" />;
  }

  if (roleRequired && role !== roleRequired) return <Navigate to="/" />;

  return children;
};

function App() {
  const role = localStorage.getItem("role");
  const specificRole = localStorage.getItem("specificRole");

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/delete" element={<DeleteEmployee />} />

        {/* Dashboard Redirect Based on Role */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {role === "admin" ? (
                <Navigate to="/addashboard" />
              ) : role === "teamleader" ? (
                <Navigate to="/tldashboard" />
              ) : role === "employee" && ["Web Developer", "App Developer", "Cloud Engineer", "DevOps", "Tester"].includes(specificRole) ? (
                <Navigate to="/emdashboard" />
              ) : (
                <Navigate to="/" />
              )}
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/addashboard" element={<ProtectedRoute roleRequired="admin"><ADDashboard /></ProtectedRoute>} />
        <Route path="/addproject" element={<ProtectedRoute roleRequired="admin"><Addproject /></ProtectedRoute>} />
        <Route path="/projectlist" element={<ProtectedRoute roleRequired="admin"><ProjectList /></ProtectedRoute>} />
        <Route path="/assignlead" element={<ProtectedRoute roleRequired="admin"><Assign_Lead /></ProtectedRoute>} />

        {/* Team Leader Routes */}
        <Route path="/tldashboard" element={<ProtectedRoute roleRequired="teamleader"><TLDashboard /></ProtectedRoute>} />
        <Route path="/assign-employees/:projectId" element={<ProtectedRoute roleRequired="teamleader"><AssignEmployees /></ProtectedRoute>} />
        <Route path="/assignemployees" element={<ProtectedRoute roleRequired="teamleader"><AssignEmployeesList/></ProtectedRoute>} />

        {/* Employee Routes */}
        <Route path="/emdashboard" element={<ProtectedRoute roleRequired="employee"><EMDashboard /></ProtectedRoute>} />

        {/* Common Routes */}
        <Route path="/reports" element={<ProtectedRoute><Report /></ProtectedRoute>} />
        <Route path="/assign" element={<ProtectedRoute><Assign /></ProtectedRoute>} />
        <Route path="/cancel" element={<ProtectedRoute><Cancel /></ProtectedRoute>} />
        <Route path="/pending" element={<ProtectedRoute><Pending /></ProtectedRoute>} />
        <Route path="/complaint" element={<ProtectedRoute><ReportIssueTable /></ProtectedRoute>} />
        <Route path="/update" element={<ProtectedRoute><DailyUpdateForm /></ProtectedRoute>} />
        <Route path="/complete" element={<ProtectedRoute><Complete /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Emproject /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/projectdetails/:projectId" element={<ProtectedRoute><ProjectDetails/></ProtectedRoute>} />
        <Route path="/teamleadtasks" element={<ProtectedRoute><TeamLeadTasks /></ProtectedRoute>} />
        <Route path="/teamleadproject/:projectId" element={<ProtectedRoute><TLprojectDetails /></ProtectedRoute>} />
        <Route path="/project/:id" element={<ProjectDetailsPage />} />
        <Route path="/project-report/:projectId" element={<ProtectedRoute><ProjectReport /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
