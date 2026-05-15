require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");
const connectDB = require("./src/config/db");
const initSocket = require("./src/sockets/socket");

const PORT = process.env.PORT || 8080;

const startServer = async () => {
    await connectDB();

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize Socket.io
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    // Init socket handlers
    initSocket(io);

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Socket.io ready!`);
    });
};

startServer();