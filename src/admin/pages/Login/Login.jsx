import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, TextField, Button, Typography, Alert, CircularProgress, InputAdornment, IconButton, ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

const loginTheme = createTheme({
  palette: {
    background: {
      default: "#f8fafc",
      paper: "#ffffff"
    },
    primary: {
      main: "#3b82f6"
    }
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  }
});

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, adminUser, loading } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/admin/dashboard";

  useEffect(() => {
    // If already logged in, redirect directly to target or dashboard
    if (adminUser) {
      navigate(from, { replace: true });
    }
  }, [adminUser, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.message || err.message || "Failed to log in. Please check your credentials.";
      setError(msg);
    }
  };

  return (
    <ThemeProvider theme={loginTheme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
          p: 2
        }}
      >
        <Card sx={{ width: "100%", maxWidth: 440, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)", border: "1px solid rgba(15, 23, 42, 0.06)" }}>
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            {/* Header / Brand */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  color: "white",
                  mb: 2
                }}
              >
                SE
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#1e293b" }}>
                Admin Portal
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Sign in to manage ShopEase store
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                InputProps={{
                  style: { borderRadius: "10px" }
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                InputProps={{
                  style: { borderRadius: "10px" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        )}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.5,
                  borderRadius: "10px",
                  fontSize: "1rem",
                  fontWeight: 700,
                  bgcolor: "primary.main",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)",
                  "&:hover": {
                    bgcolor: "primary.dark"
                  }
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default Login;
