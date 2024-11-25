const request = require("supertest");
const app = require("../server"); // Adjust the path as necessary
const http = require("http");
const socketIo = require("socket.io");

let server;
let io;

beforeAll((done) => {
  // Create a server instance
  server = http.createServer(app);
  io = socketIo(server);

  // Attach Socket.IO listeners
  io.on("connection", (socket) => {
    console.log("New client connected");

    // Example listener
    socket.on("updateStock", (product) => {
      console.log("Stock update received:", product);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  server.listen(5001, () => {
    done();
  });
}, 50000);

afterAll((done) => {
  // Clean up the server and socket.io
  io.close(() => {
    console.log("Socket.IO server closed");
  });
  server.close(done);
});

describe("GET /api/products", () => {
  it("should return all products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
}, 50000);
