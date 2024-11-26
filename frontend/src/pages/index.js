import { useEffect, useState } from "react";
import { Button, Card, CardContent, Grid, Typography, Snackbar } from "@mui/material";
import { makeStyles } from "@mui/styles";
import io from "socket.io-client";
import api from "@/utils/api";
import { useCart } from "@/context/CartContext";

const socket = io("http://localhost:5000");

const useStyles = makeStyles((theme) => ({
  card: {
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: theme.shadows[5],
    },
  },
  price: {
    fontWeight: "bold",
    color: theme.palette.primary.main,
  },
  stock: {
    marginTop: theme.spacing(1),
    color: theme.palette.success.main,
  },
  button: {
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  loadingText: {
    textAlign: "center",
    width: "100%",
    marginTop: theme.spacing(4),
  },
}));

const Home = () => {
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch products on mount
    fetchProducts();

    // Listen for stock updates from the server
    socket.on("stockUpdated", (updatedProduct) => {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === updatedProduct._id ? { ...product, stock: updatedProduct.stock } : product
        )
      );
    });

    // Cleanup the socket listener on component unmount
    return () => {
      socket.off("stockUpdated");
    };
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setSnackbarMessage(`${product.name} added to cart!`);
    setSnackbarOpen(true);
  };

  return (
    <>
      <Grid container spacing={2}>
        {loading ? (
          <Typography variant="h6" className={classes.loadingText}>
            Loading...
          </Typography>
        ) : (
          products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {product.description}
                  </Typography>
                  <Typography variant="h6" className={classes.price}>
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" className={classes.stock}>
                    Stock: {product.stock}
                  </Typography>
                  <Button
                    variant="contained"
                    className={classes.button}
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default Home;
