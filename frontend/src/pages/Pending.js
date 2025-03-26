import React from "react";
import {  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import Navbar from "../components/Navbar";
const pendingProjects = [
  { id: 1, name: "Website Redesign", leader: "Alice", dueDate: "25 Mar 2025" },
  { id: 2, name: "Mobile App Development", leader: "Bob", dueDate: "30 Mar 2025" },
  { id: 3, name: "Marketing Campaign", leader: "Charlie", dueDate: "18 Mar 2025" },
  { id: 4, name: "CRM Integration", leader: "David", dueDate: "28 Mar 2025" },
  { id: 5, name: "Security Audit", leader: "Eva", dueDate: "5 Apr 2025" }
];

const PendingPage = () => {
  return (
    <div>
    
        <Navbar/>
      <TableContainer component={Paper} sx={{ marginTop: 3, width: "90%", margin: "auto" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#80DEEA" }}>
              <TableCell><b>Sl.No</b></TableCell>
              <TableCell><b>Project Name</b></TableCell>
              <TableCell><b>Leader</b></TableCell>
              <TableCell><b>Due Date</b></TableCell>
              <TableCell><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.id}</TableCell>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.leader}</TableCell>
                <TableCell>{project.dueDate}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" size="small">Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PendingPage;