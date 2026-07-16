import React from "react";
import { Paper, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Box, Divider, Chip, Tooltip, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AVATAR_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

function RecentCustomers({ customers = [] }) {
  const navigate = useNavigate();

  if (customers.length === 0) {
    return (
      <Paper
        sx={{
          p: 3,
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
          border: "1px solid rgba(15, 23, 42, 0.05)",
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", mb: 2 }}>
          Latest Customers
        </Typography>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 4 }}>
          <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>👥</Typography>
          <Typography variant="body2" color="text.secondary">No customers yet</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
        border: "1px solid rgba(15, 23, 42, 0.05)",
        height: "100%"
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
          Latest Customers
        </Typography>
        <Chip
          label={`${customers.length} recent`}
          size="small"
          sx={{ bgcolor: "#f5f3ff", color: "#7c3aed", fontWeight: 700, fontSize: "0.72rem" }}
        />
      </Box>

      <List sx={{ width: "100%", p: 0 }}>
        {customers.map((customer, index) => {
          const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
          const initials = (customer.name || "?").charAt(0).toUpperCase();

          return (
            <React.Fragment key={customer.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  px: 0,
                  py: 1.2,
                  borderRadius: "10px",
                  transition: "background 0.15s",
                  "&:hover": { bgcolor: "#f8fafc", cursor: "pointer" },
                }}
                onClick={() => navigate(`/admin/customers/${customer.id}`)}
                secondaryAction={
                  <Tooltip title="View Profile">
                    <IconButton
                      size="small"
                      sx={{ color: "#8b5cf6", "&:hover": { bgcolor: "#f5f3ff" } }}
                      onClick={(e) => { e.stopPropagation(); navigate(`/admin/customers/${customer.id}`); }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: avatarColor,
                      fontWeight: 700,
                      width: 38,
                      height: 38,
                      fontSize: "1rem",
                      boxShadow: `0 2px 8px ${avatarColor}55`
                    }}
                  >
                    {initials}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, flexWrap: "wrap", pr: 4 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b", lineHeight: 1.3 }}>
                        {customer.name}
                      </Typography>
                      <Box
                        sx={{
                          px: 0.8,
                          py: 0.1,
                          borderRadius: "50px",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          bgcolor: customer.isActive ? "#d1fae5" : "#fee2e2",
                          color: customer.isActive ? "#065f46" : "#991b1b",
                          letterSpacing: "0.03em"
                        }}
                      >
                        {customer.isActive ? "Active" : "Inactive"}
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 0.3 }}>
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", fontSize: "0.75rem" }}
                      >
                        {customer.email}
                      </Typography>
                      {customer.phone && (
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", fontSize: "0.72rem" }}
                        >
                          📞 {customer.phone}
                        </Typography>
                      )}
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{ fontSize: "0.72rem", color: "#94a3b8", display: "block", mt: 0.3 }}
                      >
                        Joined: {customer.joined}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < customers.length - 1 && <Divider component="li" sx={{ opacity: 0.4, my: 0.2 }} />}
            </React.Fragment>
          );
        })}
      </List>

      <Box
        sx={{
          mt: 2,
          pt: 2,
          borderTop: "1px solid rgba(15,23,42,0.06)",
          textAlign: "center"
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: "#8b5cf6",
            fontWeight: 700,
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" }
          }}
          onClick={() => navigate("/admin/customers")}
        >
          View All Customers →
        </Typography>
      </Box>
    </Paper>
  );
}

export default RecentCustomers;
