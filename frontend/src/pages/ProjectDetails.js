import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Paper,
  Grid,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  AssignmentOutlined,
  PeopleAltOutlined,
  PersonOutline,
  DescriptionOutlined,
  DoneAll,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { getProjectById } from '../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [teamLeaderName, setTeamLeaderName] = useState('');
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [pendingPercentage, setPendingPercentage] = useState(0);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(projectId);
        setProjectName(data.projectName);
        setDescription(data.description);
        setTeamLeaderName(data.teamLeader?.name || 'N/A');
        setAssignedEmployees(data.assignedEmployees || []);
        setPendingPercentage(data.pendingPercentage || 0);
        setStatus(data.status || '');
      } catch (error) {
        toast.error('Error fetching project data.');
      }
    };

    fetchProject();
  }, [projectId]);

  const handleDone = () => {
    navigate('/addashboard');
  };

  const getProgressColor = () => {
    const normalized = status.toLowerCase();
    if (normalized === 'completed' || normalized === 'complete') return '#4caf50';
    if (normalized === 'cancelled' || normalized === 'canceled') return '#f44336';
    return '#ff9800';
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', my: 6 }}>
      <Paper elevation={6} sx={{ borderRadius: 4, p: 4, background: '#f4f7fb' }}>
        <Box
          sx={{
            mb: 4,
            p: 2,
            borderRadius: 2,
            textAlign: 'center',
            background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            <AssignmentOutlined sx={{ verticalAlign: 'middle', mr: 1 }} />
            Project Details
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column: Project Details */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  <AssignmentOutlined fontSize="small" sx={{ mr: 1 }} /> Project Name
                </Typography>
                <Typography variant="h6">{projectName}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  <PersonOutline fontSize="small" sx={{ mr: 1 }} /> Team Leader
                </Typography>
                <Typography variant="body1">{teamLeaderName}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  <DescriptionOutlined fontSize="small" sx={{ mr: 1 }} /> Description
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {description}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* Right Column: Progress Status */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Project Progress
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={pendingPercentage}
                  size={140}
                  thickness={5}
                  sx={{ color: getProgressColor(), transition: '0.5s ease' }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h4" component="div" color="text.primary">
                    {`${pendingPercentage}%`}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="subtitle1" sx={{ mt: 2 }} color="text.secondary">
                {status || 'In Progress'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h6"
          sx={{ mb: 1, display: 'flex', alignItems: 'center' }}
        >
          <PeopleAltOutlined sx={{ mr: 1, color: '#1976d2' }} /> Assigned Employees
        </Typography>

        {assignedEmployees.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {assignedEmployees.map((emp) => (
              <Chip
                key={emp._id}
                avatar={<Avatar>{emp.name?.[0]}</Avatar>}
                label={`${emp.name} • ${emp.specificRole || 'N/A'}`}
                variant="outlined"
                sx={{ backgroundColor: '#e3f2fd' }}
              />
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            No employees assigned yet.
          </Typography>
        )}

        <Box sx={{ textAlign: 'center', mt: 5 }}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<DoneAll />}
            size="large"
            sx={{ px: 5 }}
            onClick={handleDone}
          >
            Done
          </Button>
        </Box>
      </Paper>

      <ToastContainer />
    </Box>
  );
};

export default ProjectDetails;
