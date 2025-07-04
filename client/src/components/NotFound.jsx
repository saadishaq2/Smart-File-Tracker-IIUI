import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h2" fontWeight="bold" color="primary">
        404
      </Typography>
      <Typography variant="h5" mb={1}>
        Page Not Found
      </Typography>
      <Typography variant="body1" mb={3}>
        The page you're looking for doesn't exist or you don't have access.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFound;
