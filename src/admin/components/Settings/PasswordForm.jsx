import React, { useState } from "react";
import { Box, TextField, Button, Alert, Grid } from "@mui/material";
import settingsService from "../../services/settingsService";

function PasswordForm() {
  const [formData, setFormData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", severity: "success" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", severity: "success" });

    // Client-side checks
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: "New passwords do not match.", severity: "error" });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ text: "Password must be at least 6 characters.", severity: "error" });
      return;
    }

    setLoading(true);
    try {
      const response = await settingsService.changePassword(formData.oldPassword, formData.newPassword);
      setMessage({ text: response.message, severity: "success" });
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMessage({ text: err.message || "Failed to change password.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {message.text && (
        <Alert severity={message.severity} sx={{ mb: 3, borderRadius: "10px" }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ maxWidth: 600 }}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            type="password"
            label="Current Password (Default: admin123)"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            type="password"
            label="New Password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            type="password"
            label="Confirm New Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              py: 1.2,
              px: 3,
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
              fontWeight: 700
            }}
          >
            {loading ? "Updating..." : "Change Password"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PasswordForm;
