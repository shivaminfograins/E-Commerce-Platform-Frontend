import { useState } from "react";
import { Box, TextField, Button, MenuItem } from "@mui/material";

function CategoryForm({ initialValues, onSubmit, onCancel, loading }) {
  const [name, setName] = useState(initialValues?.name || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [status, setStatus] = useState(initialValues?.status || "Active");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Category Name is required");
      return;
    }

    onSubmit({ name, description, status });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        fullWidth
        label="Category Name"
        variant="outlined"
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={Boolean(error)}
        helperText={error}
        disabled={loading}
        InputProps={{ style: { borderRadius: "10px" } }}
      />

      <TextField
        fullWidth
        label="Description"
        variant="outlined"
        margin="normal"
        multiline
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={loading}
        InputProps={{ style: { borderRadius: "10px" } }}
      />

      <TextField
        fullWidth
        select
        label="Status"
        variant="outlined"
        margin="normal"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        disabled={loading}
        InputProps={{ style: { borderRadius: "10px" } }}
      >
        <MenuItem value="Active">Active</MenuItem>
        <MenuItem value="Inactive">Inactive</MenuItem>
      </TextField>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button onClick={onCancel} variant="outlined" color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? "Saving..." : initialValues ? "Update Category" : "Add Category"}
        </Button>
      </Box>
    </Box>
  );
}

export default CategoryForm;
