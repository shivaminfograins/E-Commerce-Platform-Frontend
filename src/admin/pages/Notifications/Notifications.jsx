import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Pagination,
  Alert,
  CircularProgress,
  Skeleton,
  Stack,
  Chip
} from "@mui/material";
import { useNotifications } from "../../hooks/useNotifications";
import NotificationCard from "../../components/Notifications/NotificationCard";

const NOTIFICATION_TYPES = [
  { value: "ORDER", label: "Orders" },
  { value: "INVENTORY", label: "Inventory" },
  { value: "COUPON", label: "Coupons" },
  { value: "CUSTOMER", label: "Customers" },
  { value: "PAYMENT", label: "Payments" },
  { value: "REVIEW", label: "Reviews" },
  { value: "PRODUCT", label: "Products" },
  { value: "SYSTEM", label: "System" },
];

function Notifications() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    count,
    fetchNotifications,
    markRead,
    markAllRead,
    deleteNotification,
    seedTestNotification,
  } = useNotifications(false); // disable auto-poll on this main page to avoid layout jumping while viewing/filtering

  // Local state for filters
  const [tabValue, setTabValue] = useState("all"); // all, unread, read
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [ordering, setOrdering] = useState("-created_at");
  const [page, setPage] = useState(1);

  // Trigger data fetching on filter/pagination changes
  const loadData = () => {
    const params = {
      page: page,
      ordering: ordering,
    };

    if (tabValue === "unread") {
      params.is_read = "false";
    } else if (tabValue === "read") {
      params.is_read = "true";
    }

    if (search) {
      params.search = search;
    }

    if (selectedType) {
      params.notification_type = selectedType;
    }

    if (selectedPriority) {
      params.priority = selectedPriority;
    }

    fetchNotifications(params);
  };

  useEffect(() => {
    loadData();
  }, [tabValue, selectedType, selectedPriority, ordering, page]);

  // Handle search with local debounce or simple search trigger
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedType("");
    setSelectedPriority("");
    setOrdering("-created_at");
    setTabValue("all");
    setPage(1);
  };

  const handleSeed = (type) => {
    let title = `New ${type} alert`;
    let msg = `System generated alert for ${type.toLowerCase()} updates.`;
    let priority = "MEDIUM";
    
    if (type === "ORDER") {
      title = "New Order Recieved";
      msg = "Order #ORD-20260729-1025 has been successfully placed by a customer.";
    } else if (type === "INVENTORY") {
      title = "Stock Warning Alert";
      msg = "Inventory for variant 'Super Bass Headphones - Black' has dropped below minimum threshold.";
      priority = "HIGH";
    } else if (type === "SYSTEM") {
      title = "Failed Backup Alert";
      msg = "Automated daily snapshot backup failed at 03:00 UTC due to network timeout.";
      priority = "HIGH";
    }
    
    seedTestNotification(type, priority, title, msg);
  };

  const totalPages = Math.ceil(count / 15);

  return (
    <Box sx={{ py: 2 }}>
      {/* Header section */}
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", mb: 4, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a" }}>
            Notification Center
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage recent system logs, user actions, inventory alerts, and order lifecycle changes.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          {unreadCount > 0 && (
            <Button
              variant="outlined"
              onClick={markAllRead}
              sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 700 }}
            >
              Mark all as read
            </Button>
          )}
          
          {/* Quick Seed Buttons for Development Testing */}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleSeed("ORDER")}
            sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 700 }}
          >
            + Seed Order
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => handleSeed("INVENTORY")}
            sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 700 }}
          >
            + Seed Inventory
          </Button>
        </Stack>
      </Box>

      {/* Main Filter Panel */}
      <Card sx={{ borderRadius: "16px", border: "1px solid rgba(15, 23, 42, 0.06)", boxShadow: "0 4px 20px rgba(15,23,42,0.03)", mb: 4 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Tab filtering */}
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              mb: 3,
              "& .MuiTab-root": { fontWeight: 700, textTransform: "none", fontSize: "0.95rem" }
            }}
          >
            <Tab label={`All Notifications (${count})`} value="all" />
            <Tab label="Unread" value="unread" />
            <Tab label="Read" value="read" />
          </Tabs>

          {/* Search and Filters grid */}
          <form onSubmit={handleSearchSubmit}>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Search notifications"
                  variant="outlined"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. Order #1025..."
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="type-label">Type</InputLabel>
                  <Select
                    labelId="type-label"
                    value={selectedType}
                    label="Type"
                    onChange={(e) => {
                      setSelectedType(e.target.value);
                      setPage(1);
                    }}
                    sx={{ borderRadius: "8px" }}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    {NOTIFICATION_TYPES.map((t) => (
                      <MenuItem key={t.value} value={t.value}>
                        {t.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="priority-label">Priority</InputLabel>
                  <Select
                    labelId="priority-label"
                    value={selectedPriority}
                    label="Priority"
                    onChange={(e) => {
                      setSelectedPriority(e.target.value);
                      setPage(1);
                    }}
                    sx={{ borderRadius: "8px" }}
                  >
                    <MenuItem value="">All Priorities</MenuItem>
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="sort-label">Sort By</InputLabel>
                  <Select
                    labelId="sort-label"
                    value={ordering}
                    label="Sort By"
                    onChange={(e) => {
                      setOrdering(e.target.value);
                      setPage(1);
                    }}
                    sx={{ borderRadius: "8px" }}
                  >
                    <MenuItem value="-created_at">Newest First</MenuItem>
                    <MenuItem value="created_at">Oldest First</MenuItem>
                    <MenuItem value="priority">Priority Low-High</MenuItem>
                    <MenuItem value="-priority">Priority High-Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={12} md={2}>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button
                    type="submit"
                    variant="contained"
                    size="medium"
                    sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 700 }}
                  >
                    Search
                  </Button>
                  <Button
                    variant="text"
                    size="medium"
                    onClick={handleResetFilters}
                    sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 700, color: "text.secondary" }}
                  >
                    Reset
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Notifications list display */}
      <Box sx={{ mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ py: 4 }}>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} sx={{ mb: 2, borderRadius: "12px", border: "1px solid rgba(15, 23, 42, 0.06)", boxShadow: "none" }}>
                <CardContent sx={{ display: "flex", p: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="80%" height={16} />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : notifications.length === 0 ? (
          <Card sx={{ borderRadius: "16px", p: 8, textAlign: "center", border: "1px solid rgba(15, 23, 42, 0.06)", boxShadow: "none" }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", mb: 1 }}>
              No notifications found 📭
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              There are no notifications matching your current filters or query settings.
            </Typography>
            <Button variant="outlined" onClick={handleResetFilters} sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 700 }}>
              Clear Filters
            </Button>
          </Card>
        ) : (
          notifications.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onMarkRead={markRead}
              onDelete={deleteNotification}
            />
          ))
        )}
      </Box>

      {/* Pagination control */}
      {totalPages > 1 && !loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, v) => setPage(v)}
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": { fontWeight: 700, borderRadius: "8px" }
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export default Notifications;
export { Notifications };
