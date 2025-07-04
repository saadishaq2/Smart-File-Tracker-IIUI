import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  CircularProgress,
  Button,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { viewAllNotifications } from "../../redux/notifications/notificationService";
import { useDispatch, useSelector } from "react-redux";
import { setAllNotifications } from "../../redux/notifications/notificationSlice";
import { capitalize, statusColors, getFileIcon } from "../../services/utility.jsx";

const AllNotifications = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const allNotifications = useSelector((state) => state.notification.allNotifications);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await viewAllNotifications();
        dispatch(setAllNotifications(res));
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [dispatch]);

  const filtered = allNotifications.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "message",
      headerName: "Message",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        params.value
      ),
    },
    {
      field: "fileName",
      headerName: "File",
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {getFileIcon(params.value)}
          {params.value}
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 100,
      renderCell: ({ value }) => (
        <Chip label={capitalize(value)} color={statusColors[value]} size="medium" />
      ),
    },
    {
      field: "createdAt",
      headerName: "Date",
      flex: 1,
      minWidth: 180,
      valueGetter: (params) => moment(params).format("lll"),
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          height: "calc(100vh - 64px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", width: "100%", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          gap: 2,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard/file-management")}
          sx={{ outline: "none !important" }}
        >
          Back
        </Button>
        <TextField
          label="Search Notifications"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        <DataGrid
          rows={filtered.map((n) => ({ ...n, id: n._id }))}
          columns={columns}
          autoHeight={false}
          sx={{ height: "calc(100vh - 160px)" }}
        />
      </Box>
    </Box>
  );
};

export default AllNotifications;
