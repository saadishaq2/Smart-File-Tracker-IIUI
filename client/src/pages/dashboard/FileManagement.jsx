import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Drawer,
  Grid,
  MenuItem,
  Chip,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import UploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import DeleteDialog from "../../components/DeleteDialog";
import { capitalize, getFileIcon, statusColors } from "../../services/utility.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  getFiles,
  viewFile,
  deleteFile as deleteFileApi,
  updateFileStatus,
  forwardFile,
  reviewFile,
} from "../../redux/file/fileService";
import {
  setFiles,
  deleteFileById,
  updateFileById,
} from "../../redux/file/fileSlice";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import UploadDrawer from "../../components/UploadDrawer.jsx";
import FileHistoryDrawer from "../../components/FileHistoryDrawer.jsx";

const departments = [
  { name: "Computer Science (CS)", value: "CS" },
  { name: "Software Engineering (SE)", value: "SE" },
  { name: "Information Technology (IT)", value: "IT" },
  { name: "Physics (PHY)", value: "PHY" },
  { name: "Mathematics (MATH)", value: "MATH" },
];

const mainDepartments = [
  { name: "Finance (Fin)", value: "Fin" },
  { name: "Examination (Exam)", value: "Exam" },
  { name: "Hostel", value: "Hostel" },
]

