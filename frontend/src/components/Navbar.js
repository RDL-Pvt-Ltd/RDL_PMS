import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { getNotifications } from "../api/api";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reportAnchor, setReportAnchor] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [specificRole, setSpecificRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [prevPath, setPrevPath] = useState(""); 

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const specific = localStorage.getItem("specificRole");

    if (token && role) {
      setIsLoggedIn(true);
      setUserRole(role);
      if (role === "employee" && specific) {
        setSpecificRole(specific);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  useEffect(() => {
    if (location.pathname === "/notifications") {
      fetchNotifications();
    }

    
    if (prevPath === "/notifications" && location.pathname !== "/notifications") {
      fetchNotifications();
    }

    setPrevPath(location.pathname);
  }, [location.pathname]); 
  const fetchNotifications = async () => {
    try {
      const data = await getNotifications(userId);
      console.log("Fetched Data:", data);

      if (Array.isArray(data)) {
        setNotifications(data);
      } else if (data && Array.isArray(data.notifications)) {
        setNotifications(data.notifications);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleReportClick = (event) => setReportAnchor(event.currentTarget);
  const handleReportClose = () => setReportAnchor(null);

  const navLinks = {
    admin: [
      { label: "Dashboard", path: "/addashboard" },
      { label: "Projects", path: "/projectlist" },
      { label: "Add Employee", path: "/delete" },
    ],
    teamleader: [
      { label: "Dashboard", path: "/tldashboard" },
      { label: "Team Projects", path: "/projects" },
      { label: "Daily Update", path: "/teamleadtasks" },
    ],
    employee: [
      { label: "Dashboard", path: "/emdashboard" },
      { label: "Projects", path: "/projects" },
      { label: "My Tasks", path: "/update" },
      { label: "Issues", path: "/complaint" },
    ],
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(145deg, #69b1ff, #93c5fd)",
          color: "black",
        }}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center", px: 2 }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setSidebarOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {!isMobile && (
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "white" }}
            >
              PROJECT MANAGEMENT SYSTEM
            </Typography>
          )}

          {!isMobile && isLoggedIn && userRole && (
            <Box sx={{ display: "flex", gap: 3, marginLeft: "auto" }}>
              {navLinks[userRole]?.map((nav) => (
                <Button
                  key={nav.label}
                  component={Link}
                  to={nav.path}
                  sx={{ color: "#ffffffcc", textTransform: "capitalize" }}
                >
                  {nav.label}
                </Button>
              ))}

              {(userRole === "admin" || userRole === "teamleader") && (
                <Button
                  onClick={handleReportClick}
                  sx={{ color: "#ffffffcc" }}
                  endIcon={<ArrowDropDownIcon />}
                >
                  Reports
                </Button>
              )}

              <Menu
                anchorEl={reportAnchor}
                open={Boolean(reportAnchor)}
                onClose={handleReportClose}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/complete");
                    handleReportClose();
                  }}
                >
                  Complete
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/pending");
                    handleReportClose();
                  }}
                >
                  Pending
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/cancel");
                    handleReportClose();
                  }}
                >
                  Cancel
                </MenuItem>
              </Menu>
            </Box>
          )}

          {isLoggedIn && (
            <>
              <IconButton
                sx={{ color: "white", ml: 2 }}
                onClick={() => navigate("/notifications")}
              >
                <Badge
                  badgeContent={unreadCount > 0 ? unreadCount : null}
                  color="error"
                  overlap="circular"
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <IconButton onClick={handleLogout} sx={{ color: "white", ml: 2 }}>
                <LogoutIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      >
        <Box sx={{ width: 250, padding: 2 }}>
          <Typography sx={{ fontWeight: "bold" }}>
            {userRole === "employee" ? specificRole : userRole} Dashboard
          </Typography>
          <List>
            {navLinks[userRole]?.map((nav) => (
              <ListItem
                button
                component={Link}
                to={nav.path}
                key={nav.label}
                onClick={() => setSidebarOpen(false)}
              >
                <ListItemText primary={nav.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
