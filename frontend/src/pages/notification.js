// import React, { useEffect, useState } from "react";
// import { Box, Typography, Divider } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { getNotifications, handleMarkAsRead } from "../api/api";

// const NotificationsPage = () => {
//   const [notifications, setNotifications] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       const userId = localStorage.getItem("userId");
//       if (!userId) {
//         console.error("❌ No userId in localStorage");
//         return;
//       }

//       try {
//         const response = await getNotifications(userId);
//         if (Array.isArray(response)) {
//           setNotifications(response);
//         } else if (response && Array.isArray(response.notifications)) {
//           setNotifications(response.notifications);
//         } else {
//           console.warn("⚠️ Unexpected response format:", response);
//         }
//       } catch (error) {
//         console.error("❌ Error fetching notifications:", error);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   const handleNotificationClick = async (notif) => {
//     try {
//       console.log("Notification clicked:", notif); // Add this line for debugging
  
//       if (!notif.projectId) {
//         console.error("❌ Notification is missing projectId:", notif);
//         return;
//       }
  
//       await handleMarkAsRead(notif._id);
  
//       setNotifications((prev) =>
//         prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
//       );
  
//       navigate(`/assign-employees/${notif.projectId}`, {
//         state: {
//           projectName: notif.projectName,
//           description: notif.description,
//         },
//       });
//     } catch (error) {
//       console.error("❌ Error marking notification as read:", error);
//     }
//   };
  
//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h5" sx={{ mb: 2 }}>
//         Notifications
//       </Typography>
//       <Divider sx={{ mb: 2 }} />

//       {notifications.length === 0 ? (
//         <Typography>No notifications</Typography>
//       ) : (
//         notifications.map((notif) => (
//           <Box
//             key={notif._id}
//             sx={{
//               mb: 1,
//               backgroundColor: notif.isRead ? "#f0f0f0" : "#e3f2fd",
//               p: 2,
//               borderRadius: 2,
//               cursor: "pointer",
//             }}
//             onClick={() => handleNotificationClick(notif)}
//           >
//             <Typography variant="body1">{notif.message}</Typography>
//           </Box>
//         ))
//       )}
//     </Box>
//   );
// };

// export default NotificationsPage;






// import React, { useEffect, useState } from "react";
// import { Box, Typography, Divider } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { getNotifications, handleMarkAsRead } from "../api/api";

// const NotificationsPage = () => {
//   const [notifications, setNotifications] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       const userId = localStorage.getItem("userId");
//       if (!userId) {
//         console.error("❌ No userId in localStorage");
//         return;
//       }

//       try {
//         const response = await getNotifications(userId);
//         if (Array.isArray(response)) {
//           setNotifications(response);
//         } else if (response && Array.isArray(response.notifications)) {
//           setNotifications(response.notifications);
//         } else {
//           console.warn("⚠️ Unexpected response format:", response);
//         }
//       } catch (error) {
//         console.error("❌ Error fetching notifications:", error);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   const handleNotificationClick = async (notif) => {
//     try {
//       if (!notif.projectId) {
//         console.error("❌ Notification is missing projectId:", notif);
//         return;
//       }

//       await handleMarkAsRead(notif._id);

//       setNotifications((prev) =>
//         prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
//       );

//       const role = localStorage.getItem("role");
//       if (!role) {
//         console.error("❌ No role found in localStorage");
//         return;
//       }

//       if (role === "teamleader") {
//         navigate(`/assign-employees/${notif.projectId}`, {
//           state: {
//             projectName: notif.projectName,
//             description: notif.description,
//           },
//         });
//       } else if (role === "employee") {
//         navigate(`/projectdetails/${notif.projectId}`, {
//           state: {
//             projectName: notif.projectName,
//             description: notif.description,
//           },
//         });
//       } else {
//         console.error("❌ Unknown role:", role);
//       }
//     } catch (error) {
//       console.error("❌ Error handling notification click:", error);
//     }
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h5" sx={{ mb: 2 }}>
//         Notifications
//       </Typography>
//       <Divider sx={{ mb: 2 }} />

//       {notifications.length === 0 ? (
//         <Typography>No notifications</Typography>
//       ) : (
//         notifications.map((notif) => (
//           <Box
//             key={notif._id}
//             sx={{
//               mb: 1,
//               backgroundColor: notif.isRead ? "#f0f0f0" : "#e3f2fd",
//               p: 2,
//               borderRadius: 2,
//               cursor: "pointer",
//             }}
//             onClick={() => handleNotificationClick(notif)}
//           >
//             <Typography variant="body1">{notif.message}</Typography>
//           </Box>
//         ))
//       )}
//     </Box>
//   );
// };

// export default NotificationsPage;



import React, { useEffect, useState } from "react";
import { Box, Typography, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getNotifications, handleMarkAsRead } from "../api/api";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.error(" No userId in localStorage");
        return;
      }

      try {
        const response = await getNotifications(userId);
        if (Array.isArray(response)) {
          setNotifications(response);
        } else if (response && Array.isArray(response.notifications)) {
          setNotifications(response.notifications);
        } else {
          console.warn(" Unexpected response format:", response);
        }
      } catch (error) {
        console.error(" Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.projectId) {
        console.error("❌ Notification is missing projectId:", notif);
        return;
      }

      // Mark notification as read only once
      if (!notif.isRead) {
        await handleMarkAsRead(notif._id); // This updates the status in the backend
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
      }

      const role = localStorage.getItem("role");
      if (!role) {
        console.error("❌ No role found in localStorage");
        return;
      }

      if (role === "teamleader" && !notif.hasClicked) {
        // Set the `hasClicked` flag to prevent further changes
        await handleMarkAsRead(notif._id); // Optionally, mark as read here too
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notif._id ? { ...n, hasClicked: true } : n
          )
        );

        navigate(`/assign-employees/${notif.projectId}`, {
          state: {
            projectName: notif.projectName,
            description: notif.description,
          },
        });
      } else if (role === "employee" && !notif.hasClicked) {
        // Redirect to project details, but ensure it only happens once
        await handleMarkAsRead(notif._id);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notif._id ? { ...n, hasClicked: true } : n
          )
        );

        navigate(`/projectdetails/${notif.projectId}`);
      } else {
        console.error(" Unknown role or notification already clicked:", role);
      }
    } catch (error) {
      console.error(" Error handling notification click:", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Notifications
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {notifications.length === 0 ? (
        <Typography>No notifications</Typography>
      ) : (
        notifications.map((notif) => (
          <Box
            key={notif._id}
            sx={{
              mb: 1,
              backgroundColor: notif.isRead ? "#f0f0f0" : "#e3f2fd",
              p: 2,
              borderRadius: 2,
              cursor: "pointer",
            }}
            // onClick={() => handleNotificationClick(notif)}
            onClick={() => !notif.isRead && handleNotificationClick(notif)}
          >
            <Typography variant="body1">{notif.message}</Typography>
          </Box>
        ))
      )}
    </Box>
  );
};

export default NotificationsPage;

