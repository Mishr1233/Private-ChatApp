const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const UserRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const  messageRoutes= require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { Socket } = require("socket.io");
const path = require("path");




dotenv.config();

connectDB();
const app = express();


app.use(express.json());//to accept JSON data



app.use("/api/user", UserRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);


//------------------------DEPLOYMENT-----------------------------

const _dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(_dirname, "/frontend/build")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(_dirname, "frontend", "build", "index.html"));
    });
} else {
    app.get('/', (req, res) => {
    res.send('API is Running successfully');
});
 }
    
    
    //------------------------DEPLOYMENT-----------------------------


app.use(notFound); 
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const server=app.listen(PORT, console.log(`server started on PORT ${PORT}`.yellow.bold));

const io = require("socket.io")(server, {
    pingTimeout:60000,
    cors: {
        origin:"http://localhost:3000",
    },
});


io.on("connection", (socket) => {
    console.log("connection to socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id);
       
        socket.emit("connected");
    });
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("user joined Room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    
    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users) return console.log('chat.users not defined');
           
        chat.users.forEach((user) => {
            if (user.id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});


