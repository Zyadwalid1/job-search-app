import express from "express";
import { DBConnection } from "./src/DB/db.connection.js";
import "./src/utils/helpers/deleteExpiredOtps.js";
import authController from "./src/modules/auth/auth.controller.js";
import companyController from "./src/modules/company/company.controller.js";
import jobController from "./src/modules/job/job.controller.js";
import userController from "./src/modules/user/user.routes.js";
import morgan from "morgan";
import cors from "cors";
import { createHandler } from "graphql-http/lib/use/express";
import { schema } from "./src/app.graphql.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { ChatModel } from "./src/models/chat.model.js";
import { isHROrOwner, isRegularUser } from "./src/utils/helpers/user.helpers.js";

const app = express();
const httpServer = createServer(app);

// CORS configuration
app.use(cors({
  origin: '*',  // For testing only. In production, specify your domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));

app.use(express.json());

app.use(morgan("combined"));

//DB connection
await DBConnection();

//api to test deployment
app.get("/", (req, res, next) => {
  return res.json({ message: "success!!!" });
});

app.use("/graphql", createHandler({ schema }));
app.use("/auth", authController);
app.use("/company", companyController);
app.use("/jobs", jobController);
app.use("/users", userController);

//handle wrong api calls
app.all("*", (req, res, next) => {
  return next(new Error("API not found!"));
});

//global error handler
app.use((error, req, res, next) => {
  const status = error.cause || 500;
  return res
    .status(status)
    .json({ status: "Error", error: error.message, stack: error.stack });
});

// Socket.io connection handling
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
  }
});

// Helper function to emit chat messages
const emitChatMessage = (chatId, senderId, receiverId, message) => {
  io.to(senderId).to(receiverId).emit("newMessage", {
    chatId,
    message: {
      senderId,
      message,
      timestamp: new Date()
    }
  });
};

// Helper function to handle socket errors
const handleSocketError = (socket, error) => {
  socket.emit("chatError", { message: error.message });
};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their notification room`);
  });

  socket.on("startChat", async ({ senderId, receiverId, message }) => {
    try {
      const isHR = await isHROrOwner(senderId);
      const isUser = await isRegularUser(receiverId);
      
      if (!isHR || !isUser) {
        throw new Error("Only HR/owner can start chat with regular users");
      }

      let chat = await ChatModel.findOne({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      });

      if (!chat) {
        chat = await ChatModel.create({
          senderId,
          receiverId,
          messages: [{ senderId, message }]
        });
      } else {
        chat.messages.push({ senderId, message });
        await chat.save();
      }

      emitChatMessage(chat._id, senderId, receiverId, message);
    } catch (error) {
      handleSocketError(socket, error);
    }
  });

  socket.on("sendMessage", async ({ chatId, senderId, message }) => {
    try {
      const chat = await ChatModel.findById(chatId);
      if (!chat) {
        throw new Error("Chat not found");
      }

      chat.messages.push({ senderId, message });
      await chat.save();

      emitChatMessage(chat._id, chat.senderId.toString(), chat.receiverId.toString(), message);
    } catch (error) {
      handleSocketError(socket, error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const port = process.env.PORT;
httpServer.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
