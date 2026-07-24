import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Alert, Snackbar, CircularProgress } from "@mui/material";
import ProductInformation from "../../components/Products/ProductForm/ProductInformation";
import VariantList from "../../components/Products/ProductForm/VariantList";
import ProductSummary from "../../components/Products/ProductForm/ProductSummary";
import ProductFooter from "../../components/Products/ProductForm/ProductFooter";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import brandService from "../../services/brandService";
import api from "../../../api/axios";

function ProductFormContainer({ productId, onCancel, onSuccess }) {
  const navigate = useNavigate();
  const isEditMode = Boolean(productId);

  // Form State
  const [productData, setProductData] = useState({
    name: "",
    brand: "",
    categoryId: "",
    description: "",
    status: "Active"
  });
  const [variants, setVariants] = useState([]);
  const [errors, setErrors] = useState({});

  // Loading & Error States
  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Load Categories & Brands & Product Details if Edit
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [cats, brs] = await Promise.all([
          categoryService.getCategories(),
          brandService.getBrands()
        ]);
        setCategories(cats.filter(c => c.status === "Active"));
        setBrands(brs.filter(b => b.status === "Active"));

        if (isEditMode) {
          const prod = await productService.getProduct(productId);
          setProductData({
            name: prod.name,
            brand: prod.brand || "",
            categoryId: prod.categoryId || "",
            description: prod.description || "",
            status: prod.status || "Active"
          });
          setVariants(prod.variants || []);
        }
      } catch (err) {
        console.error("Failed to load initial form data:", err);
        showToast("Failed to load page data.", "error");
      } finally {
        setPageLoading(false);
      }
    };

    loadInitialData();
  }, [productId, isEditMode]);

  // Alert on browser close/refresh for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [unsavedChanges]);

  const handleProductChange = (newData) => {
    setProductData(newData);
    setUnsavedChanges(true);
  };

  const handleVariantsChange = (newVariants) => {
    setVariants(newVariants);
    setUnsavedChanges(true);
  };

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  // Field validations
  const validateForm = () => {
    const tempErrors = {};
    const varErrors = {};
    let isValid = true;

    // Validate Product Info
    if (!productData.name.trim()) {
      tempErrors.name = "Product name is required";
      isValid = false;
    }
    if (!productData.categoryId) {
      tempErrors.categoryId = "Category selection is required";
      isValid = false;
    }

    // Validate Variants
    const activeVariants = variants.filter(v => !v.is_deleted);
    if (activeVariants.length === 0) {
      showToast("Require at least one variant before saving.", "error");
      return false;
    }

    activeVariants.forEach((v) => {
      const currentVarErrors = {};
      if (!v.name.trim()) {
        currentVarErrors.name = "Variant option name is required (e.g. Color / Size)";
        isValid = false;
      }
      if (!v.sku.trim()) {
        currentVarErrors.sku = "SKU is required";
        isValid = false;
      }
      if (v.price === "" || parseFloat(v.price) <= 0) {
        currentVarErrors.price = "Price must be greater than 0";
        isValid = false;
      }
      if (v.stock === "" || parseInt(v.stock, 10) < 0) {
        currentVarErrors.stock = "Stock must be 0 or more";
        isValid = false;
      }

      // Check image rules
      const activeImages = (v.images || []).filter(img => !img.is_deleted);
      if (activeImages.length === 0) {
        currentVarErrors.images = "Each variant must have at least one image.";
        isValid = false;
      } else {
        const primaryCount = activeImages.filter(img => img.is_primary).length;
        if (primaryCount === 0) {
          currentVarErrors.images = "Each variant must have at least one Primary Image selected.";
          isValid = false;
        }
      }

      if (Object.keys(currentVarErrors).length > 0) {
        varErrors[v.id] = currentVarErrors;
      }
    });

    setErrors({ ...tempErrors, ...varErrors });
    return isValid;
  };

  const handleSave = (publishStatus) => async () => {
    if (!validateForm()) {
      showToast("Please correct the errors in the form.", "error");
      return;
    }

    setSaveLoading(true);
    setUnsavedChanges(false);

    try {
      let finalProductId = productId;

      // 1. Create or Update Product Details
      const statusStr = publishStatus || productData.status;
      const productPayload = {
        ...productData,
        status: statusStr
      };

      if (isEditMode) {
        await productService.updateProduct(productId, productPayload);
      } else {
        const newProduct = await productService.createProduct(productPayload);
        finalProductId = newProduct.id;
      }

      // Helper function to upload variant images with simulated progress
      const uploadImagesForVariant = async (variantId, imagesList) => {
        for (const img of imagesList) {
          if (img.is_deleted) {
            if (typeof img.id === "number") {
              await productService.deleteProductImage(img.id);
            }
            continue;
          }

          if (img.file) {
            // New upload
            const formData = new FormData();
            formData.append("variant", variantId);
            formData.append("image", img.file);
            formData.append("alt_text", img.alt_text || "");
            formData.append("is_primary", img.is_primary ? "true" : "false");
            formData.append("display_order", img.display_order || 0);

            // Setup mock/real upload progress tracking
            const updateProgress = (prog) => {
              setVariants(prev => prev.map(v => ({
                ...v,
                images: v.images.map(image => image.id === img.id ? { ...image, progress: prog } : image)
              })));
            };

            // Simulate progress up to 90% first
            let simProgress = 10;
            updateProgress(simProgress);
            const interval = setInterval(() => {
              if (simProgress < 90) {
                simProgress += 20;
                updateProgress(simProgress);
              }
            }, 100);

            await productService.createProductImage(formData);
            
            clearInterval(interval);
            updateProgress(100);
          } else if (typeof img.id === "number") {
            // Existing image, check if display_order or is_primary changed
            const formData = new FormData();
            formData.append("variant", variantId);
            formData.append("alt_text", img.alt_text || "");
            formData.append("is_primary", img.is_primary ? "true" : "false");
            formData.append("display_order", img.display_order || 0);

            await productService.updateProductImage(img.id, formData);
          }
        }
      };

      // 2. Loop through variants
      for (const v of variants) {
        if (v.is_deleted) {
          if (typeof v.id === "number") {
            await productService.deleteProductVariant(v.id);
          }
          continue;
        }

        const isNewVariant = typeof v.id === "string" && v.id.startsWith("temp_var");
        const variantPayload = {
          product: finalProductId,
          name: v.name,
          sku: v.sku,
          price: v.price,
          stock: v.stock,
          status: v.status
        };

        if (isNewVariant) {
          const createdVar = await productService.createProductVariant(variantPayload);
          await uploadImagesForVariant(createdVar.id, v.images || []);
        } else {
          await productService.updateProductVariant(v.id, variantPayload);
          await uploadImagesForVariant(v.id, v.images || []);
        }
      }

      showToast("Product saved successfully!", "success");
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/admin/products");
        }
      }, 1000);

    } catch (err) {
      console.error("Save product failed:", err);
      showToast("Failed to save product. Please check your network and data values.", "error");
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    if (unsavedChanges && !window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
      return;
    }
    if (onCancel) {
      onCancel();
    } else {
      navigate("/admin/products");
    }
  };

  if (pageLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#111827", fontFamily: "'Inter', sans-serif" }}>
          {isEditMode ? "Edit Product" : "Add New Product"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontFamily: "'Inter', sans-serif" }}>
          Manage metadata details, multiple variant options, and upload variant-specific display images.
        </Typography>
      </Box>

      {/* Product Metadata Info Section */}
      <ProductInformation
        productData={productData}
        onChange={handleProductChange}
        categories={categories}
        brands={brands}
        errors={errors}
        loading={saveLoading}
      />

      {/* Variants List Section */}
      <VariantList
        variants={variants}
        onChange={handleVariantsChange}
        errors={errors}
        loading={saveLoading}
      />

      {/* Stats Summary Section */}
      <ProductSummary
        productData={productData}
        variants={variants}
      />

      {/* Footer Buttons Section */}
      <ProductFooter
        onSaveDraft={handleSave("Inactive")}
        onPublish={handleSave("Active")}
        onCancel={handleCancel}
        loading={saveLoading}
      />

      {/* Success/Error Toasts */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={toast.severity} sx={{ borderRadius: "8px" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProductFormContainer;
