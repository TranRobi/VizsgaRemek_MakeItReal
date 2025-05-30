import React, { useContext, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { ProductsContext } from "../../context/ProductsContext";

const OrderHistory = () => {
  //getting the informations from the Contexts
  const { orders, getHistory } = useContext(ProductsContext);
  // This function fetches the order history from the server and updates the state with the fetched data.
  useEffect(() => {
    getHistory();
  }, []);

  return (
    <div className="w-5/6 mx-auto m-4">
      <Card
        sx={{
          backgroundColor: "transparent",
          color: "#fff",
          border: "1px solid black",
          borderRadius: 3,
          boxShadow: "none", // Optional: removes shadow for a cleaner look
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            sx={{ color: "white", marginBottom: 2, fontSize: "40px" }}
          >
            Order History
          </Typography>
          <Divider sx={{ backgroundColor: "black", marginBottom: 2 }} />
          <div className="h-[500px] overflow-y-scroll">
            <List>
              {orders.map((order, index) => (
                <Box
                  key={index}
                  sx={{ borderBottom: "1px solid black", paddingY: 1 }}
                >
                  <ListItem disablePadding>
                    <ListItemText
                      secondary={
                        <>
                          <Typography
                            component="span"
                            sx={{
                              display: "block",
                              color: "red",
                              fontSize: "25px",
                            }}
                          >
                            Name: {order.name}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{
                              display: "block",
                              color: "#fff",
                            }}
                          >
                            Quantity: {order.quantity}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ display: "block", color: "#fff" }}
                          >
                            Color: {order.colour}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ display: "block", color: "#fff" }}
                          >
                            Material: {order.material}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ display: "block", color: "gray" }}
                          >
                            State: {order.state}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{ display: "block", color: "#fff" }}
                          >
                            Total: {order.total}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderHistory;
