
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { Typography, Box, Paper, Divider } from "@mui/material";
// import { fetchReportsByProject } from "../api/api"; // adjust path as needed

// const ProjectDetailsPage = () => {
//   const { id } = useParams();
//   const [project, setProject] = useState(null);
//   const [reports, setReports] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch project
//         const projectRes = await axios.get(`http://localhost:5000/api/projects/${id}`);
//         setProject(projectRes.data);

//         // Fetch reports via API helper
//         const reportsRes = await fetchReportsByProject(id);
//         setReports(reportsRes);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [id]);

//   if (!project) return <Typography>Loading project details...</Typography>;

//   return (
//     <Box p={3}>
//       <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
//         <Typography variant="h5" fontWeight="bold" gutterBottom>
//           {project.projectName}
//         </Typography>

//         <Typography variant="subtitle1" gutterBottom>
//           <strong>Team Lead:</strong> {project.teamLeader?.name || "N/A"}
//         </Typography>

//         <Typography variant="subtitle1" gutterBottom>
//           <strong>Status:</strong> {project.status}
//         </Typography>

//         <Divider sx={{ my: 2 }} />

//         {/* Report Details */}
//         <Typography variant="h6" gutterBottom>
//           📄 Report Details
//         </Typography>

//         {reports.length > 0 ? (
//           reports.map((report, index) => (
//             <Box key={index} sx={{ mb: 2 }}>
//               <Typography variant="subtitle2" fontWeight="bold">
//                 {report.teamLeader?.name || "Unknown Team Leader"}
//               </Typography>
//               <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
//                 {report.reportDetails}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 {new Date(report.createdAt).toLocaleString()}
//               </Typography>
//             </Box>
//           ))
//         ) : (
//           <Typography variant="body2">No report details available.</Typography>
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default ProjectDetailsPage;

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Typography,
  Box,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import { fetchReportsByProject } from "../api/api";

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [reports, setReports] = useState([]);
  const contentRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectRes = await axios.get(`http://localhost:5000/api/projects/${id}`);
        setProject(projectRes.data);

        let reportsRes = await fetchReportsByProject(id);

        if (!reportsRes || reportsRes.length === 0) {
          reportsRes = [
            {
              teamLeader: { name: "John Doe" },
              reportDetails:
                "✅ Completed initial setup of the project repository.\n🔧 Working on user authentication and routing setup.",
              createdAt: new Date().toISOString(),
            },
            {
              teamLeader: { name: "Jane Smith" },
              reportDetails:
                "📅 Weekly Summary:\n- Frontend pages designed with React and MUI\n- Backend API endpoints implemented\n- MongoDB integration complete",
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
            {
              teamLeader: { name: "Alice Johnson" },
              reportDetails:
                "📌 Next Steps:\n- Add report export functionality\n- Refactor form validations\n- Implement dark mode toggle",
              createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
            },
          ];
        }

        setReports(reportsRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const downloadPDF = async () => {
    const element = contentRef.current;
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${project?.projectName || "project-details"}.pdf`);
  };

  if (!project) return <Typography>Loading project details...</Typography>;

  return (
    <Box p={3}>
      {/* Button aligned to right */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={downloadPDF}>
          Download PDF
        </Button>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          maxWidth: "800px",
          margin: "auto",
          backgroundColor: "#fff",
        }}
        ref={contentRef}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {project.projectName}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          <strong>Team Lead:</strong> {project.teamLeader?.name || "N/A"}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          <strong>Status:</strong> {project.status}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h5" gutterBottom>
          📄 Report Details
        </Typography>

        {reports.length > 0 ? (
          <Box>
            {reports.map((report, index) => (
              <Paper
                key={index}
                elevation={1}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  backgroundColor: "#f2f2f2",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" color="primary">
                  👤 {report.teamLeader?.name || "Unknown"}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ whiteSpace: "pre-line", mt: 1, mb: 1 }}
                >
                  {report.reportDetails}
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  🕒 {new Date(report.createdAt).toLocaleString()}
                </Typography>
              </Paper>
            ))}
          </Box>
        ) : (
          <Typography variant="body2">No report details available.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ProjectDetailsPage;
