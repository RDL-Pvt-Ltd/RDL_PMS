import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Ad_Dashboard"
import Navbar from "./components/Navbar";
import Employees from "./pages/Employees";
import Report from "./pages/Report";
import Register from "./pages/Register";
import Assign from "./pages/Assign"
import Cancel from "./pages/Cancel"
import Pending from "./pages/Pending"
import ReportIssueTable from "./pages/Complaint"
import DailyUpdateForm from "./pages/Update"
import TLDashboard from "./pages/TL_Dashboard";
import EMDashboard from "./pages/Em_Dashboard";
import Complete from "./pages/Complete";
import Addproject from "./pages/Addproject";
import Assign_Lead from "./pages/Assign_Lead";

function App() {

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/Navbar" element={<Navbar />} />
        <Route path="/dashboard" element={<Dashboard />} />
       
        <Route path="/employees" element= {<Employees/>}/>
        <Route path="/reports" element={<Report />} />
        <Route path="/assign" element={<Assign/>} />
        <Route path="/cancel" element={<Cancel/>} />
        <Route path="/pending" element={<Pending/>} />
        <Route path="/complaint" element ={<ReportIssueTable />} />
        <Route path="/update" element ={<DailyUpdateForm/>}/>
        <Route path="/emdashboard" element ={<EMDashboard/>}/>
        <Route path="/tldashboard" element ={<TLDashboard/>}/>
        <Route path="/complete" element ={<Complete/>}/>
        <Route path="/addproject" element ={<Addproject/>}/>
        <Route path="/assignlead" element ={<Assign_Lead/>}/>
      </Routes>
    </Router>
  );
}

export default App;
