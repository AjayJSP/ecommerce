// components/Layout.js
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <main style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>{children}</main>
    </div>
  );
}
