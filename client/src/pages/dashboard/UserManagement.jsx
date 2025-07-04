import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Drawer,
  IconButton,
  Grid,
  MenuItem,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import DeleteDialog from "../../components/DeleteDialog";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../redux/user/userService";
import {
  setUsers,
  addUser,
  updateUserById,
  deleteUserById,
} from "../../redux/user/userSlice";
import { CircularProgress } from "@mui/material";

const departments = [
  { name: "Computer Science (CS)", value: "CS" },
  { name: "Software Engineering (SE)", value: "SE" },
  { name: "Information Technology (IT)", value: "IT" },
  { name: "Physics (PHY)", value: "PHY" },
  { name: "Mathematics (MATH)", value: "MATH" },
  { name: "Finance (Fin)", value: "Fin" },
  { name: "Examination (Exam)", value: "Exam" },
  { name: "Hostel", value: "Hostel" },
];

const roles = [
  { name: "Student", value: "student" },
  { name: "Program Officer", value: "program_officer" },
  { name: "Admin", value: "admin" },
];

const UserManagement = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);

  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null });
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    department: "",
    role: "",
    rollNumber: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!editingUserId) return;

    const updatedUser = users.find((u) => u._id === editingUserId);
    if (updatedUser) {
      setForm((prev) => ({
        ...prev,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        department: updatedUser.department || "",
        role: updatedUser.role,
        rollNumber: updatedUser.rollNumber || "",
      }));
    }
  }, [users, editingUserId]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const data = await getUsers();
        dispatch(setUsers(data));
      } catch (err) {
        console.error("Signin error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [dispatch]);

  const handleOpenDrawer = (user = null) => {
    if (user) {
      setForm({
        fullName: user.fullName,
        department: user.department || "",
        role: user.role,
        rollNumber: user.rollNumber || "",
        email: user.email,
      });
      setEditingUserId(user._id);
    } else {
      setForm({ fullName: "", department: "", role: "", rollNumber: "" });
      setEditingUserId(null);
    }
    setErrors({});
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setForm({ fullName: "", department: "", role: "", rollNumber: "" });
    setEditingUserId(null);
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName) newErrors.fullName = "Name is required";
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    const isEditing = !!editingUserId;
    const password = form.password?.trim();
    if (!isEditing && !password) {
      newErrors.password = "Password is required";
    } else if (password) {
      const isValidPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);
      if (!isValidPassword) {
        newErrors.password =
          "Password must be at least 8 characters, include 1 uppercase letter, 1 number, and 1 special character.";
      }
    }
    if (!form.role) newErrors.role = "Role is required";
    if (form.role !== "admin" && !form.department) {
      newErrors.department = "Department is required";
    }
    if (form.role === "student" && !form.rollNumber) {
      newErrors.rollNumber = "Roll number is required";
    }
    return newErrors;
  };


  const handleSubmit = async () => {
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length) return;

    try {
      if (editingUserId) {
        const updated = await updateUser(editingUserId, form);
        dispatch(updateUserById(updated));
        toast.success("User updated successfully!");
      } else {
        const created = await createUser(form);
        dispatch(addUser(created));
        toast.success("User created successfully!");
      }
      handleCloseDrawer();
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to create/update user. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(deleteDialog.userId);
      dispatch(deleteUserById(deleteDialog.userId));
      setDeleteDialog({ open: false, userId: null });
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  const filteredUsers = users?.filter(
    (user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      field: "fullName",
      headerName: "Full Name",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => {
        const role = roles.find((r) => r.value === params);
        return role ? role.name : params;
      },
    },
    {
      field: "department",
      headerName: "Department",
      flex: 1,
      minWidth: 200,
      valueGetter: (params) => {
        const dept = departments.find((d) => d.value === params);
        return dept ? dept.name : params;
      },
    },
    {
      field: "actions",
      headerName: "",
      width: 120,
      sortable: false,
      filterable: false,
      headerAlign: "center",
      disableColumnMenu: true,
      renderHeader: () => null,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Update User">
            <IconButton
              color="primary"
              onClick={() => handleOpenDrawer(params.row)}
              sx={{ outline: "none !important" }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete User">
            <IconButton
              color="error"
              onClick={() =>
                setDeleteDialog({ open: true, userId: params.row._id })
              }
              sx={{ outline: "none !important" }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
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
    <Box sx={{ height: "100%", width: "100%", p: 2, display: "flex", flexDirection: "column" }}>
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
        <Button
          variant="contained"
          onClick={() => handleOpenDrawer()}
          sx={{ outline: "none !important" }}
        >
          Create User
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        <DataGrid
          rows={filteredUsers.map((u) => ({ ...u, id: u._id }))}
          columns={columns}
          autoHeight={false}
          sx={{ height: "100%" }}
        />
      </Box>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
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
              {editingUserId ? "Edit User" : "Create User"}
            </Typography>
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto", px: 3, pt: 3, pb: 2 }}>
            <Grid container spacing={2} direction="column">
              <Grid item xs={12}>
                <TextField
                  label="Full Name"
                  fullWidth
                  value={form.fullName}
                  onChange={(e) => {
                    setForm({ ...form, fullName: e.target.value });
                    setErrors((prev) => ({ ...prev, fullName: "" }));
                  }}

                  error={!!errors.fullName}
                  helperText={errors.fullName}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Email"
                  fullWidth
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  label="Role"
                  fullWidth
                  value={form.role}
                  onChange={(e) => {
                    const selectedRole = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      role: selectedRole,
                      department: "",
                      rollNumber: selectedRole === "student" ? prev.rollNumber : "",
                    }));
                    setErrors((prev) => ({ ...prev, role: "", department: "", rollNumber: "" }));
                  }}

                  error={!!errors.role}
                  helperText={errors.role}
                >
                  {roles.map((r) => (
                    <MenuItem key={r.value} value={r.value}>
                      {r.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {form.role !== "admin" && (
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Department"
                    fullWidth
                    value={form.department}
                    onChange={(e) => {
                      setForm({ ...form, department: e.target.value });
                      setErrors((prev) => ({ ...prev, department: "" }));
                    }}

                    error={!!errors.department}
                    helperText={errors.department}
                  >
                    {departments
                      .filter((dep) => {
                        if (form.role === "student") {
                          return ["CS", "SE", "IT", "PHY", "MATH"].includes(dep.value);
                        }
                        return true;
                      })
                      .map((dep) => (
                        <MenuItem key={dep.value} value={dep.value}>
                          {dep.name}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>
              )}

              {form.role === "student" && (
                <Grid item xs={12}>
                  <TextField
                    label="Roll Number"
                    fullWidth
                    value={form.rollNumber}
                    onChange={(e) => {
                      setForm({ ...form, rollNumber: e.target.value });
                      setErrors((prev) => ({ ...prev, rollNumber: "" }));
                    }}
                    error={!!errors.rollNumber}
                    helperText={errors.rollNumber}
                  />
                </Grid>
              )}

            </Grid>
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
            <Button onClick={handleCloseDrawer} sx={{ outline: "none !important" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ outline: "none !important" }}
            >
              {editingUserId ? "Update" : "Create"}
            </Button>
          </Box>
        </Box>
      </Drawer>

      <DeleteDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, userId: null })}
        onConfirm={handleDelete}
        title="Confirm Delete"
        description="Are you sure you want to delete this user?"
      />
    </Box>
  );
};

export default UserManagement;
