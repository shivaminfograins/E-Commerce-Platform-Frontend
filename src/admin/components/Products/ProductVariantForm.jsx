import { useState } from "react";
import { Grid, TextField, MenuItem, Button, Box } from "@mui/material";

function ProductVariantForm({ initialValues, products = [], onSubmit, onCancel, loading }) {
  const [product, setProduct] = useState(initialValues?.product || "");
  const [name, setName] = useState(initialValues?.name || "");
  const [sku, setSku] = useState(initialValues?.sku || "");
  const [price, setPrice] = useState(initialValues?.price !== undefined ? initialValues.price : "");
  const [stock, setStock] = useState(initialValues?.stock !== undefined ? initialValues.stock : "");
  const [status, setStatus] = useState(initialValues?.status || "Active");

  const [errors, setErrors] = useState({});

  const validate = () => {
    const tempErrors = {};
    if (!product) tempErrors.product = "Please select a product";
    if (!name.trim()) tempErrors.name = "Variant name is required";
    if (!sku.trim()) tempErrors.sku = "SKU is required";
    if (price === "" || isNaN(price) || Number(price) < 0) tempErrors.price = "Enter a valid positive price";
    if (stock === "" || isNaN(stock) || Number(stock) < 0) tempErrors.stock = "Enter a valid positive stock value";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      product,
      name,
      sku,
      price: Number(price),
      stock: Number(stock),
      status
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            select
            label="Select Product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            error={Boolean(errors.product)}
            helperText={errors.product}
            disabled={loading}
            InputProps={{ style: { borderRadius: "10px" } }}
          >
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name} (ID: {p.id})
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Variant Name (e.g. 16GB RAM / 512GB SSD)"
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
            label="SKU Code"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            error={Boolean(errors.sku)}
            helperText={errors.sku}
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
        <Grid item xs={6}>
          <TextField
            fullWidth
            type="number"
            label="Price (₹)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={Boolean(errors.price)}
            helperText={errors.price}
            disabled={loading}
            InputProps={{ style: { borderRadius: "10px" } }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            type="number"
            label="Stock Quantity"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            error={Boolean(errors.stock)}
            helperText={errors.stock}
            disabled={loading}
            InputProps={{ style: { borderRadius: "10px" } }}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button onClick={onCancel} variant="outlined" color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? "Saving..." : initialValues ? "Update Variant" : "Add Variant"}
        </Button>
      </Box>
    </Box>
  );
}

export default ProductVariantForm;
