

// import React, { useState, useEffect } from "react";
// import {
//   Typography,
//   Button,
//   Grid,
//   Card,
//   CardContent,
//   Avatar,
//   CircularProgress,
//   Box,
//   Chip,
// } from "@mui/material";
// import { useLocation, useNavigate } from "react-router-dom";
// import { getAllUsersForDeletion, deleteEmployeeById } from "../api/api"; // Ensure delete API exists

// const DeleteEmployee = () => {
//   const navigate = useNavigate();
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const data = await getAllUsersForDeletion();
//         setEmployees(data);
//       } catch (err) {
//         setError("Failed to fetch employees.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployees();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       await deleteEmployeeById(id);
//       setEmployees((prev) => prev.filter((emp) => emp._id !== id));
//     } catch (err) {
//       console.error("Error deleting employee:", err);
//       alert("Failed to delete employee.");
//     }
//   };

//   const handleDone = () => {
//     navigate("/addashboard");
//   };

//   const handleRegister = () => {
//     navigate("/register");
//   };

//   return (
//     <Box sx={{ padding: 4 }}>
//       <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
//         <Typography variant="h5" sx={{ fontWeight: "bold" }}>
//           Register Employees
//         </Typography>
//         <Button variant="contained" color="primary" onClick={handleRegister}>
//           Register
//         </Button>
//       </Box>

//       <Grid container spacing={3}>
//         {loading ? (
//           <Grid item xs={12} sx={{ textAlign: "center" }}>
//             <CircularProgress />
//           </Grid>
//         ) : error ? (
//           <Grid item xs={12} sx={{ textAlign: "center", color: "red" }}>
//             <Typography>{error}</Typography>
//           </Grid>
//         ) : employees.length > 0 ? (
//           employees.map((emp) => (
//             <Grid item xs={12} sm={6} md={3} key={emp._id}>
//               <Card
//                 sx={{
//                   textAlign: "center",
//                   padding: 2,
//                   borderRadius: 2,
//                   boxShadow: 3,
//                   maxWidth: 250,
//                   margin: "auto",
//                 }}
//               >
//                 <Avatar
//                   sx={{ width: 64, height: 64, mx: "auto", bgcolor: "#1976D2" }}
//                 >
//                   {emp.name.charAt(0).toUpperCase()}
//                 </Avatar>
//                 <CardContent>
//                   <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//                     {emp.name}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     sx={{
//                       backgroundColor: "#e0e0e0",
//                       padding: "4px 8px",
//                       borderRadius: 1,
//                       mt: 1,
//                     }}
//                   >
//                     {emp.role}
//                   </Typography>
//                   <Button
//                     variant="contained"
//                     color="error"
//                     onClick={() => handleDelete(emp._id)}
//                     sx={{ mt: 2 }}
//                   >
//                     Delete
//                   </Button>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))
//         ) : (
//           <Grid item xs={12} sx={{ textAlign: "center" }}>
//             <Typography>No employees found.</Typography>
//           </Grid>
//         )}
//       </Grid>

//       <Box sx={{ mt: 4, textAlign: "center" }}>
//         <Button variant="contained" onClick={handleDone}>
//           Done
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default DeleteEmployee


import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAllUsersForDeletion, deleteEmployeeById } from "../api/api"; // Ensure delete API exists
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteEmployee = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAnyDeleted, setIsAnyDeleted] = useState(false); // Track if any deletion happened

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getAllUsersForDeletion();
        setEmployees(data);
      } catch (err) {
        setError("Failed to fetch employees.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteEmployeeById(id);
      setEmployees((prev) => prev.filter((emp) => emp._id !== id));
      setIsAnyDeleted(true); // Mark that deletion has occurred
      toast.success("Employee deleted successfully!");
    } catch (err) {
      console.error("Error deleting employee:", err);
      toast.error("Failed to delete employee.");
    }
  };

  const handleDone = () => {
        navigate("/addashboard");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <Box sx={{ padding: 4 }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Register Employees
        </Typography>
        <Button variant="contained" color="primary" onClick={handleRegister}>
          Register
        </Button>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Grid>
        ) : error ? (
          <Grid item xs={12} sx={{ textAlign: "center", color: "red" }}>
            <Typography>{error}</Typography>
          </Grid>
        ) : employees.length > 0 ? (
          employees.map((emp) => (
            <Grid item xs={12} sm={6} md={3} key={emp._id}>
              <Card
                sx={{
                  textAlign: "center",
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: 3,
                  maxWidth: 250,
                  margin: "auto",
                }}
              >
                <Avatar
                  sx={{ width: 64, height: 64, mx: "auto", bgcolor: "#1976D2" }}
                >
                  {emp.name.charAt(0).toUpperCase()}
                </Avatar>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {emp.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      backgroundColor: "#e0e0e0",
                      padding: "4px 8px",
                      borderRadius: 1,
                      mt: 1,
                    }}
                  >
                    {emp.role}
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(emp._id)}
                    sx={{ mt: 2 }}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography>No employees found.</Typography>
          </Grid>
        )}
      </Grid>

      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button variant="contained" onClick={handleDone}>
          Done
        </Button>
      </Box>
    </Box>
  );
};

export default DeleteEmployee;
