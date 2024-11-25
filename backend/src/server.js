const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const createCartRouter = require("./routes/cartRoutes");
const connectDB = require("./utils/db");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

connectDB();

app.use(cors({ origin: "http://localhost:3000", methods: ["GET", "POST"] }));
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/cart", createCartRouter(io));

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => console.log("Client disconnected"));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
