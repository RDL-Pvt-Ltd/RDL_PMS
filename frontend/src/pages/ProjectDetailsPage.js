
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Typography, Box, Paper, Divider } from "@mui/material";
import { fetchReportsByProject } from "../api/api"; // adjust path as needed

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch project
        const projectRes = await axios.get(`http://localhost:5000/api/projects/${id}`);
        setProject(projectRes.data);

        // Fetch reports via API helper
        const reportsRes = await fetchReportsByProject(id);
        setReports(reportsRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!project) return <Typography>Loading project details...</Typography>;

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {project.projectName}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          <strong>Team Lead:</strong> {project.teamLeader?.name || "N/A"}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          <strong>Status:</strong> {project.status}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Report Details */}
        <Typography variant="h6" gutterBottom>
          📄 Report Details
        </Typography>

        {reports.length > 0 ? (
          reports.map((report, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {report.teamLeader?.name || "Unknown Team Leader"}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                {report.reportDetails}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(report.createdAt).toLocaleString()}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2">No report details available.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ProjectDetailsPage;
