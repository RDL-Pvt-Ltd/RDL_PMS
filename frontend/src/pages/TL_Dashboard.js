

import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, Typography, Grid, Box, Divider, CircularProgress, IconButton,
} from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { fetchTeamLeaderProjects } from '../api/api'; // Make sure this path is correct

ChartJS.register(ArcElement, Tooltip, Legend);

const AnimatedCounter = ({ target, delay = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
      const end = parseInt(target);
      const duration = 1000;
      const incrementTime = 30;
      const steps = duration / incrementTime;
      const stepValue = end / steps;

      const counter = setInterval(() => {
        start += stepValue;
        if (start >= end) {
          setCount(end);
          clearInterval(counter);
        } else {
          setCount(Math.ceil(start));
        }
      }, incrementTime);
    }, delay);

    return () => clearTimeout(timeout);
  }, [target, delay]);

  return <>{count}</>;
};

const ProjectDashboard = () => {
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const projectsPerPage = 8;
  const [totalProjects, setTotalProjects] = useState(0);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Make sure userId is stored
        if (!userId) throw new Error('User ID not found in localStorage');

        const teamLeaderProjects = await fetchTeamLeaderProjects(userId);
        setProjectData(teamLeaderProjects);
        setTotalProjects(teamLeaderProjects.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching team leader projects:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stats');
        const stats = await response.json();
        setEmployeesCount(stats.employees);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    const timer = setTimeout(() => setChartReady(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const normalizeStatus = (status) => (status || '').toLowerCase().trim();

  const statuses = projectData.reduce(
    (acc, project) => {
      const status = normalizeStatus(project.status);
      if (['completed', 'complete'].includes(status)) acc.completed += 1;
      else if (['cancelled', 'canceled', 'cancel'].includes(status)) acc.cancelled += 1;
      else acc.pending += 1;
      return acc;
    },
    { completed: 0, pending: 0, cancelled: 0 }
  );

  const getStatusColor = (status) => {
    const normalized = normalizeStatus(status);
    if (['completed', 'complete'].includes(normalized)) return '#4caf50';
    if (['cancelled', 'canceled', 'cancel'].includes(normalized)) return '#f44336';
    return '#ff9800';
  };

  const chartData = {
    labels: ['Completed', 'Pending', 'Cancelled'],
    datasets: [{
      data: [statuses.completed, statuses.pending, statuses.cancelled],
      backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
      borderWidth: 2,
    }],
  };

  const chartOptions = {
    responsive: true,
    animation: { animateRotate: true, duration: 1500 },
  };

  const startIndex = (page - 1) * projectsPerPage;
  const paginatedProjects = projectData.slice(startIndex, startIndex + projectsPerPage);
  const totalPages = Math.ceil(projectData.length / projectsPerPage);

  return (
    <Box p={3} sx={{ backgroundColor: '#f5f9ff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" fontWeight="bold" color="#1e3a8a" mb={3}>
        TeamLead Dashboard
      </Typography>

      <Grid container spacing={3}>
        {[{
          title: 'Total Projects', value: totalProjects, color: '#1e3a8a', bg: '#b3d4fc'
        }, {
          title: 'Employees', value: employeesCount, color: '#0d47a1', bg: '#e2f1ff'
        }].map((item, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card sx={{
              background: `linear-gradient(145deg, ${item.bg}, white)`,
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              borderRadius: '15px',
              transition: '0.3s',
              '&:hover': { boxShadow: 8, transform: 'scale(1.05)' },
            }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" color="#1e3a8a">
                  {item.title}
                </Typography>
                <Typography variant="h3" color={item.color} fontWeight="bold">
                  <AnimatedCounter target={item.value} delay={index * 300} />
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" fontWeight="bold" color="#1e3a8a" sx={{ mb: 2 }}>
        Project List
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ backgroundColor: '#ffffff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', height: '100%' }}>
              <CardContent>
                <Grid container spacing={1} sx={{ fontWeight: 'bold', mb: 1, backgroundColor: '#005792', color: '#ffffff', padding: '10px', borderRadius: '8px' }}>
                  <Grid item xs={2}><Typography>Sl No.</Typography></Grid>
                  <Grid item xs={4}><Typography>Project Name</Typography></Grid>
                  <Grid item xs={3}><Typography>Due Date</Typography></Grid>
                  <Grid item xs={3}><Typography>Status</Typography></Grid>
                </Grid>
                <Divider />
                {paginatedProjects.map((project, index) => (
                  <Grid container spacing={1} key={index} sx={{ py: 1 }}>
                    <Grid item xs={2}><Typography>{startIndex + index + 1}</Typography></Grid>
                    <Grid item xs={4}><Typography>{project.projectName}</Typography></Grid>
                    <Grid item xs={3}><Typography>{project.dueDate || 'N/A'}</Typography></Grid>
                    <Grid item xs={3}>
                      <Box sx={{
                        backgroundColor: getStatusColor(project.status),
                        color: '#fff',
                        px: 2,
                        py: 0.5,
                        borderRadius: '8px',
                        display: 'inline-block',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        minWidth: '90px',
                      }}>
                        {project.status}
                      </Box>
                    </Grid>
                  </Grid>
                ))}
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
                <Typography fontWeight="bold" color="#1e3a8a">Page {page} of {totalPages}</Typography>
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

          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#ffffff', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', height: '100%' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" align="center" sx={{ fontWeight: 'bold', mb: 1, backgroundColor: '#005792', color: '#ffffff', padding: '10px', borderRadius: '8px' }}>
                  Project Status Breakdown
                </Typography>
                {chartReady && (
                  <Box sx={{ width: '350px', height: '350px', mx: 'auto' }}>
                    <Doughnut data={chartData} options={chartOptions} />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ProjectDashboard;
