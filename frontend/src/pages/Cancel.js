import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Box,
  TextField, InputAdornment, Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const CancelPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;
  const navigate = useNavigate();

  const handleDetailsClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/projects"); // Replace with your actual endpoint
        const pendingProjects = response.data.filter(
          (project) => project.status === "Cancel"
        );
        setProjects(pendingProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.teamLeader?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div>
      {/* Search Bar */}
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

      {/* Table */}
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
          <TableRow sx={{ backgroundColor: "#D32F2F" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Sl.No</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Project Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Leader</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Due Date</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentProjects.length > 0 ? (
              currentProjects.map((project, index) => (
                <TableRow
                  key={project._id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#FFEBEE" : "white",
                    "&:hover": { backgroundColor: "#FFCDD2" },
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
                    backgroundColor: "#D32F2F",
                    "&:hover": { backgroundColor: " #FF6F61" },
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
                  No canceled projects found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box display="flex" justifyContent="center" alignItems="center" mt={3} mb={3}>
        <Button
          variant="contained"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          sx={{
            mx: 1,
            backgroundColor: "#D32F2F",
            "&:hover": { backgroundColor: "#B71C1C" },
          }}
        >
          Previous
        </Button>
        <Typography variant="body1" sx={{ mx: 2, fontWeight: "bold", color: "#D32F2F" }}>
          Page {currentPage} of {totalPages}
        </Typography>

        <Button
          variant="contained"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          sx={{
            mx: 1,
            backgroundColor: "#D32F2F",
            "&:hover": { backgroundColor: "#B71C1C" },
          }}
        >
          Next
        </Button>
      </Box>
    </div>
  );
};

export default CancelPage;
