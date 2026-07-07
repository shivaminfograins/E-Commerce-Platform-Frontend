import { Typography, Stack } from "@mui/material";

function OrderSummary({ subtotal, shipping, total }) {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>

      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography>Subtotal</Typography>

          <Typography>₹{subtotal}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography>Shipping</Typography>

          <Typography>{shipping === 0 ? "FREE" : `₹${shipping}`}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography fontWeight={700}>Total</Typography>

          <Typography fontWeight={700}>₹{total}</Typography>
        </Stack>
      </Stack>
    </>
  );
}

export default OrderSummary;
