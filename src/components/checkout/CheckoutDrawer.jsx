import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import AddressList from "./AddressList";
import DeliveryInfo from "./DeliveryInfo";
import PaymentMethod from "./PaymentMethod";
import OrderSummary from "./OrderSummary";
import PlaceOrderButton from "./PlaceOrderButton";

const CheckoutDrawer = ({ open, onClose }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: {
            xs: "100%",
            sm: 430,
          },
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box p={3}>
          <Typography variant="h5" fontWeight={700}>
            Checkout
          </Typography>
        </Box>

        <Divider />

        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: 3,
          }}
        >
          <AddressList />

          <Divider sx={{ my: 3 }} />

          <DeliveryInfo />

          <Divider sx={{ my: 3 }} />

          <PaymentMethod />

          <Divider sx={{ my: 3 }} />

          <OrderSummary />
        </Box>

        <Divider />

        <Box p={3}>
          <PlaceOrderButton />
        </Box>
      </Box>
    </Drawer>
  );
};

export default CheckoutDrawer;
