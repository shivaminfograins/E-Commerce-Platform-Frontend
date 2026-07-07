import Button from "@mui/material/Button";

function PlaceOrderButton() {
  const handlePlaceOrder = () => {
    console.log("Place Order");
  };

  return (
    <Button
      variant="contained"
      fullWidth
      size="large"
      onClick={handlePlaceOrder}
    >
      Place Order
    </Button>
  );
}

export default PlaceOrderButton;
