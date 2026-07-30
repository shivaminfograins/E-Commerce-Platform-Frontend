import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import WriteReviewForm from "./WriteReviewForm";

function ReviewSection({ productId, user, autoOpenReview }) {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [reportReviewId, setReportReviewId] = useState(null);
  const [reportReason, setReportReason] = useState("spam");
  const [reportComment, setReportComment] = useState("");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${productId}/reviews/?page=${page}`);
      if (response.data.success) {
        setReviews(response.data.results);
        setSummary(response.data.summary);
        setTotalPages(response.data.total_pages || 1);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, page]);

  useEffect(() => {
    if (autoOpenReview && summary) {
      if (summary.user_can_review) {
        setShowWriteForm(true);
      } else {
        alert("You are not eligible to review this product. Only verified purchasers of delivered orders can write a review.");
      }
    }
  }, [autoOpenReview, summary]);

  const handleHelpfulToggle = async (reviewId) => {
    try {
      const response = await api.post(`/reviews/${reviewId}/helpful/`);
      if (response.data.success) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId
              ? {
                  ...r,
                  helpful_count: response.data.helpful_count,
                  has_voted_helpful: response.data.has_voted_helpful,
                }
              : r
          )
        );
      }
    } catch (err) {
      console.error("Helpful toggle failed:", err);
      alert("Authentication required to vote.");
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/reviews/${reportReviewId}/report/`, {
        reason: reportReason,
        comment: reportComment,
      });
      if (response.data.success) {
        alert("Thank you. The review has been reported for moderation.");
        setReportReviewId(null);
        setReportComment("");
      }
    } catch (err) {
      console.error("Report failed:", err);
    }
  };

  const renderStars = (ratingVal) => {
    return (
      <div style={{ display: "flex", gap: "2px" }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <span key={s} style={{ fontSize: "16px", color: s <= ratingVal ? "#fbbf24" : "#cbd5e1" }}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: "40px 0", borderTop: "1px solid #e2e8f0" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "24px" }}>
        Customer Reviews
      </h2>

      {/* Review Summary Header Card */}
      {summary && (
        <div
          style={{
            display: "flex",
            gap: "40px",
            flexWrap: "wrap",
            background: "#ffffff",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            marginBottom: "32px",
            alignItems: "center",
          }}
        >
          {/* Average Rating Block */}
          <div style={{ minWidth: "150px", textAlign: "center" }}>
            <h3 style={{ fontSize: "48px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
              {summary.average_rating.toFixed(1)}
            </h3>
            <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
              {renderStars(Math.round(summary.average_rating))}
            </div>
            <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
              Based on {summary.total_reviews} reviews
            </p>
          </div>

          {/* Star Distribution bars */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", minWidth: "250px" }}>
            {["5", "4", "3", "2", "1"].map((star) => {
              const count = summary.rating_distribution[star] || 0;
              const percent = summary.total_reviews > 0 ? (count / summary.total_reviews) * 100 : 0;
              return (
                <div key={star} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px" }}>
                  <span style={{ fontWeight: "600", color: "#475569", width: "24px" }}>{star}★</span>
                  <div style={{ flex: 1, height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${percent}%`, height: "100%", background: "#fbbf24", borderRadius: "4px" }} />
                  </div>
                  <span style={{ color: "#64748b", width: "40px", textAlign: "right" }}>
                    {percent.toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Conditional Write Review Button */}
          {summary.user_can_review && (
            <div style={{ minWidth: "180px", textAlign: "center" }}>
              <button
                onClick={() => setShowWriteForm(true)}
                style={{
                  background: "#4f46e5",
                  color: "#ffffff",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "100px",
                  fontSize: "14px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#4338ca")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#4f46e5")}
              >
                {summary.user_existing_review ? "Edit Review" : "Write a Review"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Review Modal Form */}
      {showWriteForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            zIndex: 1500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            backdropFilter: "blur(4px)",
          }}
        >
          <WriteReviewForm
            productId={productId}
            existingReview={summary?.user_existing_review}
            onClose={() => setShowWriteForm(false)}
            onReviewSuccess={() => {
              fetchReviews();
              setShowWriteForm(false);
            }}
          />
        </div>
      )}

      {/* List of Reviews */}
      {loading ? (
        <p style={{ textAlign: "center", color: "#64748b" }}>Loading reviews...</p>
      ) : reviews.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              {/* Reviewer line */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontWeight: "700", color: "#0f172a", fontSize: "14px" }}>
                      {review.username}
                    </span>
                    {review.is_verified_purchase && (
                      <span
                        style={{
                          background: "#d1fae5",
                          color: "#065f46",
                          fontSize: "11px",
                          fontWeight: "700",
                          padding: "2px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  {review.variant_name && (
                    <span style={{ fontSize: "12px", color: "#64748b", display: "block", marginTop: "2px" }}>
                      Variant: {review.variant_name}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>

              {/* Stars & Title */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                {renderStars(review.rating)}
                <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>
                  {review.title}
                </h4>
              </div>

              {/* Comment text */}
              <p style={{ margin: "0 0 16px 0", fontSize: "14px", color: "#475569", lineHeight: "1.5" }}>
                {review.comment}
              </p>

              {/* Uploaded Photos */}
              {review.images && review.images.length > 0 && (
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                  {review.images.map((img) => (
                    <img
                      key={img.id}
                      src={img.image}
                      alt="review"
                      onClick={() => setSelectedImage(img.image)}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        cursor: "pointer",
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.8)}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
                    />
                  ))}
                </div>
              )}

              {/* Actions Footer */}
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <button
                  onClick={() => handleHelpfulToggle(review.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: review.has_voted_helpful ? "#4f46e5" : "#64748b",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  👍 Helpful ({review.helpful_count})
                </button>
                
                {user && user.username !== review.username && (
                  <button
                    onClick={() => setReportReviewId(review.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#94a3b8",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#dc2626")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                  >
                    Report
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Simple pagination footer */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "20px" }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                style={{ padding: "8px 16px", background: "#f1f5f9", border: "none", borderRadius: "8px", cursor: "pointer" }}
              >
                Previous
              </button>
              <span style={{ alignSelf: "center", fontWeight: "600", fontSize: "14px" }}>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                style={{ padding: "8px 16px", background: "#f1f5f9", border: "none", borderRadius: "8px", cursor: "pointer" }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "40px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <p style={{ color: "#64748b", margin: 0 }}>No reviews yet. Be the first to share your thoughts!</p>
        </div>
      )}

      {/* Image Preview Overlay Modal */}
      {selectedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.9)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="preview full" style={{ maxWidth: "90%", maxHeight: "90vh", borderRadius: "8px" }} />
        </div>
      )}

      {/* Report dialog popup */}
      {reportReviewId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            zIndex: 1600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setReportReviewId(null)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              maxWidth: "400px",
              width: "100%",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
              Report Review
            </h3>
            <form onSubmit={handleReportSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                  Reason for reporting
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                  }}
                >
                  <option value="spam">Spam</option>
                  <option value="fake">Fake Review</option>
                  <option value="abusive">Abusive Content</option>
                  <option value="off_topic">Off Topic</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "6px" }}>
                  Additional Comment
                </label>
                <textarea
                  rows="3"
                  value={reportComment}
                  onChange={(e) => setReportComment(e.target.value)}
                  placeholder="Provide more context..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                    resize: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setReportReviewId(null)}
                  style={{
                    background: "#ffffff",
                    color: "#475569",
                    border: "1px solid #cbd5e1",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: "#dc2626",
                    color: "#ffffff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewSection;
