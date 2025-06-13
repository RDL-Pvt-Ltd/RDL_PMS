// AssigntoLead.js
import React from "react";
import { Typography, Button, Grid, Card, CardContent, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const teamMembers = [
  { name: "Alice", role: "Web Developer" },
  { name: "Bob", role: "Web Developer" },
  { name: "Charlie", role: "Tester" },
  { name: "David", role: "Android Developer" },
  { name: "Eva", role: "Figma Developer" },
  { name: "Frank", role: "DevOps" },
  { name: "Grace", role: "Tester" },
  { name: "Sam", role: "Web Developer" },
  { name: "Hannah", role: "Data Scientist" },
  { name: "Ian", role: "Backend Developer" },
  { name: "Julia", role: "Product Manager" },
  { name: "Kevin", role: "Cloud Engineer" },
];

const AssigntoLead = () => {
  const navigate = useNavigate();

  const handleAssign = (member) => {
    // Navigate back with state
    navigate('/addproject', { state: { teamLead: member } });
  };

  return (
    <div>
      <Grid container spacing={3} sx={{ padding: 5 }}>
        {teamMembers.map((member, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                textAlign: "center",
                padding: 3,
                borderRadius: 2,
                boxShadow: 3,
                maxWidth: 230,
                margin: "auto",
              }}
            >
              <Avatar
                sx={{ width: 70, height: 70, margin: "auto", backgroundColor: "#ddd" }}
              />
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    backgroundColor: "#d3d3d3",
                    padding: 0.5,
                    borderRadius: 1,
                    marginBottom: 1,
                  }}
                >
                  {member.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    backgroundColor: "#d3d3d3",
                    padding: 0.5,
                    borderRadius: 1,
                    marginBottom: 2,
                  }}
                >
                  {member.role}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "green", color: "white", mt: 1 }}
                  onClick={() => handleAssign(member)}
                >
                  ASSIGN
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AssigntoLead;
