import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

function DeleteDialog({ open, onClose, onConfirm, itemName, loading }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          borderRadius: "16px"
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: "#ef4444" }}>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "#475569" }}>
          Are you sure you want to delete the product <strong>"{itemName}"</strong>? This will remove all associated variants and cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={loading} color="inherit" variant="outlined">
          Cancel
        </Button>
        <Button onClick={onConfirm} disabled={loading} color="error" variant="contained">
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
