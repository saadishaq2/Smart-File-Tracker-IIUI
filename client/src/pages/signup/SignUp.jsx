import React, { useState } from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    Grid,
    Link,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    FormHelperText,
    InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import loginBg from "../../assets/loginbg.jpg";
import sftsLogo from "../../assets/sftsLogo.png";
import { signup } from "../../redux/auth/authService";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

const SignUp = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        rollNumber: "",
        email: "",
        password: "",
        department: "",
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!form.fullName) newErrors.fullName = "Full name is required";
        if (!form.rollNumber) newErrors.rollNumber = "Roll number is required";
        if (!form.email) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!form.password) {
            newErrors.password = "Password is required";
        } else if (
            !/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(form.password)
        ) {
            newErrors.password =
                "Password must be at least 8 characters, include 1 uppercase letter, 1 number, and 1 special character.";
        }
        if (!form.department) newErrors.department = "Department is required";
        return newErrors;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        try {
            const res = await signup(form);
            navigate("/signin");
        } catch (err) {
            console.error("Signup error:", err);
        }
    };

    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                // height: "100vh",
                backgroundImage: `url(${loginBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Container maxWidth="sm" sx={{ mt: 6, mb: 4 }}>
                <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
                    <Box textAlign="center" mb={2}>
                        <img
                            src={sftsLogo}
                            alt="SFTS Logo"
                            style={{ width: 60, height: 60 }}
                        />
                        <Typography variant="h5" fontWeight="bold" mt={1}>
                            SFTS
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                            Smart File Tracking System
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            label="Full Name"
                            fullWidth
                            margin="normal"
                            value={form.fullName}
                            onChange={(e) => {
                                setForm({ ...form, fullName: e.target.value });
                                setErrors((prev) => ({ ...prev, fullName: "" }));
                            }}
                            error={!!errors.fullName}
                            helperText={errors.fullName}
                        />
                        <TextField
                            label="Roll Number"
                            fullWidth
                            margin="normal"
                            value={form.rollNumber}
                            onChange={(e) => {
                                setForm({ ...form, rollNumber: e.target.value });
                                setErrors((prev) => ({ ...prev, rollNumber: "" }));
                            }}
                            error={!!errors.rollNumber}
                            helperText={errors.rollNumber}
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            margin="normal"
                            value={form.email}
                            onChange={(e) => {
                                setForm({ ...form, email: e.target.value });
                                setErrors((prev) => ({ ...prev, email: "" }));
                            }}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                        <TextField
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            margin="normal"
                            value={form.password}
                            onChange={(e) => {
                                setForm({ ...form, password: e.target.value });
                                setErrors((prev) => ({ ...prev, password: "" }));
                            }}
                            error={!!errors.password}
                            helperText={errors.password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            sx={{ outline: "none !important" }}
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            edge="end"
                                            aria-label="toggle password visibility"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <FormControl
                            fullWidth
                            margin="normal"
                            error={!!errors.department}
                        >
                            <InputLabel>Department</InputLabel>
                            <Select
                                label="Department"
                                value={form.department}
                                onChange={(e) => {
                                    setForm({ ...form, department: e.target.value });
                                    setErrors((prev) => ({ ...prev, department: "" }));
                                }}
                                MenuProps={{
                                    disableScrollLock: true,
                                    disablePortal: true,
                                    PaperProps: {
                                        style: {
                                            maxHeight: 200,
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="CS">Computer Science (CS)</MenuItem>
                                <MenuItem value="SE">Software Engineering (SE)</MenuItem>
                                <MenuItem value="IT">Information Technology (IT)</MenuItem>
                                <MenuItem value="PHY">Physics (PHY)</MenuItem>
                                <MenuItem value="MATH">Mathematics (MATH)</MenuItem>
                            </Select>
                            <FormHelperText>{errors.department}</FormHelperText>
                        </FormControl>


                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{ mt: 3, mb: 2, borderRadius: 2, outline: "none !important" }}
                        >
                            Sign Up
                        </Button>
                    </Box>

                    <Grid container justifyContent="center">
                        <Typography variant="body2">
                            Already have an account?{" "}
                            <Link component="button" onClick={() => navigate("/signin")}>
                                Sign In
                            </Link>
                        </Typography>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default SignUp;
