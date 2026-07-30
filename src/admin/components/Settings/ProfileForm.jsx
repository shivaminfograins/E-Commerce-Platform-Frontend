import React, { useState, useEffect } from "react";
import { Grid, TextField, Button, Box, Alert, CircularProgress, Avatar, Typography } from "@mui/material";
import profileService from "../../services/profileService";
import { useAdminAuth } from "../../context/AdminAuthContext";

function ProfileForm() {
  const { updateAdminUser } = useAdminAuth();
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", avatar: "", role: "Super Admin", joinedDate: "Jan 2025" });
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
      const data = response.data;
      setProfile(data);
      
      // Update global context with synced details
      updateAdminUser({
        fullName: data.name,
        email: data.email,
        phone: data.phone,
        avatar: data.avatar,
        role: data.role || "Super Admin",
        joinedDate: data.joinedDate || "Jan 2025"
      });
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
      const data = response.data;
      setProfile(data);
      
      // Update global context immediately
      updateAdminUser({
        fullName: data.name,
        email: data.email,
        phone: data.phone,
        avatar: data.avatar,
        role: data.role || "Super Admin",
        joinedDate: data.joinedDate || "Jan 2025"
      });
      
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
        <Alert severity={message.severity} sx={{ mb: 4, borderRadius: "10px" }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Avatar Display & URL input */}
        <Grid item xs={12} sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2 }}>
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={profile.avatar}
              sx={{
                width: 80,
                height: 80,
                border: "3px solid #3b82f6",
                boxShadow: "0 0 15px rgba(59, 130, 246, 0.25)",
                bgcolor: "#3b82f6",
                fontSize: "2rem",
                fontWeight: 800
              }}
            >
              {profile.name ? profile.name.charAt(0).toUpperCase() : "A"}
            </Avatar>
            <Box
              sx={{
                position: "absolute",
                bottom: 2,
                right: 2,
                width: 12,
                height: 12,
                bgcolor: "#10b981",
                border: "2px solid #ffffff",
                borderRadius: "50%"
              }}
            />
          </Box>
          <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#475569", mb: 0.5 }}>
              Avatar URL
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              name="avatar"
              value={profile.avatar}
              onChange={handleInputChange}
              placeholder="https://example.com/avatar.jpg"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                }
              }}
            />
          </Box>
        </Grid>

        {/* Name Input */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#475569", mb: 1 }}>
            Full Name
          </Typography>
          <TextField
            required
            fullWidth
            name="name"
            value={profile.name}
            onChange={handleInputChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              }
            }}
          />
        </Grid>

        {/* Email Input */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#475569", mb: 1 }}>
            Email Address
          </Typography>
          <TextField
            required
            fullWidth
            type="email"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              }
            }}
          />
        </Grid>

        {/* Phone Input */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#475569", mb: 1 }}>
            Phone Number
          </Typography>
          <TextField
            fullWidth
            name="phone"
            value={profile.phone}
            onChange={handleInputChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              }
            }}
          />
        </Grid>

        {/* Role Display Only */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#475569", mb: 1 }}>
            Security Role
          </Typography>
          <TextField
            disabled
            fullWidth
            name="role"
            value={profile.role}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              }
            }}
          />
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={actionLoading}
            sx={{
              py: 1.2,
              px: 4,
              borderRadius: "10px",
              boxShadow: "0 4px 14px rgba(59, 130, 246, 0.25)",
              fontWeight: 700,
              textTransform: "none",
              fontSize: "0.95rem",
              "&:hover": {
                boxShadow: "0 6px 20px rgba(59, 130, 246, 0.4)"
              }
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
