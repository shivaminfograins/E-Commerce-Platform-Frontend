import React, { useState, useEffect } from "react";
import { Grid, TextField, MenuItem, Button, Box, Typography, Divider } from "@mui/material";
import VariantTable from "./VariantTable";
import VariantModal from "./VariantModal";
import ImageUploader from "./ImageUploader";

function ProductForm({ initialValues, onSubmit, onCancel, categories = [], loading }) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("Active");
  const [image, setImage] = useState("");
  const [variants, setVariants] = useState([]);

  // Variant Modal Action States
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [editingVariantIndex, setEditingVariantIndex] = useState(-1);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || "");
      setBrand(initialValues.brand || "");
      setDescription(initialValues.description || "");
      setCategoryId(initialValues.categoryId || "");
      setStatus(initialValues.status || "Active");
      setImage(initialValues.image || "");
      setVariants(initialValues.variants || []);
    } else {
      setName("");
      setBrand("");
      setDescription("");
      setCategoryId("");
      setStatus("Active");
      setImage("");
      setVariants([]);
    }
    setErrors({});
  }, [initialValues]);

  const validate = () => {
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = "Product name is required";
    if (!brand.trim()) tempErrors.brand = "Brand is required";
    if (!categoryId) tempErrors.categoryId = "Category is required";
    if (variants.length === 0) tempErrors.variants = "At least one product variant is required";
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
      status,
      image,
      variants
    });
  };

  // Variant Actions
  const handleOpenAddVariant = () => {
    setSelectedVariant(null);
    setEditingVariantIndex(-1);
    setVariantModalOpen(true);
  };

  const handleOpenEditVariant = (variant, index) => {
    setSelectedVariant(variant);
    setEditingVariantIndex(index);
    setVariantModalOpen(true);
  };

  const handleVariantSubmit = (variantData) => {
    if (editingVariantIndex > -1) {
      // Edit mode
      setVariants((prev) =>
        prev.map((v, i) => (i === editingVariantIndex ? { ...v, ...variantData } : v))
      );
    } else {
      // Add mode
      setVariants((prev) => [...prev, { id: Date.now(), ...variantData }]);
    }
    setVariantModalOpen(false);
  };

  const handleVariantDelete = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Grid container spacing={3}>
        {/* Left Side: General Info */}
        <Grid item xs={12} md={7}>
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
                label="Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                error={Boolean(errors.brand)}
                helperText={errors.brand}
                disabled={loading}
                InputProps={{ style: { borderRadius: "10px" } }}
              />
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
        </Grid>

        {/* Right Side: Image Upload & UI */}
        <Grid item xs={12} md={5}>
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5, color: "#475569" }}>
            Product Image
          </Typography>
          <ImageUploader imageUrl={image} onImageUpload={setImage} disabled={loading} />
        </Grid>

        {/* Bottom Section: Variants */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
                Product Variants
              </Typography>
              {errors.variants && (
                <Typography variant="caption" color="error" sx={{ fontWeight: 600 }}>
                  ⚠️ {errors.variants}
                </Typography>
              )}
            </Box>
            <Button variant="outlined" color="primary" onClick={handleOpenAddVariant} disabled={loading}>
              + Add Variant
            </Button>
          </Box>

          <VariantTable
            variants={variants}
            onEdit={handleOpenEditVariant}
            onDelete={handleVariantDelete}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
        <Button onClick={onCancel} variant="outlined" color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? "Saving..." : initialValues ? "Update Product" : "Create Product"}
        </Button>
      </Box>

      {/* Nested Variant Modal */}
      <VariantModal
        open={variantModalOpen}
        onClose={() => setVariantModalOpen(false)}
        onSubmit={handleVariantSubmit}
        initialValues={selectedVariant}
      />
    </Box>
  );
}

export default ProductForm;
