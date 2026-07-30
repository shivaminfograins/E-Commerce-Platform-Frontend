import React, { useState, useEffect } from "react";
import api from "../../api/axios";

function WriteReviewForm({ productId, existingReview, onReviewSuccess, onClose }) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setTitle(existingReview.title);
      setComment(existingReview.comment);
    }
  }, [existingReview]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Append to existing selected files
    setImages((prev) => [...prev, ...files]);

    // Create file reader previews
    const previews = files.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previews).then((results) => {
      setImagePreviews((prev) => [...prev, ...results]);
    });
  };

  const removeSelectedImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) {
      setError("Please fill in both title and comment.");
      return;
    }

    setSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("product", productId);
    formData.append("rating", rating);
    formData.append("title", title);
    formData.append("comment", comment);
    
    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      let response;
      if (existingReview) {
        // PUT edit
        response = await api.put(`/reviews/${existingReview.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        // POST create
        response = await api.post("/reviews/", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      if (response.data.success) {
        alert(response.data.message || "Review submitted successfully.");
        if (onReviewSuccess) {
          onReviewSuccess();
        }
        if (onClose) onClose();
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
      const errMsg = err?.response?.data?.errors?.non_field_errors?.[0] || 
                     err?.response?.data?.message || 
                     "Failed to submit review. Check verified purchase requirements.";
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "24px",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        maxWidth: "600px",
        width: "100%",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>
        {existingReview ? "Edit Your Review" : "Write a Customer Review"}
      </h3>

      {error && (
        <div style={{ color: "#b91c1c", background: "#fee2e2", padding: "12px", borderRadius: "8px", fontSize: "14px", marginBottom: "16px", fontWeight: "600" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Rating selection */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "8px" }}>
            Overall Rating
          </label>
          <div style={{ display: "flex", gap: "6px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                style={{
                  fontSize: "28px",
                  cursor: "pointer",
                  color: star <= rating ? "#fbbf24" : "#cbd5e1",
                  transition: "transform 0.1s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
            Review Title
          </label>
          <input
            type="text"
            placeholder="Sum up your review in a headline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        {/* Comment */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
            Detailed Review
          </label>
          <textarea
            rows="4"
            placeholder="What did you like or dislike about this product?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              fontSize: "14px",
              outline: "none",
              resize: "vertical",
            }}
          />
        </div>

        {/* Image uploads */}
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "8px" }}>
            Add Photos (Optional)
          </label>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            {/* Custom file input box */}
            <label
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "8px",
                border: "2px dashed #cbd5e1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                background: "#f8fafc",
                fontSize: "20px",
                color: "#64748b",
              }}
            >
              +
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </label>

            {/* Selected Image previews */}
            {imagePreviews.map((preview, idx) => (
              <div
                key={idx}
                style={{
                  position: "relative",
                  width: "80px",
                  height: "80px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  overflow: "hidden",
                }}
              >
                <img src={preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button
                  type="button"
                  onClick={() => removeSelectedImage(idx)}
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    background: "rgba(15, 23, 42, 0.75)",
                    color: "#ffffff",
                    border: "none",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    fontSize: "11px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "#ffffff",
                color: "#475569",
                border: "1px solid #cbd5e1",
                padding: "10px 18px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            style={{
              background: "#4f46e5",
              color: "#ffffff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default WriteReviewForm;
