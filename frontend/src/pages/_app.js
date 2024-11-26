// pages/_app.js
import "../styles/globals.css"; // Import global CSS
import Layout from "../components/Layout";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CartProvider } from "@/context/CartContext";
// import { CartProvider } from "../context/CartContext"; // Import your CartContext
//
const theme = createTheme(); // Create a theme

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CartProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CartProvider>
    </ThemeProvider>
  );
}
