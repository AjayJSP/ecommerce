import React, { useState, useEffect } from "react";
import { Button, Typography, Card, CardContent, Grid, TextField, Snackbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useCart } from "../context/CartContext";
import io from "socket.io-client";
import api from "@/utils/api"; // Adjust the path as needed

const socket = io("http://localhost:5000");

const StyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: theme.shadows[5],
  },
  padding: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const EmptyCartMessage = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  marginTop: theme.spacing(4),
  color: theme.palette.text.secondary,
  fontWeight: "bold",
  fontSize: "1.5rem",
}));

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, setCart } = useCart();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    socket.on("stockUpdated", (updatedProduct) => {
      updateQuantity(updatedProduct._id, updatedProduct.stock);
    });

    return () => {
      socket.off("stockUpdated");
    };
  }, [updateQuantity]);

  const handleRemove = (_id) => {
    removeFromCart(_id);
    setSnackbarMessage("Item removed from cart.");
    setSnackbarOpen(true);
  };

  const handleCheckout = async () => {
    try {
      await api.post("/cart/checkout", cart);
      setCart([]);
      setSnackbarMessage("Checkout successful!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Checkout failed:", error);

      const errorMessage = error.response?.data?.message || "Checkout failed. Please try again.";

      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      <Grid container spacing={2}>
        {cart.length === 0 ? (
          <Grid item xs={12}>
            <EmptyCartMessage>Your cart is empty.</EmptyCartMessage>
          </Grid>
        ) : (
          cart.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.name}
                  </Typography>
                  <Typography variant="body1">{`Price: $${item.price.toFixed(2)}`}</Typography>
                  <TextField
                    type="number"
                    label="Quantity"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value, 10))}
                    fullWidth
                    inputProps={{ min: 1 }}
                    variant="outlined"
                    margin="normal"
                  />
                  <StyledButton onClick={() => handleRemove(item._id)} fullWidth>
                    Remove
                  </StyledButton>
                </CardContent>
              </StyledCard>
            </Grid>
          ))
        )}
      </Grid>
      {cart.length > 0 && (
        <StyledButton
          onClick={handleCheckout}
          fullWidth
          style={{ marginTop: "20px", padding: "10px" }}
        >
          Checkout
        </StyledButton>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </div>
  );
};

export default Cart;
