// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./App.css";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Ad_Dashboard"
// import Navbar from "./components/Navbar";
// import Employees from "./pages/Employees";
// import Report from "./pages/Report";
// import Register from "./pages/Register";
// import Assign from "./pages/Assign"
// import Cancel from "./pages/Cancel"
// import Pending from "./pages/Pending"
// import ReportIssueTable from "./pages/Complaint"
// import DailyUpdateForm from "./pages/Update"
// import TLDashboard from "./pages/TL_Dashboard";
// import EMDashboard from "./pages/Em_Dashboard";
// import Complete from "./pages/Complete";
// import Addproject from "./pages/Addproject";
// import Assign_Lead from "./pages/Assign_Lead";
// import Emproject from "./pages/emproject";

// function App() {

//   return (
//     <Router>
//       <Navbar/>
//       <Routes>
//         <Route path="/" element={<Login/>} />
//         <Route path="/register" element={<Register/>} />
//         <Route path="/Navbar" element={<Navbar />} />
//         <Route path="/dashboard" element={<Dashboard />} />
       
//         <Route path="/employees" element= {<Employees/>}/>
//         <Route path="/reports" element={<Report />} />
//         <Route path="/assign" element={<Assign/>} />
//         <Route path="/cancel" element={<Cancel/>} />
//         <Route path="/pending" element={<Pending/>} />
//         <Route path="/complaint" element ={<ReportIssueTable />} />
//         <Route path="/update" element ={<DailyUpdateForm/>}/>
//         <Route path="/emdashboard" element ={<EMDashboard/>}/>
//         <Route path="/tldashboard" element ={<TLDashboard/>}/>
//         <Route path="/complete" element ={<Complete/>}/>
//         <Route path="/addproject" element ={<Addproject/>}/>
//         <Route path="/assignlead" element ={<Assign_Lead/>}/>
//         <Route path="/projects" element ={<Emproject/>}/>
        
//       </Routes>
//     </Router>
//   );
// }

// export default App;



// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import "./App.css";
// import Login from "./pages/Login";
// import ADDashboard from "./pages/Ad_Dashboard";
// import Navbar from "./components/Navbar";
// import Employees from "./pages/Employees";
// import Report from "./pages/Report";
// import Register from "./pages/Register";
// import Assign from "./pages/Assign";
// import Cancel from "./pages/Cancel";
// import Pending from "./pages/Pending";
// import ReportIssueTable from "./pages/Complaint";
// import DailyUpdateForm from "./pages/Update";
// import TLDashboard from "./pages/TL_Dashboard";
// import EMDashboard from "./pages/Em_Dashboard";
// import Complete from "./pages/Complete";
// import Addproject from "./pages/Addproject";
// import Assign_Lead from "./pages/Assign_Lead";
// import Emproject from "./pages/emproject";

// const ProtectedRoute = ({ children, roleRequired }) => {
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   if (!token) return <Navigate to="/" />;
//   if (roleRequired && role !== roleRequired) return <Navigate to="/" />;
//   return children;
// };

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* Unified Role-Based Redirection */}
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               {localStorage.getItem("role") === "admin" ? (
//                 <Navigate to="/addashboard" />
//               ) : localStorage.getItem("role") === "teamleader" ? (
//                 <Navigate to="/tldashboard" />
//               ) : localStorage.getItem("role") === "employee" ? (
//                 <Navigate to="/emdashboard" />
//               ) : (
//                 <Navigate to="/" />
//               )}
//             </ProtectedRoute>
//           }
//         />

//         {/* Admin Dashboard */}
//         <Route path="/addashboard" element={<ProtectedRoute roleRequired="admin"><ADDashboard /></ProtectedRoute>} />

//         {/* Team Leader Dashboard */}
//         <Route path="/tldashboard" element={<ProtectedRoute roleRequired="teamleader"><TLDashboard /></ProtectedRoute>} />

//         {/* Employee Dashboard (Handles all specific roles) */}
//         <Route path="/emdashboard" element={<ProtectedRoute roleRequired="employee"><EMDashboard /></ProtectedRoute>} />

//         {/* General Protected Routes */}
//         <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
//         <Route path="/reports" element={<ProtectedRoute><Report /></ProtectedRoute>} />
//         <Route path="/assign" element={<ProtectedRoute><Assign /></ProtectedRoute>} />
//         <Route path="/cancel" element={<ProtectedRoute><Cancel /></ProtectedRoute>} />
//         <Route path="/pending" element={<ProtectedRoute><Pending /></ProtectedRoute>} />
//         <Route path="/complaint" element={<ProtectedRoute><ReportIssueTable /></ProtectedRoute>} />
//         <Route path="/update" element={<ProtectedRoute><DailyUpdateForm /></ProtectedRoute>} />
//         <Route path="/complete" element={<ProtectedRoute><Complete /></ProtectedRoute>} />
//         <Route path="/addproject" element={<ProtectedRoute><Addproject /></ProtectedRoute>} />
//         <Route path="/assignlead" element={<ProtectedRoute><Assign_Lead /></ProtectedRoute>} />
//         <Route path="/projects" element={<ProtectedRoute><Emproject /></ProtectedRoute>} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;




import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import ADDashboard from "./pages/Ad_Dashboard";
import Navbar from "./components/Navbar";
import Employees from "./pages/Employees";
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

const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/" />;
  
  // Allow Employees with specific roles
  if (roleRequired === "employee" && !["Web Developer", "App Developer", "Cloud Engineer", "DevOps", "Tester"].includes(role)) {
    return <Navigate to="/" />;
  }

  if (roleRequired && role !== roleRequired) return <Navigate to="/" />;
  return children;
};

function App() {
  const userRole = localStorage.getItem("role"); // Store role in a variable

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Role-Based Dashboard Redirection */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {userRole === "admin" ? (
                <Navigate to="/addashboard" />
              ) : userRole === "teamleader" ? (
                <Navigate to="/tldashboard" />
              ) : ["Web Developer", "App Developer", "Cloud Engineer", "DevOps", "Tester"].includes(userRole) ? (
                <Navigate to="/emdashboard" />
              ) : (
                <Navigate to="/" />
              )}
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route path="/addashboard" element={<ProtectedRoute roleRequired="admin"><ADDashboard /></ProtectedRoute>} />

        {/* Team Leader Dashboard */}
        <Route path="/tldashboard" element={<ProtectedRoute roleRequired="teamleader"><TLDashboard /></ProtectedRoute>} />

        {/* Employee Dashboard (Handles all specific roles) */}
        <Route path="/emdashboard" element={<ProtectedRoute roleRequired="employee"><EMDashboard /></ProtectedRoute>} />

        {/* General Protected Routes */}
        <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Report /></ProtectedRoute>} />
        <Route path="/assign" element={<ProtectedRoute><Assign /></ProtectedRoute>} />
        <Route path="/cancel" element={<ProtectedRoute><Cancel /></ProtectedRoute>} />
        <Route path="/pending" element={<ProtectedRoute><Pending /></ProtectedRoute>} />
        <Route path="/complaint" element={<ProtectedRoute><ReportIssueTable /></ProtectedRoute>} />
        <Route path="/update" element={<ProtectedRoute><DailyUpdateForm /></ProtectedRoute>} />
        <Route path="/complete" element={<ProtectedRoute><Complete /></ProtectedRoute>} />
        <Route path="/addproject" element={<ProtectedRoute><Addproject /></ProtectedRoute>} />
        <Route path="/assignlead" element={<ProtectedRoute><Assign_Lead /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Emproject /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
