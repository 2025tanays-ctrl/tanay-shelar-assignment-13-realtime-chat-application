const express = require("express");
const http=require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.use(express.static('public'));

let users=new Map();

io.on("connection", (socket) => {
    console.log("User with id:-", socket.id, "is connected");

    socket.emit('users-count', users.size);

    socket.on('new-user-joined',(username)=>{
        users.set(socket.id,username);
        io.emit('users-count',users.size);
    });
    
    socket.on('send-message',(message)=>{
    let username=users.get(socket.id);
    io.emit('recieve-message',{username,message});
});


    socket.on("disconnect", () => {
        console.log("User with id:-", socket.id, "is disconnected");
        users.delete(socket.id);
        io.emit('users-count',users.size);
    });
});

server.listen(4000, () => {
    console.log("Server is running on port 4000");
});