import React from 'react'
import { Box, Drawer, IconButton, Typography } from '@mui/material'
import CloseIcon from "@mui/icons-material/Close";

const FileHistoryDrawer = ({
    historyDrawerOpen,
    handleCloseHistoryDrawer,
    selectedFile
}) => {
    return (
        <Drawer
            anchor="right"
            open={historyDrawerOpen}
            onClose={handleCloseHistoryDrawer}
            PaperProps={{
                sx: {
                    mt: { xs: 6, sm: 8 },
                    height: "calc(100% - 64px)",
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                    boxShadow: 6,
                    width: { xs: "100vw", sm: 420 },
                    backgroundColor: "#f5f7fb",
                },
            }}
        >
            <Box
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        px: 3,
                        py: 2.5,
                        borderBottom: "1px solid #e0e0e0",
                        bgcolor: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography variant="h6" fontWeight={600}>
                        File History
                    </Typography>
                    <IconButton onClick={handleCloseHistoryDrawer} sx={{ outline: "none !important" }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Body */}
                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        px: 3,
                        pt: 3,
                        pb: 2,
                    }}
                >
                    {selectedFile?.history?.length ? (
                        [...selectedFile.history].reverse().map((entry, index) => (
                            <Box
                                key={index}
                                sx={{
                                    mb: 2.5,
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor: "#fff",
                                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                                    borderLeft: `4px solid ${entry.status === "approved"
                                            ? "#4caf50"
                                            : entry.status === "rejected"
                                                ? "#f44336"
                                                : "#90caf9"
                                        }`,
                                }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    fontWeight={600}
                                    gutterBottom
                                    sx={{ textTransform: "capitalize" }}
                                >
                                    {entry.status} -{" "}
                                    <Typography
                                        variant="body2"
                                        component="span"
                                        fontWeight={400}
                                        color="text.secondary"
                                    >
                                        {new Date(entry.date).toLocaleString()}
                                    </Typography>
                                </Typography>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                >
                                    <strong>By:</strong> {entry.changedBy?.fullName || "Unknown"}
                                </Typography>

                                {entry.remarks && (
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Remarks:</strong> {entry.remarks}
                                    </Typography>
                                )}
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No history available.
                        </Typography>
                    )}

                </Box>
            </Box>
        </Drawer>
    )
}

export default FileHistoryDrawer