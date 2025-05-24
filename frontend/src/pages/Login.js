

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Box,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { loginUser } from "../api/api";  // Importing from api.js

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    try {
      const response = await loginUser({ email, password });

      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role);
      localStorage.setItem("userId", response.userId);

      if (response.role === "employee" && response.specificRole) {
        localStorage.setItem("specificRole", response.specificRole);
      } else {
        localStorage.removeItem("specificRole");
      }

      if (response.role === "admin") {
        navigate("/addashboard");
      } else if (response.role === "teamleader") {
        navigate("/tldashboard");
      } else if (response.role === "employee") {
        navigate("/emdashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f6f8",
        paddingX: { xs: 2, sm: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg" sx={{ mt: 10, width: { xs: "90%", sm: "80%", md: "100%" } }}>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6} display="flex" justifyContent="center">
            <img
              src="/assets/Login.png"
              alt="Project Management"
              style={{ width: "100%", maxWidth: "500px", height: "auto", borderRadius: "10px" }}
            />
          </Grid>

          <Grid item xs={12} md={5}>
            <Card elevation={3} sx={{ borderRadius: "10px", p: { xs: 2, sm: 3, md: 4 } }}>
              <CardContent>
                {forgotPassword ? (
                  <>
                    <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
                      Forgot Password
                    </Typography>

                    {!otpSent ? (
                      <>
                        <TextField
                          fullWidth
                          label="Enter your Email"
                          variant="outlined"
                          margin="normal"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") setOtpSent(true);
                          }}
                        />
                        <Button
                          fullWidth
                          variant="contained"
                          sx={{ mt: 2, backgroundColor: "#28a745" }}
                          onClick={() => setOtpSent(true)}
                        >
                          Send OTP
                        </Button>
                      </>
                    ) : !otpVerified ? (
                      <>
                        <TextField
                          fullWidth
                          label="Enter OTP"
                          variant="outlined"
                          margin="normal"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") setOtpVerified(true);
                          }}
                        />
                        <Button
                          fullWidth
                          variant="contained"
                          sx={{ mt: 2, backgroundColor: "#28a745" }}
                          onClick={() => setOtpVerified(true)}
                        >
                          Verify OTP
                        </Button>
                      </>
                    ) : (
                      <>
                        <TextField
                          fullWidth
                          label="New Password"
                          variant="outlined"
                          margin="normal"
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)}>
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Confirm Password"
                          variant="outlined"
                          margin="normal"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button fullWidth variant="contained" sx={{ mt: 2, backgroundColor: "#3f85f7" }}>
                          Submit
                        </Button>
                      </>
                    )}

                    <Typography textAlign="center" sx={{ mt: 2 }}>
                      <Button
                        sx={{ color: "#3f85f7", textTransform: "none" }}
                        onClick={() => {
                          setForgotPassword(false);
                          setOtpSent(false);
                          setOtpVerified(false);
                        }}
                      >
                        Back to Login
                      </Button>
                    </Typography>
                  </>
                ) : (
                  <>
                    <TextField
                      fullWidth
                      label="Enter your Email"
                      variant="outlined"
                      margin="normal"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleLogin();
                        }
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Enter your Password"
                      variant="outlined"
                      margin="normal"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleLogin();
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    {error && (
                      <Typography color="error" sx={{ mt: 1 }}>
                        {error}
                      </Typography>
                    )}

                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ mt: 2, backgroundColor: "#3f85f7" }}
                      onClick={handleLogin}
                    >
                      Login
                    </Button>

                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
