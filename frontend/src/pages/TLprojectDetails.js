
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
} from '@mui/material';
import {
  AssignmentIndOutlined,
  DescriptionOutlined,
  GroupAddOutlined,
  FlagOutlined,
} from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getProjectById, updateProjectStatus, updatePendingPercentage } from '../api/api';

const TLprojectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [teamLeaderName, setTeamLeaderName] = useState('');
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [originalEmployees, setOriginalEmployees] = useState([]);
  const [status, setStatus] = useState('Pending');
  const [originalStatus, setOriginalStatus] = useState('Pending');
  const [pendingPercentage, setPendingPercentage] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(projectId);
        setProjectName(data.projectName);
        setDescription(data.description);
        setTeamLeaderName(data.teamLeader?.name || 'N/A');

        let updatedList = data.assignedEmployees || [];
        if (location.state?.updatedEmployees) {
          updatedList = location.state.updatedEmployees;
        }

        setAssignedEmployees(updatedList);
        setOriginalEmployees(data.assignedEmployees || []);
        setStatus(data.status || 'Pending');
        setOriginalStatus(data.status || 'Pending');
        setPendingPercentage(data.pendingPercentage || 0);
      } catch (error) {
        toast.error('Error fetching project data.');
      }
    };

    fetchProject();
  }, [projectId, location.state]);

  const handleUpdateTeam = () => {
    navigate('/assignemployees', {
      state: {
        projectId,
        returnTo: `/teamleadproject/${projectId}`,
        returnKey: 'updatedEmployees',
      },
    });
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handlePercentageChange = (e) => {
    const value = Number(e.target.value);
    setPendingPercentage(value);
  };


const handleDone = async () => {
  let updateNeeded = false;

  const originalIds = originalEmployees.map((e) => e._id);
  const newEmployees = assignedEmployees.filter(
    (emp) => !originalIds.includes(emp._id)
  );

  if (status !== originalStatus) {
    updateNeeded = true;
    try {
      await updateProjectStatus(projectId, status);
      if (status === 'Pending') {
        await updatePendingPercentage(projectId, pendingPercentage);
      }
    } catch {
      toast.error('Failed to update status or pending percentage');
      return;
    }
  }

  if (newEmployees.length > 0) {
    updateNeeded = true;
    try {
      const res = await fetch(
        `http://localhost:5000/api/projects/assign-employees/${projectId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employeeIds: newEmployees.map((e) => e._id) }),
        }
      );

      if (!res.ok) {
        toast.error('Failed to assign employees');
        return;
      }
    } catch {
      toast.error('Something went wrong');
      return;
    }
  }

  if (updateNeeded) {
    toast.success('Project updated successfully!');
    setTimeout(() => {
      navigate('/tldashboard');
    }, 1500);
  } else {
    toast.info('No changes were made.');
  }
};


  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', my: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          <AssignmentIndOutlined sx={{ verticalAlign: 'middle', mr: 1 }} />
          Project Details
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">
              <AssignmentIndOutlined sx={{ verticalAlign: 'middle', mr: 1 }} />
              Project Name:
            </Typography>
            <Typography>{projectName}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">
              <DescriptionOutlined sx={{ verticalAlign: 'middle', mr: 1 }} />
              Description:
            </Typography>
            <Typography>{description}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">
              <GroupAddOutlined sx={{ verticalAlign: 'middle', mr: 1 }} />
              Team Leader:
            </Typography>
            <Typography>{teamLeaderName}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Assigned Employees:</Typography>
            <ul>
              {assignedEmployees.map((emp) => (
                <li key={emp._id}>
                  {emp.name} - {emp.specificRole}
                </li>
              ))}
            </ul>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateTeam}
              sx={{ mr: 2 }}
            >
              Update Team Members
            </Button>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>
                <FlagOutlined sx={{ verticalAlign: 'middle', mr: 1 }} />
                Status
              </InputLabel>
              <Select value={status} label="Status" onChange={handleStatusChange}>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Complete">Complete</MenuItem>
                <MenuItem value="Cancel">Cancel</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {status === 'Pending' && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Pending Percentage"
                type="number"
                value={pendingPercentage}
                onChange={handlePercentageChange}
                inputProps={{ min: 0, max: 99 }}
                fullWidth
              />
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Button variant="contained" color="success" onClick={handleDone}>
          Done
        </Button>
      </Paper>
      <ToastContainer />
    </Box>
  );
};

export default TLprojectDetails;
