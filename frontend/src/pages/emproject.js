import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Button, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAssignedProjects } from "../api/api";

const EmProject = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignedProjects = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const role = localStorage.getItem("role"); // "employee" or "teamleader"
  
        const fetchedProjects = await getAssignedProjects(userId, role);
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching assigned projects:", error);
      }
    };
  
    fetchAssignedProjects();
  }, []);
  

  const handleViewDetailsClick = (projectId) => {
    const role = localStorage.getItem("role");
  
    if (role === "teamleader") {
      navigate(`/teamleadproject/${projectId}`);
    } else {
      navigate(`/projectdetails/${projectId}`);
    }
  };
  
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #E3F2FD, #BBDEFB)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "60px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="#1565C0"
          mb={3}
          sx={{ textShadow: "2px 2px 10px rgba(0,0,0,0.2)" }}
        >
          Assigned Projects
        </Typography>
      </motion.div>

      <Grid container spacing={3} justifyContent="center" sx={{ width: "80%" }}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project._id}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
              <Card
                sx={{
                  background: "rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(15px)",
                  borderRadius: "15px",
                  padding: "20px",
                  boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
                  transition: "0.3s ease-in-out",
                  minHeight: "180px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" textAlign="center" color="#0D47A1">
                    {project.projectName}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#1565C0",
                      color: "white",
                      marginTop: "15px",
                      fontWeight: "bold",
                      boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
                      transition: "0.3s ease-in-out",
                      "&:hover": {
                        backgroundColor: "#0D47A1",
                      },
                    }}
                    fullWidth
                    onClick={() => handleViewDetailsClick(project._id)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EmProject;
