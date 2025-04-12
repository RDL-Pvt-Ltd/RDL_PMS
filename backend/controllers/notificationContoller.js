const Notification = require("../models/notification");

// Get notifications for a specific user
exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

// Mark all notifications as read for a user
// exports.markAllAsRead = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     await Notification.updateMany({ userId }, { isRead: true }); // ✅ fixed field name
//     res.status(200).json({ message: "All notifications marked as read" });
//   } catch (error) {
//     res.status(500).json({ message: "Error marking notifications" });
//   }
// };


exports.markAllAsRead = async (req, res) => {
  const { notificationId } = req.body;

  if (!notificationId) {
    return res.status(400).json({ message: "Notification ID is required" });
  }

  await Notification.findByIdAndUpdate(notificationId, { isRead: true });
  res.status(200).json({ message: "Notification marked as read" });
};
