import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  CssBaseline,
  Tooltip,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NotificationsIcon from "@mui/icons-material/Notifications";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import GroupIcon from "@mui/icons-material/Group";
import sftsLogo from "../assets/sftsLogo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/auth/authSlice";
import { changePassword } from "../redux/user/userService";
import { toast } from "react-toastify";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import NotificationButton from "./Notifications";
import { getNotifications } from "../redux/notifications/notificationService";
import { setNotifications } from "../redux/notifications/notificationSlice";


const drawerWidth = 240;
const collapsedWidth = 60;

const MainLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [passwordErrors, setPasswordErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const role = useSelector((state) => state.auth.user.role);
  const user = useSelector((state) => state.auth.user);

  const notifications = useSelector((state) => state.notification.notifications);
  const unreadCount = notifications.length;
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const res = await getNotifications();
        dispatch(setNotifications(res));
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, [dispatch]);


  useEffect(() => {
    setDrawerOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleChangePasswordClick = () => {
    setPasswordDialogOpen(true);
    setAnchorEl(null);
  };

  const handlePasswordSave = async () => {
    const errors = {
      currentPassword: "",
      newPassword: "",
    };

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password required";
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "New password required";
    }

    setPasswordErrors(errors);
    if (errors.currentPassword || errors.newPassword) return;

    try {
      await changePassword(passwordForm);
      setPasswordDialogOpen(false);
      setPasswordForm({ currentPassword: "", newPassword: "" });
      toast.success("Password updated successfully!");
    } catch (error) {
      console.error("Password change failed:", error);
      if (
        error == "Current password is incorrect"
      ) {
        setPasswordErrors((prev) => ({
          ...prev,
          currentPassword: "Current password is incorrect",
        }));
      }
    }
  };

  const routes = [
    {
      label: "File Management",
      path: "/dashboard/file-management",
      icon: <InsertDriveFileIcon sx={{ fontSize: "1.75rem", color: "#1976d2" }} />,
    },
    ...(role === "admin"
      ? [
        {
          label: "User Management",
          path: "/dashboard/user-management",
          icon: <GroupIcon sx={{ fontSize: "1.75rem", color: "#1976d2" }} />,
        },
      ]
      : []),
  ];

  const drawer = (
    <Box sx={{ textAlign: "center", mt: 2 }}>
      <List>
        {routes.map((item) => (
          <Tooltip
            key={item.label}
            title={drawerOpen ? "" : item.label}
            placement="right"
          >
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) handleDrawerToggle();
              }}
              sx={{ justifyContent: drawerOpen ? "initial" : "center", px: 2.5 }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: drawerOpen ? 2 : "auto",
                  justifyContent: "center",
                  color: "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ opacity: drawerOpen ? 1 : 0, whiteSpace: "nowrap" }}
              />
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar sx={{ position: "relative", minHeight: 64 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, outline: "none !important" }}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Center: Logo and Title */}
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <img src={sftsLogo} alt="Logo" width={32} />
            <Typography
              variant="h6"
              fontWeight="bold"
              noWrap
              sx={{
                fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
                textAlign: "center",
              }}
            >
              {isMobile ? "SFTS" : "Smart File Tracking System"}
            </Typography>
          </Box>

          {/* Right: Notifications and Menu */}
          <Box sx={{ marginLeft: "auto" }}>
            <NotificationButton
              notifications={notifications}
              unreadCount={unreadCount}
              loading={loadingNotifications}
            />
            <IconButton
              sx={{ outline: "none !important" }}
              color="inherit"
              onClick={handleMenuOpen}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleChangePasswordClick}>Change Password</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>


      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? drawerOpen : true}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: drawerOpen ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerOpen ? drawerWidth : collapsedWidth,
            mt: { xs: 5.5, sm: 7 },
            height: `calc(100vh - ${isMobile ? "44px" : "56px"})`,
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}
        >

          {drawer}

          <Box
            sx={{
              mt: "auto",
              px: 2,
              py: 1.5,
              borderTop: "1px solid #e0e0e0",
              backgroundColor: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: drawerOpen ? "flex-start" : "center",
              gap: 1.5,
              minHeight: 80,
            }}
          >
            {drawerOpen ? (
              <>
                <Avatar sx={{ bgcolor: "#1976d2", width: 36, height: 36 }}>
                  <PersonIcon />
                </Avatar>
                <Box sx={{ overflow: "hidden" }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {user.fullName}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {user.email}
                  </Typography>
                </Box>
              </>
            ) : (
              <Tooltip title={`${user.fullName}\n${user.email}`} placement="right" arrow>
                <Avatar sx={{ bgcolor: "#1976d2", width: 36, height: 36 }}>
                  <PersonIcon />
                </Avatar>
              </Tooltip>
            )}
          </Box>

        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 8,
          height: `calc(100vh - 64px)`,
          width: {
            xs: "100vw",
            sm: `calc(100vw - ${drawerOpen ? drawerWidth : collapsedWidth}px)`,
          },
          overflow: "auto",
          px: 3,
          py: 2,
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {children}
      </Box>

      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            margin="dense"
            value={passwordForm.currentPassword}
            onChange={(e) => {
              setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }));
              setPasswordErrors((prev) => ({ ...prev, currentPassword: "" }));
            }}
            error={!!passwordErrors.currentPassword}
            helperText={passwordErrors.currentPassword}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="dense"
            value={passwordForm.newPassword}
            onChange={(e) => {
              setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }));
              setPasswordErrors((prev) => ({ ...prev, newPassword: "" }));
            }}
            error={!!passwordErrors.newPassword}
            helperText={passwordErrors.newPassword}
          />
        </DialogContent>
        <DialogActions sx={{
          padding: "0px 22px 10px 0px"
        }}>
          <Button onClick={() => setPasswordDialogOpen(false)} sx={{ outline: "none !important" }}>Cancel</Button>
          <Button variant="contained" onClick={handlePasswordSave} sx={{ outline: "none !important" }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MainLayout;
