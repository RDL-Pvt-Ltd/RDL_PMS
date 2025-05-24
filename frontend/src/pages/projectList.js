

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Divider,
  CircularProgress,
  IconButton,
  Button,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';

const ProjectList = () => {
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const projectsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects');
        const data = await response.json();
        if (Array.isArray(data)) {
          setProjectData(data);
        } else if (Array.isArray(data.projects)) {
          setProjectData(data.projects);
        } else {
          setProjectData([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project data:', error);
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const getStatusColor = (status) => {
    const normalized = (status || '').toLowerCase().trim();
    if (['completed', 'complete'].includes(normalized)) return '#4caf50'; // green
    if (['cancelled', 'canceled', 'cancel'].includes(normalized)) return '#f44336'; // red
    return '#ff9800'; // orange
  };

  const getProgressValue = (project) => {
    const status = (project.status || '').toLowerCase().trim();
    if (status === 'complete' || status === 'completed') return 100;
    if (status === 'cancel' || status === 'cancelled' || status === 'canceled') return 0;
    return project.pendingPercentage || 0;
  };

  const startIndex = (page - 1) * projectsPerPage;
  const paginatedProjects = Array.isArray(projectData)
    ? projectData.slice(startIndex, startIndex + projectsPerPage)
    : [];
  const totalPages = Array.isArray(projectData)
    ? Math.ceil(projectData.length / projectsPerPage)
    : 0;

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold" color="#1e3a8a">
          Project List
        </Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
          onClick={() => navigate('/addproject')}
        >
          Add Project
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: '15px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              }}
            >
              <CardContent>
                <Grid
                  container
                  spacing={1}
                  sx={{
                    fontWeight: 'bold',
                    mb: 1,
                    backgroundColor: '#005792',
                    color: '#ffffff',
                    padding: '10px',
                    borderRadius: '8px',
                  }}
                >
                  <Grid item xs={1}>
                    <Typography>Sl No.</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography>Project Name</Typography>
                  </Grid>
                  <Grid item xs={2.5}>
                    <Typography>Assigned To</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography>Due Date</Typography>
                  </Grid>
                  <Grid item xs={2.5}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography>Progress</Typography>
                  </Grid>
                </Grid>
                <Divider />

                {paginatedProjects.length === 0 ? (
                  <Typography sx={{ textAlign: 'center', mt: 3 }}>
                    No projects to display.
                  </Typography>
                ) : (
                  paginatedProjects.map((project, index) => {
                    const progressValue = getProgressValue(project);
                    const color =
                      progressValue === 100
                        ? '#4caf50'
                        : progressValue === 0
                        ? '#f44336'
                        : '#ff9800';

                    return (
                      <Grid container spacing={1} key={project._id || index} sx={{ py: 1 }}>
                        <Grid item xs={1}>
                          <Typography>{startIndex + index + 1}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography>{project.projectName}</Typography>
                        </Grid>
                        <Grid item xs={2.5}>
                          <Typography>{project.teamLeader?.name || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography>{project.dueDate || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={2.5}>
                          <Box
                            sx={{
                              backgroundColor: getStatusColor(project.status),
                              color: '#fff',
                              px: 2,
                              py: 0.5,
                              borderRadius: '8px',
                              display: 'inline-block',
                              fontWeight: 'bold',
                              textAlign: 'center',
                              minWidth: '90px',
                            }}
                          >
                            {project.status || 'Pending'}
                          </Box>
                        </Grid>
                        <Grid item xs={1}>
                          <Box
                            position="relative"
                            display="inline-flex"
                            sx={{ cursor: 'pointer' }}
                            //onClick={() => navigate(`/projectdetails/${project._id}`)}
                          >
                            <CircularProgress
                              variant="determinate"
                              value={progressValue}
                              size={40}
                              thickness={5}
                              sx={{ color }}
                            />
                            <Box
                              top={0}
                              left={0}
                              bottom={0}
                              right={0}
                              position="absolute"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Typography
                                variant="caption"
                                component="div"
                                sx={{
                                  color,
                                  fontWeight: 'bold',
                                }}
                              >
                                {`${Math.round(progressValue)}%`}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    );
                  })
                )}
              </CardContent>

              <Box display="flex" justifyContent="center" alignItems="center" p={2}>
                <IconButton
                  size="small"
                  sx={{ border: '1px solid #1e3a8a', borderRadius: '50%', mx: 1, color: '#1e3a8a' }}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <Typography fontWeight="bold" color="#1e3a8a">
                  Page {page} of {totalPages}
                </Typography>
                <IconButton
                  size="small"
                  sx={{ border: '1px solid #1e3a8a', borderRadius: '50%', mx: 1, color: '#1e3a8a' }}
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ProjectList;
