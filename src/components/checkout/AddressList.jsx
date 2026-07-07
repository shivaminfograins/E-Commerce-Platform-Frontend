import {
  Card,
  CardContent,
  Typography,
  Radio,
  Stack,
  Button,
} from "@mui/material";
import { useState } from "react";

function AddressList() {
  const [selected, setSelected] = useState(1);

  const addresses = [
    {
      id: 1,
      type: "Home",
      name: "Shivam Prajapati",
      address: "Ahmedabad, Gujarat - 380001",
      mobile: "9876543210",
    },
  ];

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Delivery Address
      </Typography>

      {addresses.map((item) => (
        <Card key={item.id} sx={{ mb: 2 }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between">
              <div>
                <Typography fontWeight={600}>{item.type}</Typography>

                <Typography>{item.name}</Typography>

                <Typography variant="body2">{item.address}</Typography>

                <Typography variant="body2">{item.mobile}</Typography>
              </div>

              <Radio
                checked={selected === item.id}
                onChange={() => setSelected(item.id)}
              />
            </Stack>
          </CardContent>
        </Card>
      ))}

      <Button variant="outlined" fullWidth>
        + Add New Address
      </Button>
    </>
  );
}

export default AddressList;
