import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Grid } from "@mui/material";

function VariantModal({ open, onClose, onSubmit, initialValues }) {
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || "");
      setSku(initialValues.sku || "");
      setPrice(initialValues.price?.toString() || "");
      setStock(initialValues.stock?.toString() || "");
    } else {
      setName("");
      setSku("");
      setPrice("");
      setStock("");
    }
    setErrors({});
  }, [initialValues, open]);

  const validate = () => {
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = "Variant name is required";
    if (!sku.trim()) tempErrors.sku = "SKU is required";
    if (!price || isNaN(price) || Number(price) < 0) tempErrors.price = "Enter a valid positive price";
    if (!stock || isNaN(stock) || Number(stock) < 0) tempErrors.stock = "Enter a valid positive stock";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      name,
      sku,
      price: Number(price),
      stock: Number(stock)
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ style: { borderRadius: "16px" } }}>
      <DialogTitle sx={{ fontWeight: 800, color: "#1e293b" }}>
        {initialValues ? "Edit Variant" : "Add Variant"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Variant Name"
                placeholder="e.g. Matte Black, 16GB RAM / 1TB SSD"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={Boolean(errors.name)}
                helperText={errors.name}
                InputProps={{ style: { borderRadius: "10px" } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="SKU"
                placeholder="e.g. LP-RZ-16-1T"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                error={Boolean(errors.sku)}
                helperText={errors.sku}
                InputProps={{ style: { borderRadius: "10px" } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Price (₹)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                error={Boolean(errors.price)}
                helperText={errors.price}
                InputProps={{ style: { borderRadius: "10px" } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                error={Boolean(errors.stock)}
                helperText={errors.stock}
                InputProps={{ style: { borderRadius: "10px" } }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default VariantModal;
