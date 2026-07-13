import React from "react";
import { Paper, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Box, Divider } from "@mui/material";

function RecentCustomers({ customers = [] }) {
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
      <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", mb: 2 }}>
        Latest Customers
      </Typography>
      <List sx={{ width: "100%", p: 0 }}>
        {customers.map((customer, index) => (
          <React.Fragment key={customer.id}>
            <ListItem alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "#8b5cf6", fontWeight: 600 }}>
                  {customer.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                    {customer.name}
                  </Typography>
                }
                secondary={
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {customer.email}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "#64748b" }}>
                      {customer.joined}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            {index < customers.length - 1 && <Divider component="li" sx={{ opacity: 0.5 }} />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
}

export default RecentCustomers;
