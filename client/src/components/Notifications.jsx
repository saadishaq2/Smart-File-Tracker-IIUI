import React, { useState, useRef, useEffect } from "react";
import {
    Badge,
    Popper,
    Paper,
    Typography,
    IconButton,
    Box,
    CircularProgress,
    Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateAllNotifications, updateNotificationById } from "../redux/notifications/notificationService";
import { markAllNotificationsRead, markNotificationRead } from "../redux/notifications/notificationSlice";
import { getFileIcon } from "../services/utility.jsx";

const getStatusColor = (status) => {
    switch (status) {
        case "approved":
            return "#4caf50";
        case "rejected":
            return "#f44336";
        case "submitted":
        default:
            return "#90caf9";
    }
};

const NotificationPopover = ({
    anchorEl,
    open,
    onClose,
    notifications,
    loading,
    onMarkAllAsRead,
    onNotificationClick,
    popoverRef
}) => {
    const navigate = useNavigate();

    return (
        <Popper
            open={open}
            anchorEl={anchorEl}
            placement="bottom-end"
            disablePortal
            sx={{ zIndex: 1300 }}
        >
            <Paper
                ref={popoverRef}
                elevation={4}
                sx={{
                    mt: 1,
                    width: 360,
                    maxHeight: 420,
                    overflow: "hidden",
                    borderRadius: 3,
                    boxShadow: 6,
                    backgroundColor: "#f5f7fb",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        px: 2,
                        py: 2,
                        borderBottom: "1px solid #e0e0e0",
                        bgcolor: "#ffffff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h6" fontWeight={600}>
                        Notifications
                    </Typography>
                    {notifications.length > 0 && (
                        <Typography
                            variant="body2"
                            onClick={onMarkAllAsRead}
                            sx={{
                                cursor: "pointer",
                                fontWeight: 500,
                                color: "#1976d2",
                                "&:hover": { textDecoration: "underline" },
                            }}
                        >
                            Mark all as read
                        </Typography>
                    )}
                </Box>

                {/* Body */}
                <Box sx={{ px: 2, py: 2, flex: 1, overflowY: "auto" }}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" py={3}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : notifications.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" align="center">
                            No notifications
                        </Typography>
                    ) : (
                        notifications.map((notif, index) => (
                            <Box
                                key={notif._id || index}
                                onClick={() => onNotificationClick(notif._id)}
                                sx={{
                                    mb: 2.2,
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor: "#ffffff",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                    borderLeft: `4px solid ${getStatusColor(notif.status)}`,
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: "#f0f0f0" },
                                }}
                            >
                                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    {notif.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ whiteSpace: "pre-line" }}
                                    gutterBottom
                                >
                                    {notif.message}
                                </Typography>
                                {notif.fileName && (
                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ display: "flex", alignItems: "center" }}>
                                        {getFileIcon(notif.fileName)} {notif.fileUniqueId} : {notif.fileName}
                                    </Typography>
                                )}
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt:"2px" }}>
                                    {moment(notif.createdAt).fromNow()}
                                </Typography>
                            </Box>
                        ))
                    )}
                </Box>

                {/* Footer */}
                <Divider />
                <Box
                    sx={{
                        p: 1.5,
                        bgcolor: "#ffffff",
                        borderTop: "1px solid #e0e0e0",
                        textAlign: "center",
                        cursor: "pointer",
                        "&:hover": {
                            backgroundColor: "#f0f0f0",
                        },
                    }}
                    onClick={() => {
                        onClose();
                        navigate("/dashboard/view-all-notifications");
                    }}
                >
                    <Typography variant="body2" fontWeight={500} color="primary">
                        View all notifications
                    </Typography>
                </Box>
            </Paper>
        </Popper >
    );
};

const NotificationButton = ({ notifications = [], unreadCount = 0, loading = false }) => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const popoverRef = useRef(null);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const toggleOpen = () => setOpen((prev) => !prev);
    const close = () => setOpen(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                anchorRef.current &&
                !anchorRef.current.contains(event.target) &&
                popoverRef.current &&
                !popoverRef.current.contains(event.target)
            ) {
                close();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkAllAsRead = async () => {
        try {
            await updateAllNotifications();
            dispatch(markAllNotificationsRead());
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    const handleNotificationClick = async (id) => {
        try {
            await updateNotificationById(id);
            dispatch(markNotificationRead(id));
        } catch (err) {
            console.error("Failed to mark notification as read", err);
        }
    };

    return (
        <>
            <IconButton color="inherit" onClick={toggleOpen} ref={anchorRef} sx={{ outline: "none !important" }}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <NotificationPopover
                anchorEl={anchorRef.current}
                open={open}
                onClose={close}
                notifications={notifications}
                loading={loading}
                onMarkAllAsRead={handleMarkAllAsRead}
                onNotificationClick={handleNotificationClick}
                popoverRef={popoverRef}
            />
        </>
    );
};

export default NotificationButton;
