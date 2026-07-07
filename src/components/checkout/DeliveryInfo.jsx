import { Typography, Stack } from "@mui/material";

function DeliveryInfo() {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Delivery
      </Typography>

      <Stack spacing={1}>
        <Typography>Estimated Delivery</Typography>

        <Typography color="success.main">Tomorrow</Typography>

        <Typography>FREE Delivery</Typography>
      </Stack>
    </>
  );
}

export default DeliveryInfo;