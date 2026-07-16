import { useState } from "react";
import { Grid, Paper, Typography, Box, Divider, List, ListItem, ListItemText, Avatar, Dialog, IconButton } from "@mui/material";

function CustomerDetails({ customer }) {
  const [open, setOpen] = useState(false);

  if (!customer) return null;

  const getInitials = (name = "") => {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <Grid container spacing={3}>
      {/* Profile Details Card */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.05)", height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Avatar
              src={customer.avatar}
              sx={{ width: 64, height: 64, bgcolor: "#3b82f6", fontWeight: 800, fontSize: "1.5rem", cursor: "pointer", transition: "transform 0.2s", "&:hover": { transform: "scale(1.05)", opacity: 0.9 } }}
              onClick={() => setOpen(true)}
            >
              {getInitials(customer.name)}
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
      {/* Profile Picture Popup Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth sx={{ "& .MuiDialog-paper": { borderRadius: "20px" } }}>
        <Box sx={{ position: "relative", p: 4, bgcolor: "white", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <IconButton 
            onClick={() => setOpen(false)} 
            sx={{ position: "absolute", right: 12, top: 12, color: "#64748b", bgcolor: "#f1f5f9", "&:hover": { bgcolor: "#e2e8f0" } }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </IconButton>
          <Box sx={{ mt: 2, mb: 3 }}>
            <Avatar
              src={customer.avatar}
              sx={{ width: 180, height: 180, bgcolor: "#3b82f6", fontWeight: 800, fontSize: "4rem", boxShadow: "0 12px 30px rgba(59,130,246,0.25)" }}
            >
              {getInitials(customer.name)}
            </Avatar>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b", mb: 0.5 }}>
            {customer.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {customer.email}
          </Typography>
        </Box>
      </Dialog>
    </Grid>
  );
}

export default CustomerDetails;
