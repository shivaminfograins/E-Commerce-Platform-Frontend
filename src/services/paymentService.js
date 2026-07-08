import api from "../api/axios";

const paymentService = {
  // Verify Razorpay payment signature
  verifyPayment: async (verificationData) => {
    // verificationData: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
    return api.post("/payments/verify/", verificationData);
  },
};

export default paymentService;
