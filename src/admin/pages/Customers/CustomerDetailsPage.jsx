import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Tabs, Tab, CircularProgress, Alert, Grid } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import customerService from "../../services/customerService";
import CustomerDetails from "../../components/Customers/CustomerDetails";
import AddressCard from "../../components/Customers/AddressCard";
import OrderHistory from "../../components/Customers/OrderHistory";

function CustomerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0); // 0: Profile, 1: Addresses, 2: Orders

  useEffect(() => {
    fetchCustomerDetails();
  }, [id]);

  const fetchCustomerDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await customerService.getCustomerById(id);
      setCustomer(response.data);
    } catch (err) {
      setError("Customer profile not found or failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8, flexGrow: 1 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !customer) {
    return (
      <Box sx={{ py: 4 }}>
        <Button
          onClick={() => navigate("/admin/customers")}
          startIcon={<span>←</span>}
          sx={{ mb: 3 }}
        >
          Back to Customers
        </Button>
        <Alert severity="error" sx={{ borderRadius: "10px" }}>{error || "Unable to display customer details."}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Top Breadcrumb & Action Row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Button
            onClick={() => navigate("/admin/customers")}
            sx={{
              mb: 1.5,
              color: "#64748b",
              fontWeight: 700,
              p: 0,
              minWidth: 0,
              "&:hover": { bg: "transparent", color: "#3b82f6" }
            }}
            startIcon={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
            }
          >
            Back to Customers
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>
            Customer Profile
          </Typography>
        </Box>
      </Box>

      {/* Tabs Row */}
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
              minWidth: 100,
              px: 3,
            }
          }}
        >
          <Tab label="Profile Overview" id="customer-tab-0" />
          <Tab label={`Addresses (${customer.addresses?.length || 0})`} id="customer-tab-1" />
          <Tab label={`Orders (${customer.orders?.length || 0})`} id="customer-tab-2" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <Box sx={{ minHeight: "300px" }}>
        {activeTab === 0 && (
          <CustomerDetails customer={customer} />
        )}

        {activeTab === 1 && (
          <Box>
            {(!customer.addresses || customer.addresses.length === 0) ? (
              <Alert severity="info" sx={{ borderRadius: "10px" }}>
                No addresses stored on file for this customer.
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {customer.addresses.map((address) => (
                  <Grid item xs={12} sm={6} md={4} key={address.id}>
                    <AddressCard address={address} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {activeTab === 2 && (
          <OrderHistory orders={customer.orders} />
        )}
      </Box>
    </Box>
  );
}

export default CustomerDetailsPage;
