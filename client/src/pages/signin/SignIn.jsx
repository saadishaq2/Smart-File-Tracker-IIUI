import React, { useState } from "react";
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    Link,
    Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import loginBg from "../../assets/loginbg.jpg";
import sftsLogo from "../../assets/sftsLogo.png";
import { signin } from "../../redux/auth/authService";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/auth/authSlice";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

const SignIn = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email";
        if (!password) newErrors.password = "Password is required";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        try {
            const res = await signin({ email, password });
            dispatch(
                loginSuccess({
                    token: res.data.token,
                    user: res.data.user,
                })
            );
            navigate("/dashboard");
        } catch (err) {
            console.error("Signin error:", err);
            setErrors((prev) => ({
                ...prev,
                general:
                    err.response?.data?.message ||
                    "Invalid email or password. Please try again.",
            }));
        }
    };


    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundImage: `url(${loginBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Container maxWidth="sm">
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
                            label="Email"
                            fullWidth
                            margin="normal"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors((prev) => ({ ...prev, email: "", general: "" }));
                            }}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                        <TextField
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrors((prev) => ({ ...prev, password: "", general: "" }));
                            }}
                            error={!!errors.password}
                            helperText={errors.password}
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        sx={{ outline: "none !important" }}
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        edge="end"
                                        aria-label="toggle password visibility"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                ),
                            }}
                        />

                        {errors.general && (
                            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                {errors.general}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{ mt: 3, mb: 2, borderRadius: 2, outline: "none !important" }}
                        >
                            Sign In
                        </Button>
                    </Box>

                    <Grid container justifyContent="center">
                        <Typography variant="body2">
                            Don&apos;t have an account?{" "}
                            <Link component="button" onClick={() => navigate("/signup")}>
                                Sign Up
                            </Link>
                        </Typography>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default SignIn;
