import { Typography, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useState } from "react";

function PaymentMethod() {
  const [payment, setPayment] = useState("cod");

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>

      <RadioGroup value={payment} onChange={(e) => setPayment(e.target.value)}>
        <FormControlLabel
          value="cod"
          control={<Radio />}
          label="Cash On Delivery"
        />

        <FormControlLabel
          value="razorpay"
          control={<Radio />}
          label="Razorpay"
          disabled
        />
      </RadioGroup>
    </>
  );
}

export default PaymentMethod;
