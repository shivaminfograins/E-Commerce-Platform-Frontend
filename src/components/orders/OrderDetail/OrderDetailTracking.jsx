import React from "react";

function OrderDetailTracking({ order }) {
  if (!order) return null;

  const baseDate = new Date(order.created_at);

  const formatDateOffset = (days) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const getSteps = () => {
    const status = order.status;

    if (status === "cancelled" || status === "refunded") {
      return [
        { label: "Ordered", date: formatDateOffset(0), completed: true },
        {
          label: status === "cancelled" ? "Cancelled" : "Refunded",
          date: new Date(order.updated_at || order.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          completed: true,
          error: true,
        },
      ];
    }

    const allSteps = [
      { key: "pending", label: "Ordered", date: formatDateOffset(0), completed: true },
      { key: "confirmed", label: "Confirmed", date: formatDateOffset(1), completed: false },
      { key: "packed", label: "Packed", date: formatDateOffset(1.5), completed: false },
      { key: "shipped", label: "Shipped", date: formatDateOffset(2), completed: false },
      { key: "delivered", label: "Delivered", date: formatDateOffset(4), completed: false },
    ];

    // Status indices:
    // pending -> Confirmed (no), Packed (no), etc.
    const statusOrder = ["pending", "confirmed", "packed", "shipped", "delivered"];
    const currentIdx = statusOrder.indexOf(status);

    return allSteps.map((step, idx) => {
      const stepIdx = statusOrder.indexOf(step.key);
      return {
        ...step,
        completed: stepIdx <= currentIdx,
        isCurrent: stepIdx === currentIdx,
      };
    });
  };

  const steps = getSteps();
  const completedCount = steps.filter((s) => s.completed && !s.error).length;
  const totalSteps = steps.length;
  const progressPercent =
    order.status === "cancelled" || order.status === "refunded"
      ? "100%"
      : `${((completedCount - 1) / (totalSteps - 1)) * 100}%`;

  const isCancelled = order.status === "cancelled" || order.status === "refunded";

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        padding: "32px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ margin: "0 0 24px 0", fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>
        Tracking details
      </h3>

      {/* Progress Timeline container */}
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", width: "100%", padding: "0 10px" }}>
        {/* Connector Line behind steps */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "40px",
            right: "40px",
            height: "4px",
            background: "#e2e8f0",
            zIndex: 1,
            borderRadius: "2px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: progressPercent,
              background: isCancelled ? "#ef4444" : "#4f46e5",
              borderRadius: "2px",
              transition: "width 0.4s ease",
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => (
          <div
            key={index}
            style={{
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1,
              textAlign: "center",
              position: "relative",
            }}
          >
            {/* Step Circle */}
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: step.completed
                  ? step.error
                    ? "#fca5a5"
                    : "#4f46e5"
                  : "#ffffff",
                border: `3px solid ${
                  step.completed
                    ? step.error
                      ? "#ef4444"
                      : "#4f46e5"
                    : "#cbd5e1"
                }`,
                color: step.completed ? "#ffffff" : "#64748b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "700",
                fontSize: "12px",
                boxShadow: step.isCurrent ? "0 0 0 4px rgba(79, 70, 229, 0.2)" : "0 1px 3px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
              }}
            >
              {step.completed ? (
                step.error ? (
                  "✕"
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )
              ) : (
                index + 1
              )}
            </div>

            {/* Labels */}
            <span
              style={{
                marginTop: "12px",
                fontSize: "14px",
                fontWeight: step.completed ? "700" : "500",
                color: step.completed
                  ? step.error
                    ? "#dc2626"
                    : "#0f172a"
                  : "#64748b",
              }}
            >
              {step.label}
            </span>
            <span
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                marginTop: "4px",
                maxWidth: "90px",
                wordBreak: "break-word",
              }}
            >
              {step.completed ? step.date : "Estimated"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderDetailTracking;
