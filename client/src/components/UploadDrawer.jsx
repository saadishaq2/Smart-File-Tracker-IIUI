import React, { useState } from 'react'
import { Box, Button, Drawer, Grid, IconButton, MenuItem, TextField, Typography } from '@mui/material'
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers'
import { isBefore } from "date-fns";
import { getSuggestedReminder, uploadFile } from '../redux/file/fileService';
import { toast } from 'react-toastify';
import { getFileIcon } from '../services/utility';
import { useDispatch } from 'react-redux';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CloseIcon from "@mui/icons-material/Close";
import { addFile } from '../redux/file/fileSlice';

const UploadDrawer = ({
    handleCloseDrawer,
    drawerOpen,
    departments
}) => {
    const dispatch = useDispatch();
    const [form, setForm] = useState({
        department: "",
        remarks: "",
        file: null,
        dueDate: null,
        reminderAt: null,
    });

    const [formErrors, setFormErrors] = useState({
        department: "",
        file: "",
        dueDate: "",
    });

    const handleGetSuggestedReminder = async (date) => {
        try {
            const reminder = await getSuggestedReminder({ dueDate: date });

            if (reminder?.reminderAt) {
                const parsedReminderDate = new Date(reminder.reminderAt);
                if (!isNaN(parsedReminderDate)) {
                    setForm((prev) => ({ ...prev, reminderAt: parsedReminderDate }));
                } else {
                    toast.error("Invalid reminder date returned.");
                }
            } else {
                toast.error("No reminder suggestion returned.");
            }
        } catch (err) {
            toast.error("Failed to get suggested reminder. Please try again.");
        }
    };

    const closeDrawer = () => {
        setForm({
            department: "",
            remarks: "",
            file: null,
        })
        setFormErrors({
            department: "",
            file: "",
        })
        handleCloseDrawer()
    }

    const handleSubmit = async () => {
        let hasError = false;
        const errors = { department: "", file: "" };

        if (!form.department) {
            errors.department = "Department is required";
            hasError = true;
        }
        if (!form.file) {
            errors.file = "Please select a file";
            hasError = true;
        }
        if (!form.dueDate) {
            errors.dueDate = "Due date is required";
            hasError = true;
        }

        setFormErrors(errors);
        if (hasError) return;

        try {
            const formData = new FormData();
            formData.append("department", form.department);
            formData.append("remarks", form.remarks || "");
            formData.append("file", form.file);
            formData.append("dueDate", form.dueDate?.toISOString() || "");
            formData.append("reminderAt", form.reminderAt?.toISOString() || "");
            const file = await uploadFile(formData);
            dispatch(addFile(file));
            closeDrawer();
            toast.success("File uploaded successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to upload file. Please try again.");
        }
    };

    return (
        <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={closeDrawer}
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
                        Upload File
                    </Typography>
                </Box>
                <Box sx={{ flex: 1, overflowY: "auto", px: 3, pt: 3, pb: 2 }}>
                    <Grid container spacing={2} direction="column">
                        <Grid item xs={12}>
                            <Typography sx={{ mb: 1 }} variant="body2" color="success" fontWeight={500} gutterBottom>
                                Select the department you want to send this file to:
                            </Typography>
                            <TextField
                                select
                                label="Department *"
                                fullWidth
                                size="small"
                                value={form.department}
                                onChange={(e) => {
                                    setForm((prev) => ({ ...prev, department: e.target.value }))
                                    setFormErrors((prev) => ({ ...prev, department: "" }))
                                }
                                }
                                error={!!formErrors.department}
                                helperText={formErrors.department}
                            >
                                {departments.map((dept) => (
                                    <MenuItem key={dept.value} value={dept.value}>
                                        {dept.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Remarks (optional)"
                                fullWidth
                                size="small"
                                value={form.remarks}
                                onChange={(e) =>
                                    setForm((prev) => ({ ...prev, remarks: e.target.value }))
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <MobileDateTimePicker
                                            label="Due Date"
                                            value={form.dueDate}
                                            onChange={(newValue) => {
                                                const now = new Date();
                                                let adjustedDate = newValue;
                                                if (newValue) {
                                                    const selectedTime = new Date(newValue);
                                                    if (
                                                        isBefore(selectedTime, now) ||
                                                        (selectedTime.getHours() === 0 &&
                                                            selectedTime.getMinutes() === 0 &&
                                                            selectedTime.getSeconds() === 0)
                                                    ) {
                                                        adjustedDate = new Date(now.getTime() + 30 * 60 * 1000);
                                                    }
                                                }
                                                setForm((prev) => ({ ...prev, dueDate: adjustedDate }));
                                            }}
                                            onAccept={(newValue) => {
                                                handleGetSuggestedReminder(newValue);
                                            }}
                                            minDateTime={new Date()}
                                            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
                                            slotProps={{
                                                textField: {
                                                    size: 'small',
                                                    fullWidth: true,
                                                    error: !!formErrors.dueDate,
                                                    helperText: formErrors.dueDate,
                                                    sx: {
                                                        '& .MuiIconButton-root': {
                                                            outline: 'none !important',
                                                            boxShadow: 'none !important',
                                                        },
                                                        '& .MuiIconButton-root:focus': {
                                                            outline: 'none !important',
                                                            boxShadow: 'none !important',
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <MobileDateTimePicker
                                            label="Reminder At"
                                            value={form.reminderAt ? new Date(form.reminderAt) : null}
                                            onChange={(newValue) =>
                                                setForm((prev) => ({ ...prev, reminderAt: newValue }))
                                            }
                                            views={['year', 'month', 'day', 'hours', 'minutes']}
                                            minDateTime={new Date()}
                                            slotProps={{
                                                textField: {
                                                    size: 'small',
                                                    fullWidth: true,
                                                    sx: {
                                                        '& .MuiIconButton-root': {
                                                            outline: 'none !important',
                                                            boxShadow: 'none !important',
                                                        },
                                                        '& .MuiIconButton-root:focus': {
                                                            outline: 'none !important',
                                                            boxShadow: 'none !important',
                                                        },
                                                    },
                                                },
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                Supported file types: <strong>.pdf, .jpeg, .png</strong>
                            </Typography>
                            <Button
                                variant="contained"
                                component="label"
                                sx={{ outline: "none !important" }}
                            >
                                Select File
                                <input
                                    type="file"
                                    hidden
                                    multiple={false}
                                    accept=".pdf,.jpeg,.jpg,.png"
                                    onClick={(e) => (e.target.value = null)}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;

                                        const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
                                        if (!allowedTypes.includes(file.type)) {
                                            setFormErrors((prev) => ({
                                                ...prev,
                                                file: "Only PDF, JPEG or PNG files are allowed.",
                                            }));
                                            setForm((prev) => ({ ...prev, file: null }));
                                            return;
                                        }

                                        setFormErrors((prev) => ({ ...prev, file: null }));
                                        setForm((prev) => ({ ...prev, file }));
                                    }}
                                />
                            </Button>

                            {form.file && (
                                <Box
                                    mt={2}
                                    px={2}
                                    py={1}
                                    border="1px solid #ccc"
                                    borderRadius={1}
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                    bgcolor="#f9f9f9"
                                >
                                    {getFileIcon(form.file.name)}

                                    <Typography
                                        variant="body2"
                                        sx={{ flexGrow: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                                    >
                                        {form.file.name}
                                    </Typography>

                                    <IconButton
                                        size="small"
                                        onClick={() => setForm((prev) => ({ ...prev, file: null }))}
                                        sx={{ color: "red", outline: "none !important" }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            )}

                            {formErrors.file && (
                                <Typography variant="caption" color="error" sx={{ ml: 1, mt: 1, display: "block" }}>
                                    {formErrors.file}
                                </Typography>
                            )}
                        </Grid>

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
                    <Button onClick={closeDrawer} sx={{ outline: "none !important" }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSubmit} sx={{ outline: "none !important" }}>
                        Submit
                    </Button>
                </Box>
            </Box>
        </Drawer>
    )
}

export default UploadDrawer