// pages/_app.js
import "../styles/globals.css";
import Layout from "../components/Layout";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CartProvider } from "@/context/CartContext";

const theme = createTheme();

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
