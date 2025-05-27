// import React, { useState, useEffect } from "react";
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   Paper, Box, TextField, InputAdornment, Typography, IconButton, Button
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
// import axios from "axios";

// const Complete = () => {
//   const [projects, setProjects] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const projectsPerPage = 5;

//   // Fetch projects
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/projects");
//         const completed = res.data.filter(p => p.status === "Complete");
//         setProjects(completed);
//       } catch (error) {
//         console.error("Failed to fetch projects:", error);
//       }
//     };
//     fetchProjects();
//   }, []);

//   // Handle search
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1);
//   };

//   const filteredProjects = projects.filter(
//     (project) =>
//       project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (project.teamLeader?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination logic
//   const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
//   const indexOfLastProject = currentPage * projectsPerPage;
//   const indexOfFirstProject = indexOfLastProject - projectsPerPage;
//   const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

//   const handleNextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   const handleDownload = (projectName) => {
//     const filename = `${projectName.replace(/\s+/g, "-").toLowerCase()}.pdf`;
//     const link = document.createElement("a");
//     link.href = `/reports/${filename}`;
//     link.download = filename;
//     link.click();
//   };

//   return (
//     <div>
//       <Box display="flex" justifyContent="flex-end" mt={2} mr={3}>
//         <TextField
//           label="Search Project"
//           variant="outlined"
//           size="small"
//           onChange={handleSearchChange}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon />
//               </InputAdornment>
//             ),
//           }}
//         />
//       </Box>

//       <TableContainer
//         component={Paper}
//         sx={{
//           margin: "auto",
//           width: "90%",
//           borderRadius: 2,
//           boxShadow: 3,
//           overflowX: "auto",
//           mt: 2,
//         }}
//       >
//         <Table>
//           <TableHead>
//             <TableRow sx={{ backgroundColor: "#4CAF50" }}>
//               <TableCell sx={{ color: "white", fontWeight: "bold" }}>Sl.No</TableCell>
//               <TableCell sx={{ color: "white", fontWeight: "bold" }}>Project Name</TableCell>
//               <TableCell sx={{ color: "white", fontWeight: "bold" }}>Leader</TableCell>
//               <TableCell sx={{ color: "white", fontWeight: "bold" }}>Completed On</TableCell>
//               <TableCell sx={{ color: "white", fontWeight: "bold" }}>Download</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {currentProjects.length > 0 ? (
//               currentProjects.map((project, index) => (
//                 <TableRow
//                   key={project._id}
//                   sx={{
//                     backgroundColor: index % 2 === 0 ? "#E8F5E9" : "white",
//                     "&:hover": { backgroundColor: "#C8E6C9" },
//                   }}
//                 >
//                   <TableCell>{indexOfFirstProject + index + 1}</TableCell>
//                   <TableCell>{project.projectName}</TableCell>
//                   <TableCell>{project.teamLeader?.name || "N/A"}</TableCell>
//                   <TableCell>{project.dueDate}</TableCell>
//                   <TableCell>
//                     <IconButton
//                       onClick={() => handleDownload(project.projectName)}
//                       sx={{
//                         color: "#4CAF50",
//                         "&:hover": { color: "#388E3C" },
//                         transition: "color 0.2s ease",
//                       }}
//                     >
//                       <CloudDownloadOutlinedIcon fontSize="medium" />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={5} align="center">
//                   No completed projects found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
//         <Button
//           variant="contained"
//           onClick={handlePrevPage}
//           disabled={currentPage === 1}
//           sx={{ mx: 1 }}
//         >
//           Previous
//         </Button>

//         <Typography variant="body1">
//           Page {currentPage} of {totalPages}
//         </Typography>

//         <Button
//           variant="contained"
//           onClick={handleNextPage}
//           disabled={currentPage === totalPages}
//           sx={{ mx: 1 }}
//         >
//           Next
//         </Button>
//       </Box>
//     </div>
//   );
// };

// export default Complete;

import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Box, TextField, InputAdornment, Typography, Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Complete = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;
  const navigate = useNavigate();

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/projects");
        const completed = res.data.filter(p => p.status === "Complete");
        setProjects(completed);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };
    fetchProjects();
  }, []);

  // Handle search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.teamLeader?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleDetailsClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div>
      <Box display="flex" justifyContent="flex-end" mt={2} mr={3}>
        <TextField
          label="Search Project"
          variant="outlined"
          size="small"
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          margin: "auto",
          width: "90%",
          borderRadius: 2,
          boxShadow: 3,
          overflowX: "auto",
          mt: 2,
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#4CAF50" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Sl.No</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Project Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Leader</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Completed On</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentProjects.length > 0 ? (
              currentProjects.map((project, index) => (
                <TableRow
                  key={project._id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#E8F5E9" : "white",
                    "&:hover": { backgroundColor: "#C8E6C9" },
                  }}
                >
                  <TableCell>{indexOfFirstProject + index + 1}</TableCell>
                  <TableCell>{project.projectName}</TableCell>
                  <TableCell>{project.teamLeader?.name || "N/A"}</TableCell>
                  <TableCell>{project.dueDate}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#43A047",
                        "&:hover": { backgroundColor: "#66BB6A" },
                      }}
                      size="small"
                      onClick={() => handleDetailsClick(project._id)}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No completed projects found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
        <Button
          variant="contained"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          sx={{ mx: 1 }}
        >
          Previous
        </Button>

        <Typography variant="body1">
          Page {currentPage} of {totalPages}
        </Typography>

        <Button
          variant="contained"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          sx={{ mx: 1 }}
        >
          Next
        </Button>
      </Box>
    </div>
  );
};

export default Complete;
