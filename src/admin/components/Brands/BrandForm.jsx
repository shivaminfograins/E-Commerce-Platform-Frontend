import { useState } from "react";
import { Grid, TextField, MenuItem, Button, Box, Typography, Avatar, FormHelperText } from "@mui/material";

const BACKEND_ORIGIN = import.meta.env.VITE_MEDIA_BASE_URL || "http://127.0.0.1:8000";

const normalizeMediaUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) return url;
  if (url.startsWith("/media/")) return BACKEND_ORIGIN + url;
  return url;
};

function BrandForm({ initialValues, onSubmit, onCancel, loading }) {
  const [name, setName] = useState(initialValues?.name || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [status, setStatus] = useState(initialValues?.status || "Active");
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    normalizeMediaUrl(initialValues?.image) || null
  );

  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const validate = () => {
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = "Brand name is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("is_active", status === "Active" ? "true" : "false");
    if (imageFile) {
      formData.append("image", imageFile);
    }

    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Grid container spacing={3}>
        {/* Left Side: Text Inputs */}
        <Grid item xs={12} md={7}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Brand Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={Boolean(errors.name)}
                helperText={errors.name}
                disabled={loading}
                InputProps={{ style: { borderRadius: "10px" } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                InputProps={{ style: { borderRadius: "10px" } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={loading}
                InputProps={{ style: { borderRadius: "10px" } }}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Side: Logo Upload */}
        <Grid item xs={12} md={5}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#475569", mb: 1.5 }}>
            Brand Logo / Image
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
              border: "1.5px dashed rgba(15, 23, 42, 0.15)",
              borderRadius: "16px",
              bgcolor: "#f8fafc",
              textAlign: "center"
            }}
          >
            {imagePreview ? (
              <Box sx={{ position: "relative", mb: 2 }}>
                <Avatar
                  src={imagePreview}
                  variant="rounded"
                  sx={{ width: 120, height: 120, border: "1px solid rgba(15,23,42,0.08)", bgcolor: "white" }}
                />
                <Button
                  onClick={handleRemoveImage}
                  variant="contained"
                  color="error"
                  size="small"
                  disabled={loading}
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    borderRadius: "50%",
                    minWidth: 0,
                    width: 24,
                    height: 24,
                    p: 0,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}
                >
                  ✕
                </Button>
              </Box>
            ) : (
              <Avatar
                variant="rounded"
                sx={{ width: 120, height: 120, bgcolor: "#e2e8f0", color: "#64748b", fontSize: "3rem", mb: 2 }}
              >
                🏷️
              </Avatar>
            )}

            <Button
              variant="outlined"
              component="label"
              size="small"
              disabled={loading}
              sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600, borderColor: "rgba(15,23,42,0.15)", color: "#1e293b", "&:hover": { borderColor: "#1e293b", bgcolor: "rgba(15,23,42,0.02)" } }}
            >
              Select Image
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </Button>
            <Typography variant="caption" sx={{ display: "block", mt: 1.5, color: "#64748b" }}>
              Recommended: PNG or JPEG logo, max size 2MB.
            </Typography>
            {errors.image && (
              <FormHelperText error sx={{ mt: 1, fontWeight: 600 }}>
                {errors.image}
              </FormHelperText>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Buttons Row */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button onClick={onCancel} variant="outlined" color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? "Saving..." : initialValues ? "Update Brand" : "Add Brand"}
        </Button>
      </Box>
    </Box>
  );
}

export default BrandForm;
