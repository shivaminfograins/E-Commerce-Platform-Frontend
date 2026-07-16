import { useState } from "react";
import { Grid, TextField, MenuItem, Button, Box } from "@mui/material";

function ProductForm({ initialValues, onSubmit, onCancel, categories = [], brands = [], loading }) {
  const [name, setName] = useState(initialValues?.name || "");
  const [brand, setBrand] = useState(initialValues?.brand || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId || "");
  const [status, setStatus] = useState(initialValues?.status || "Active");

  const [errors, setErrors] = useState({});

  const validate = () => {
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = "Product name is required";
    if (!categoryId) tempErrors.categoryId = "Category is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Get Category Name based on ID
    const selectedCat = categories.find((c) => c.id === categoryId);
    const categoryName = selectedCat ? selectedCat.name : "General";

    onSubmit({
      name,
      brand,
      description,
      categoryId,
      category: categoryName,
      status
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={Boolean(errors.name)}
            helperText={errors.name}
            disabled={loading}
            InputProps={{ style: { borderRadius: "10px" } }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            select
            label="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            disabled={loading}
            InputProps={{ style: { borderRadius: "10px" } }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {brands.map((b) => (
              <MenuItem key={b.id} value={b.id}>
                {b.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            select
            label="Category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            error={Boolean(errors.categoryId)}
            helperText={errors.categoryId}
            disabled={loading}
            InputProps={{ style: { borderRadius: "10px" } }}
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
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
        <Grid item xs={6}>
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

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button onClick={onCancel} variant="outlined" color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? "Saving..." : initialValues ? "Update Product" : "Add Product"}
        </Button>
      </Box>
    </Box>
  );
}

export default ProductForm;
