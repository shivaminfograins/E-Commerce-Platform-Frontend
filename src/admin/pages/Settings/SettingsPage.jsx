import React, { useState, useEffect } from "react";
import { Box, Typography, Tabs, Tab, Paper, Grid, TextField, MenuItem, Switch, FormControlLabel, Card, CardContent } from "@mui/material";
import ProfileForm from "../../components/Settings/ProfileForm";
import PasswordForm from "../../components/Settings/PasswordForm";
import ThemeSwitcher from "../../components/Settings/ThemeSwitcher";
import settingsService from "../../services/settingsService";

function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState({ language: "en", notificationsEnabled: true, emailAlerts: true, timezone: "UTC+5:30" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsService.getSettings();
      setSettings(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleToggleChange = async (name, value) => {
    const updated = { ...settings, [name]: value };
    setSettings(updated);
    await settingsService.updateSettings(updated);
  };

  const handleSelectChange = async (e) => {
    const { name, value } = e.target;
    const updated = { ...settings, [name]: value };
    setSettings(updated);
    await settingsService.updateSettings(updated);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
          Admin Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Manage your personal details, credentials, and app preferences.
        </Typography>
      </Box>

      {/* Tabs list */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{
            "& .MuiTab-root": {
              fontWeight: 700,
              fontSize: "0.95rem",
              textTransform: "none",
              px: 3,
            }
          }}
        >
          <Tab label="Edit Profile" />
          <Tab label="Account Security" />
          <Tab label="System Settings" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <Box sx={{ minHeight: "350px" }}>
        {activeTab === 0 && (
          <Paper sx={{ p: 4, borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)", boxShadow: "0 4px 20px rgba(0,0,0,0.01)" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", mb: 3 }}>
              Update Profile Details
            </Typography>
            <ProfileForm />
          </Paper>
        )}

        {activeTab === 1 && (
          <Paper sx={{ p: 4, borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)", boxShadow: "0 4px 20px rgba(0,0,0,0.01)" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", mb: 3 }}>
              Change Account Password
            </Typography>
            <PasswordForm />
          </Paper>
        )}

        {activeTab === 2 && !loading && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ThemeSwitcher />
            </Grid>

            {/* Language & Localisation Preference Card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)", height: "100%" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                    Localisation Settings
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        select
                        fullWidth
                        label="System Language Placeholder"
                        name="language"
                        value={settings.language}
                        onChange={handleSelectChange}
                        helperText="Language selection placeholder implementation"
                      >
                        <MenuItem value="en">English (US)</MenuItem>
                        <MenuItem value="es">Español (ES)</MenuItem>
                        <MenuItem value="fr">Français (FR)</MenuItem>
                        <MenuItem value="de">Deutsch (DE)</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        select
                        fullWidth
                        label="Timezone"
                        name="timezone"
                        value={settings.timezone}
                        onChange={handleSelectChange}
                      >
                        <MenuItem value="UTC+5:30">Kolkata (GMT+5:30)</MenuItem>
                        <MenuItem value="UTC+0:00">London (GMT)</MenuItem>
                        <MenuItem value="UTC-5:00">New York (EST)</MenuItem>
                        <MenuItem value="UTC-8:00">Los Angeles (PST)</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Notification settings card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)", height: "100%" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                    Staff Notifications
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notificationsEnabled}
                          onChange={(e) => handleToggleChange("notificationsEnabled", e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>Enable In-App Notifications</Typography>
                          <Typography variant="caption" color="text.secondary">Trigger alerts directly within admin layouts</Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.emailAlerts}
                          onChange={(e) => handleToggleChange("emailAlerts", e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>Enable Email Digests</Typography>
                          <Typography variant="caption" color="text.secondary">Receive daily orders summary notifications</Typography>
                        </Box>
                      }
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
}

export default SettingsPage;
