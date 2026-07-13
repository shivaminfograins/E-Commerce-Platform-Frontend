import React from "react";
import { Grid, Paper, Typography, Box, Divider, List, ListItem, ListItemText, Avatar } from "@mui/material";

function CustomerDetails({ customer }) {
  if (!customer) return null;

  return (
    <Grid container spacing={3}>
      {/* Profile Details Card */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)", height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Avatar
              src={customer.avatar}
              sx={{ width: 64, height: 64, bgcolor: "#3b82f6", fontWeight: 800, fontSize: "1.5rem" }}
            >
              {customer.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
                {customer.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Customer ID: #{customer.id}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <List disablePadding>
            <ListItem disableGutters>
              <ListItemText
                primary="Email Address"
                secondary={customer.email}
                primaryTypographyProps={{ variant: "caption", color: "text.secondary", fontWeight: 600 }}
                secondaryTypographyProps={{ variant: "body1", color: "text.primary", fontWeight: 500 }}
              />
            </ListItem>
            <ListItem disableGutters sx={{ mt: 1 }}>
              <ListItemText
                primary="Phone Number"
                secondary={customer.phone || "Not Provided"}
                primaryTypographyProps={{ variant: "caption", color: "text.secondary", fontWeight: 600 }}
                secondaryTypographyProps={{ variant: "body1", color: "text.primary", fontWeight: 500 }}
              />
            </ListItem>
            <ListItem disableGutters sx={{ mt: 1 }}>
              <ListItemText
                primary="Registration Source"
                secondary={customer.source || "Direct Website"}
                primaryTypographyProps={{ variant: "caption", color: "text.secondary", fontWeight: 600 }}
                secondaryTypographyProps={{ variant: "body1", color: "text.primary", fontWeight: 500 }}
              />
            </ListItem>
            <ListItem disableGutters sx={{ mt: 1 }}>
              <ListItemText
                primary="Status"
                secondary={customer.status}
                primaryTypographyProps={{ variant: "caption", color: "text.secondary", fontWeight: 600 }}
                secondaryTypographyProps={{
                  variant: "body1",
                  fontWeight: 700,
                  color: customer.status === "Active" ? "#065f46" : "#b91c1c"
                }}
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>

      {/* Internal Notes and Metadata */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)", height: "100%", display: "flex", flexDirection: "column" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", mb: 2 }}>
            Account Metadata & Notes
          </Typography>

          <List disablePadding sx={{ flexGrow: 1 }}>
            <ListItem disableGutters>
              <ListItemText
                primary="Account Created"
                secondary={new Date(customer.dateJoined).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                primaryTypographyProps={{ variant: "caption", color: "text.secondary", fontWeight: 600 }}
                secondaryTypographyProps={{ variant: "body2", color: "text.primary", fontWeight: 500 }}
              />
            </ListItem>
            
            <ListItem disableGutters sx={{ mt: 2 }}>
              <ListItemText
                primary="Total Spend Value"
                secondary={`₹${Number(customer.lifetimeValue).toLocaleString()}`}
                primaryTypographyProps={{ variant: "caption", color: "text.secondary", fontWeight: 600 }}
                secondaryTypographyProps={{ variant: "body1", color: "#10b981", fontWeight: 800 }}
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mt: "auto" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 1 }}>
              Staff Internal Notes
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: "#f8fafc",
                borderRadius: "10px",
                border: "1px dashed rgba(15,23,42,0.1)",
                minHeight: "75px"
              }}
            >
              <Typography variant="body2" sx={{ fontStyle: customer.notes ? "normal" : "italic", color: customer.notes ? "text.primary" : "text.secondary" }}>
                {customer.notes || "No notes captured for this customer profile yet."}
              </Typography>
            </Paper>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default CustomerDetails;
