import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, Box, Alert, CircularProgress, Avatar } from "@mui/material";
import profileService from "../../services/profileService";

function ProfileForm() {
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", avatar: "" });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", severity: "success" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await profileService.getProfile();
      setProfile(response.data);
    } catch {
      setMessage({ text: "Failed to load profile details.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage({ text: "", severity: "success" });
    try {
      const response = await profileService.updateProfile(profile);
      setProfile(response.data);
      setMessage({ text: "Profile details updated successfully!", severity: "success" });
    } catch {
      setMessage({ text: "Failed to update profile details.", severity: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {message.text && (
        <Alert severity={message.severity} sx={{ mb: 3, borderRadius: "10px" }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2 }}>
          <Avatar
            src={profile.avatar}
            sx={{ width: 80, height: 80, bgcolor: "#3b82f6", fontSize: "2rem", fontWeight: 800 }}
          >
            {profile.name.charAt(0)}
          </Avatar>
          <Box>
            <TextField
              label="Avatar URL Placeholder"
              variant="outlined"
              size="small"
              name="avatar"
              value={profile.avatar}
              onChange={handleInputChange}
              placeholder="https://example.com/avatar.jpg"
              sx={{ minWidth: 280 }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Full Name"
            name="name"
            value={profile.name}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            type="email"
            label="Email Address"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={profile.phone}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={actionLoading}
            sx={{
              py: 1.2,
              px: 3,
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
              fontWeight: 700
            }}
          >
            {actionLoading ? "Saving Changes..." : "Update Profile"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProfileForm;