const FileManagement = () => {
  const role = useSelector((state) => state.auth.user?.role);
  const userDepartment = useSelector((state) => state.auth.user?.department);
  const files = useSelector((state) => state.file.files);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [statusDrawerOpen, setStatusDrawerOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({ status: "", remarks: "", forwardedTo: "" });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null });
  const [statusError, setStatusError] = useState("");
  const [remarksError, setRemarksError] = useState("");

  useEffect(() => {
    if (!selectedFile?._id) return;

    const updated = files.find((f) => f._id === selectedFile._id);
    if (updated) {
      setSelectedFile(updated);
    }
  }, [files, selectedFile]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const fetchedFiles = await getFiles();
        dispatch(setFiles(fetchedFiles));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  const handleOpenDrawer = () => setDrawerOpen(true);
  const handleCloseDrawer = () => setDrawerOpen(false);

  const handleOpenStatusDrawer = (file) => {
    setSelectedFile(file);
    setStatusUpdate({
      status: file.status || "",
      remarks: file.remarks || "",
      forwardedTo: file.forwardedTo || "",
    });
    setStatusError("");
    setRemarksError("");
    setStatusDrawerOpen(true);
  };

  const handleCloseStatusDrawer = () => {
    setSelectedFile(null);
    setStatusUpdate({ status: "", remarks: "", forwardedTo: "" });
    setStatusDrawerOpen(false);
    setRemarksError("")
    setStatusError("")
  };

  const handleOpenHistoryDrawer = (file) => {
    setSelectedFile(file);
    setHistoryDrawerOpen(true);
  };

  const handleCloseHistoryDrawer = () => setHistoryDrawerOpen(false);

  const handleStatusSubmit = async () => {
    if (!statusUpdate.status) {
      setStatusError("Please select a status");
      return;
    }

    if (
      statusUpdate.status === "rejected" &&
      (!statusUpdate.remarks || statusUpdate.remarks.trim() === "")
    ) {
      setRemarksError("Remarks is required");
      return;
    }

    if (
      statusUpdate.status === "forwarded" &&
      (!statusUpdate.forwardedTo || statusUpdate.forwardedTo.trim() === "")
    ) {
      setStatusError("Please select the department to forward to");
      return;
    }

    if (
      statusUpdate.status === "reviewed" &&
      (!statusUpdate.remarks || statusUpdate.remarks.trim() === "")
    ) {
      setRemarksError("Remarks is required");
      return;
    }

    try {
      let updated;

      if (["approved", "rejected"].includes(statusUpdate.status)) {
        updated = await updateFileStatus(selectedFile._id, statusUpdate);
      } else if (statusUpdate.status === "forwarded") {
        updated = await forwardFile({ id: selectedFile._id, ...statusUpdate });
      } else if (statusUpdate.status === "reviewed") {
        await reviewFile({ id: selectedFile._id, ...statusUpdate });
      }

      dispatch(updateFileById(updated));
      handleCloseStatusDrawer();
      const toastMessage = `${statusUpdate.status === "forwarded" ? "File is forwarded successfully!" :
        statusUpdate.status === "reviewed" ? "File is reviewed successfully!" : "File status updated successfully!"}`
      toast.success(toastMessage);
    } catch (err) {
      console.error(err);
      toast.error(typeof err === "string" ? err : "Failed to update file status. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFileApi(deleteDialog.userId);
      dispatch(deleteFileById(deleteDialog.userId));
      setDeleteDialog({ open: false, userId: null });
      toast.success("File deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete file. Please try again.");
    }
  };

  const handleViewFile = async (id) => {
    try {
      const blob = await viewFile(id);
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { field: "uniqueId", headerName: "ID", flex: 1, minWidth: 100 },
    {
      field: "fileName", headerName: "File Name", flex: 1, minWidth: 200, renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {getFileIcon(params.value)}
          {params.value}
        </div>
      ),
    },
    {
      field: "department",
      headerName: "Department",
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => {
        const dept = departments.find((d) => d.value === params);
        const mainDeparts = mainDepartments.find((d) => d.value === params);
        return dept ? dept.name : mainDeparts ? mainDeparts.name : params;
      },
    },
    {
      field: "uploadedBy",
      headerName: "Uploaded By",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => params?.fullName,
    },
    // {
    //   field: "uploadedDate",
    //   headerName: "Uploaded Date",
    //   flex: 1,
    //   minWidth: 100,
    //   valueGetter: (params) => new Date(params).toLocaleDateString(),
    // },
    {
      field: "dueDate",
      headerName: "Due Date",
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => new Date(params).toLocaleDateString(),
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
      field: "actions",
      headerName: "",
      width: 170,
      sortable: false,
      renderHeader: () => null,
      renderCell: (params) => (
        <Box>
          {(role === "admin" || role === "program_officer") && (
            <Tooltip title="Update Status">
              <IconButton sx={{ outline: "none !important" }} color="primary" onClick={() => handleOpenStatusDrawer(params.row)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="View History">
            <IconButton sx={{ outline: "none !important" }} onClick={() => handleOpenHistoryDrawer(params.row)}>
              <HistoryIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="View File">
            <IconButton sx={{ outline: "none !important" }} onClick={() => handleViewFile(params.row._id)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          {(role === "admin" || (role === "program_officer" && departments.map(d => d.value).includes(userDepartment))) && (
            <Tooltip title="Delete">
              <IconButton sx={{ outline: "none !important" }} color="error" onClick={() => setDeleteDialog({ open: true, userId: params.row._id })}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  const filteredFiles = files.filter(
    (file) =>
      file.fileName.toLowerCase().includes(search.toLowerCase()) ||
      file.uniqueId == Number(search.toLowerCase())
  );

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
    <Box sx={{ height: "100%", p: 2, display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <TextField
          label="Search"
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
        {role === "student" && (
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={handleOpenDrawer}
            sx={{ outline: "none !important" }}
          >
            Upload File
          </Button>
        )}
      </Box>

      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        <DataGrid
          rows={filteredFiles.map((f) => ({ ...f, id: f._id }))}
          columns={columns}
          autoHeight={false}
          sx={{ height: "100%" }}
        />
      </Box>

      <UploadDrawer
        handleCloseDrawer={handleCloseDrawer}
        drawerOpen={drawerOpen}
        departments={departments}
      />

      {/* Status Update Drawer */}
      <Drawer
        anchor="right"
        open={statusDrawerOpen}
        onClose={handleCloseStatusDrawer}
        PaperProps={{
          sx: {
            mt: { xs: 6, sm: 8 },
            height: "calc(100% - 64px)",
          },
        }}
      >
        <Box
          sx={{
            width: { xs: "100vw", sm: 400 },
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: 3,
              pt: 3,
              pb: 2,
              borderBottom: "1px solid #e0e0e0",
              bgcolor: "#fafafa",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Status Update
            </Typography>
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto", px: 3, pt: 3, pb: 2 }}>
            {["admin", "program_officer"].includes(role) && (
              <TextField
                select
                label="Status *"
                fullWidth
                value={statusUpdate.status}
                onChange={(e) => {
                  setStatusUpdate({ ...statusUpdate, status: e.target.value });
                  setStatusError("");
                }}
                error={!!statusError}
                helperText={statusError}
                sx={{ mt: 1 }}
              >

                {(departments.map(d => d.value).includes(userDepartment) || role == "admin") && (
                  <MenuItem value="approved">Approved</MenuItem>
                )}
                {(departments.map(d => d.value).includes(userDepartment) || role == "admin") && (

                  <MenuItem value="rejected">Rejected</MenuItem>
                )}
                {(departments.map(d => d.value).includes(userDepartment) || role == "admin") && (
                  <MenuItem value="forwarded">Forwarded</MenuItem>
                )}

                {(mainDepartments.map(d => d.value).includes(userDepartment) || role == "admin") && (
                  <MenuItem value="reviewed">Reviewed</MenuItem>
                )}
              </TextField>
            )}

            {(statusUpdate.status === "forwarded" && (departments.map(d => d.value).includes(userDepartment) || role == "admin")) && (
              <TextField
                select
                label="Forward To *"
                fullWidth
                value={statusUpdate.forwardedTo || ""}
                onChange={(e) =>
                  setStatusUpdate({ ...statusUpdate, forwardedTo: e.target.value })
                }
                error={!statusUpdate.forwardedTo}
                helperText={!statusUpdate.forwardedTo ? "Please select a department to forward to" : ""}
                sx={{ mt: 2 }}
              >
                {mainDepartments
                  .map((d) => (
                    <MenuItem key={d.value} value={d.value}>
                      {d.name}
                    </MenuItem>
                  ))}
              </TextField>
            )}

            <TextField
              label={`${["rejected", "reviewed"].includes(statusUpdate.status) ? "Remarks *" : "Remarks (optional)"}`}
              fullWidth
              multiline
              minRows={3}
              sx={{ mt: 2 }}
              value={statusUpdate.remarks}
              onChange={(e) => {
                setStatusUpdate({ ...statusUpdate, remarks: e.target.value })
                setRemarksError("")
              }}
              error={!!remarksError}
              helperText={remarksError}
            />
          </Box>

          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #eee",
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              bgcolor: "#fff",
            }}
          >
            <Button
              onClick={handleCloseStatusDrawer}
              sx={{ outline: "none !important" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleStatusSubmit}
              sx={{ outline: "none !important" }}
            >
              {statusUpdate.status === "forwarded"
                ? "Forward"
                : statusUpdate.status === "reviewed"
                  ? "Reviewed"
                  : "Update"}

            </Button>
          </Box>
        </Box>
      </Drawer>

      <FileHistoryDrawer
        historyDrawerOpen={historyDrawerOpen}
        handleCloseHistoryDrawer={handleCloseHistoryDrawer}
        selectedFile={selectedFile}
      />

      <DeleteDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, userId: null })}
        onConfirm={handleDelete}
        title="Confirm Delete"
        description="Are you sure you want to delete this file?"
      />
    </Box>
  );
};

export default FileManagement;
