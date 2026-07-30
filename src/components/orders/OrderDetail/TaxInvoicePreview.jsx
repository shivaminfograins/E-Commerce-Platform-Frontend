import React from "react";

function TaxInvoicePreview({ order }) {
  if (!order) return null;

  const orderDate = new Date(order.created_at);
  const formattedDate = orderDate.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const invoiceNum = `INV-${orderDate.getFullYear()}${(orderDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${orderDate.getDate().toString().padStart(2, "0")}-${order.id.toString().padStart(4, "0")}`;

  const isMp = order.snapshot_state?.strip?.().toLowerCase() === "madhya pradesh" || 
               order.snapshot_state?.toLowerCase() === "mp" ||
               order.snapshot_state?.toLowerCase() === "madhya pradesh";

  const taxType = isMp ? "CGST/SGST" : "IGST";
  const taxRate = 18; // Default 18% GST

  // CGST/SGST/IGST breakdown calculation
  const cgstVal = isMp ? Number(order.tax) / 2 : 0;
  const sgstVal = isMp ? Number(order.tax) / 2 : 0;
  const igstVal = !isMp ? Number(order.tax) : 0;

  return (
    <div
      className="tax-invoice-printable-container"
      style={{
        background: "#ffffff",
        color: "#1e293b",
        fontFamily: "'Inter', sans-serif",
        padding: "40px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        maxWidth: "800px",
        margin: "0 auto",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
      }}
    >
      {/* Print styles inserted directly here to isolate printable invoice */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .tax-invoice-printable-container, .tax-invoice-printable-container * {
            visibility: visible !important;
          }
          .tax-invoice-printable-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .order-detail-header-print-hidden, .order-detail-print-area {
            display: none !important;
          }
        }
      `}</style>

      {/* Invoice Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #334155", paddingBottom: "16px", marginBottom: "20px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "800", letterSpacing: "-0.5px", color: "#0f172a" }}>TAX INVOICE</h1>
          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>Computer Generated Copy</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>ShopEase</h3>
          <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "#64748b" }}>shopease.com</p>
        </div>
      </div>

      {/* Company & Invoice Meta details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px", fontSize: "12px", lineHeight: "1.6" }}>
        {/* Left column: Invoice metadata */}
        <div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ padding: "3px 0", color: "#64748b", fontWeight: "600", width: "120px" }}>Invoice Number:</td>
                <td style={{ padding: "3px 0", fontWeight: "700", color: "#0f172a" }}>{invoiceNum}</td>
              </tr>
              <tr>
                <td style={{ padding: "3px 0", color: "#64748b", fontWeight: "600" }}>Invoice Date:</td>
                <td style={{ padding: "3px 0", color: "#334155" }}>{formattedDate}</td>
              </tr>
              <tr>
                <td style={{ padding: "3px 0", color: "#64748b", fontWeight: "600" }}>Order Number:</td>
                <td style={{ padding: "3px 0", color: "#334155" }}>{order.order_number}</td>
              </tr>
              <tr>
                <td style={{ padding: "3px 0", color: "#64748b", fontWeight: "600" }}>Order Date:</td>
                <td style={{ padding: "3px 0", color: "#334155" }}>{formattedDate}</td>
              </tr>
              <tr>
                <td style={{ padding: "3px 0", color: "#64748b", fontWeight: "600" }}>Payment Method:</td>
                <td style={{ padding: "3px 0", color: "#334155", textTransform: "uppercase" }}>{order.payment_method_display}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right column: Sold by (Company details) */}
        <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
          <h4 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>Sold By:</h4>
          <p style={{ margin: 0, color: "#475569" }}>
            <strong>ShopEase Retail Private Limited</strong><br />
            123 Tech Park, Phase II, Scheme 54,<br />
            Indore, Madhya Pradesh - 452001<br />
            <strong>GSTIN:</strong> 23AAACS1234A1Z1<br />
            <strong>PAN:</strong> AAACS1234A<br />
            <strong>CIN:</strong> U72200MP2026PTC123456
          </p>
        </div>
      </div>

      <hr style={{ border: 0, borderTop: "1px solid #e2e8f0", margin: "0 0 20px 0" }} />

      {/* Addresses section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px", fontSize: "12px", lineHeight: "1.5" }}>
        <div>
          <h4 style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: "700", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>Billing Address</h4>
          <p style={{ margin: 0, color: "#334155" }}>
            <strong>{order.snapshot_full_name}</strong><br />
            {order.snapshot_address_line_1}<br />
            {order.snapshot_address_line_2 && <>{order.snapshot_address_line_2}<br /></>}
            {order.snapshot_landmark && <>Near: {order.snapshot_landmark}<br /></>}
            {order.snapshot_city}, {order.snapshot_state} - {order.snapshot_postal_code}<br />
            {order.snapshot_country}<br />
            Phone: {order.snapshot_phone}
          </p>
        </div>
        <div>
          <h4 style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: "700", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px" }}>Shipping Address</h4>
          <p style={{ margin: 0, color: "#334155" }}>
            <strong>{order.snapshot_full_name}</strong><br />
            {order.snapshot_address_line_1}<br />
            {order.snapshot_address_line_2 && <>{order.snapshot_address_line_2}<br /></>}
            {order.snapshot_landmark && <>Near: {order.snapshot_landmark}<br /></>}
            {order.snapshot_city}, {order.snapshot_state} - {order.snapshot_postal_code}<br />
            {order.snapshot_country}<br />
            Phone: {order.snapshot_phone}
          </p>
        </div>
      </div>

      {/* Products table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", marginBottom: "20px" }}>
        <thead>
          <tr style={{ background: "#f8fafc", borderTop: "1px solid #cbd5e1", borderBottom: "2px solid #cbd5e1" }}>
            <th style={{ padding: "10px", textAlign: "left", color: "#334155", fontWeight: "700", width: "40px" }}>S.No</th>
            <th style={{ padding: "10px", textAlign: "left", color: "#334155", fontWeight: "700" }}>Description</th>
            <th style={{ padding: "10px", textAlign: "left", color: "#334155", fontWeight: "700", width: "90px" }}>SKU</th>
            <th style={{ padding: "10px", textAlign: "left", color: "#334155", fontWeight: "700", width: "70px" }}>HSN</th>
            <th style={{ padding: "10px", textAlign: "center", color: "#334155", fontWeight: "700", width: "40px" }}>Qty</th>
            <th style={{ padding: "10px", textAlign: "right", color: "#334155", fontWeight: "700", width: "75px" }}>Unit Price</th>
            <th style={{ padding: "10px", textAlign: "right", color: "#334155", fontWeight: "700", width: "75px" }}>Gross Amt</th>
            <th style={{ padding: "10px", textAlign: "right", color: "#334155", fontWeight: "700", width: "75px" }}>Tax</th>
            <th style={{ padding: "10px", textAlign: "right", color: "#334155", fontWeight: "700", width: "75px" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item, idx) => {
            const hsn = "8517 12 00";
            const gross = Number(item.price) * item.quantity;
            
            // Pro-rata discount
            const itemDiscount = order.subtotal > 0 ? (gross / Number(order.subtotal)) * Number(order.discount) : 0;
            const taxable = gross - itemDiscount;
            
            // Pro-rata tax
            const itemTax = order.subtotal > 0 ? (gross / Number(order.subtotal)) * Number(order.tax) : 0;
            const total = taxable + itemTax;

            return (
              <tr key={item.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "10px", color: "#64748b" }}>{idx + 1}</td>
                <td style={{ padding: "10px", fontWeight: "600", color: "#0f172a" }}>
                  {item.product_name}
                  {item.variant_name && <div style={{ fontWeight: "400", fontSize: "10px", color: "#64748b", marginTop: "2px" }}>{item.variant_name}</div>}
                </td>
                <td style={{ padding: "10px", color: "#475569", fontFamily: "monospace" }}>{item.sku || "N/A"}</td>
                <td style={{ padding: "10px", color: "#475569" }}>{hsn}</td>
                <td style={{ padding: "10px", textAlign: "center", color: "#0f172a" }}>{item.quantity}</td>
                <td style={{ padding: "10px", textAlign: "right", color: "#475569" }}>₹{Number(item.price).toFixed(2)}</td>
                <td style={{ padding: "10px", textAlign: "right", color: "#475569" }}>₹{gross.toFixed(2)}</td>
                <td style={{ padding: "10px", textAlign: "right", color: "#64748b" }}>
                  ₹{itemTax.toFixed(2)}<br />
                  <span style={{ fontSize: "9px" }}>({taxRate}% {taxType})</span>
                </td>
                <td style={{ padding: "10px", textAlign: "right", fontWeight: "600", color: "#0f172a" }}>₹{total.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Summary cost calculations aligned right */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "30px" }}>
        <table style={{ width: "280px", borderCollapse: "collapse", fontSize: "11px" }}>
          <tbody>
            <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: "6px 0", color: "#64748b" }}>Subtotal:</td>
              <td style={{ padding: "6px 0", textAlign: "right", color: "#334155" }}>₹{Number(order.subtotal).toFixed(2)}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: "6px 0", color: "#64748b" }}>Shipping Charges:</td>
              <td style={{ padding: "6px 0", textAlign: "right", color: "#334155" }}>₹{Number(order.shipping_charge).toFixed(2)}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: "6px 0", color: "#64748b" }}>Discount:</td>
              <td style={{ padding: "6px 0", textAlign: "right", color: "#ef4444" }}>-₹{Number(order.discount).toFixed(2)}</td>
            </tr>
            {isMp ? (
              <>
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "6px 0", color: "#64748b" }}>CGST (9%):</td>
                  <td style={{ padding: "6px 0", textAlign: "right", color: "#334155" }}>₹{cgstVal.toFixed(2)}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "6px 0", color: "#64748b" }}>SGST (9%):</td>
                  <td style={{ padding: "6px 0", textAlign: "right", color: "#334155" }}>₹{sgstVal.toFixed(2)}</td>
                </tr>
              </>
            ) : (
              <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "6px 0", color: "#64748b" }}>IGST (18%):</td>
                <td style={{ padding: "6px 0", textAlign: "right", color: "#334155" }}>₹{igstVal.toFixed(2)}</td>
              </tr>
            )}
            <tr style={{ borderTop: "2px solid #cbd5e1", fontSize: "13px" }}>
              <td style={{ padding: "10px 0", fontWeight: "800", color: "#0f172a" }}>Grand Total:</td>
              <td style={{ padding: "10px 0", textAlign: "right", fontWeight: "800", color: "#0f172a" }}>₹{Number(order.total_amount).toFixed(2)}</td>
            </tr>
            <tr style={{ background: "#f8fafc", fontWeight: "700" }}>
              <td style={{ padding: "8px 6px", color: "#0f172a" }}>Amount Paid:</td>
              <td style={{ padding: "8px 6px", textAlign: "right", color: "#16a34a" }}>₹{Number(order.total_amount).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Declaration & Signature Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "24px", background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "10px", lineHeight: "1.5" }}>
        <div style={{ flex: 1 }}>
          <strong style={{ color: "#334155" }}>Declaration:</strong><br />
          1. We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.<br />
          2. This is a computer-generated tax invoice and does not require a physical signature.
        </div>
        <div style={{ width: "180px", textAlign: "right" }}>
          <strong style={{ color: "#334155" }}>For ShopEase Retail Private Limited</strong>
          <div style={{ height: "40px" }} />
          <div style={{ borderTop: "1px solid #cbd5e1", paddingTop: "4px", fontSize: "10px", color: "#64748b" }}>Authorized Signatory</div>
        </div>
      </div>
    </div>
  );
}

export default TaxInvoicePreview;
