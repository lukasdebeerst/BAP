const express = require('express')
const app = express()
const server = require('http').createServer(app);
const port = 4000
const io = require('socket.io')(server);

let five = require("johnny-five");
let board = new five.Board({
    repl: false,
});

const RootStore = require("./Stores/RootStore");
const Root = new RootStore(io, five);

board.on("fail", () => io.emit("err", "boardFailed"));
board.on("close", () => {console.log(closed);io.emit("err", "boardFailed")});


board.on("ready", () => {
    io.on("connect", socket => {
        console.log("new User");    
        Root.initalisation.initGame(socket);
    
        socket.on("startGame", bool => {
            console.log("startGame");
            Root.game.startGame(socket);
        });
    
        socket.on("countdown", socketId => {
            Root.game.handleCountdown();
        });
    
        socket.on("serverReset", () => {
            Root.initalisation.reset();
            Root.game.reset();
        });
    
        socket.on("reset", () => {
            io.emit("reset");
        });
    
        socket.on("setAnimal", (socketId, animal) => {
            Root.initalisation.handleSetAnimal(socketId, animal);
        });
    
        socket.on("getAnimal", socketId => {
            Root.initalisation.getAnimal(socket);
        });
    
        socket.on("disconnect", () => {
            Root.initalisation.userDisconnected(socket);
        }); 
    });
})





server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


