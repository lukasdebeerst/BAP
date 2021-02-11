const Player = require("../Models/Player");
const MacAddress = require('get-mac-address');
require("dotenv").config({path:"./db/.env"});
const find = require('local-devices');


class Initalisation {

    constructor(RootStore){
        this.Root = RootStore;
        this.playerCount = 0;
        this.players = [];
        this.users = [];
    }

    initGame(socket){
        this.handleUsers(socket);
        socket.on("players", (plyrs) => {
            console.log("player");
            this.playerCount = plyrs;
            this.initPlayer(socket);
            
            this.Root.io.emit("start", true);
        });

        socket.on("start", bool => this.initPlayer(socket));
    }

    handleUsers = async(socket) => {
        const remoteAddress = socket.conn.remoteAddress;
        const ip = remoteAddress.substring(7);
        await find(ip).then(device => {
            switch(device.mac){
                case process.env.P0_MAC: 
                    this.users.push(new Player({id: socket.id, number: 0, mac: process.env.P0_MAC, animal: process.env.P0_ANIMAL}));
                    this.Root.io.to(socket.id).emit("animal", process.env.P0_ANIMAL);
                    break;
                case process.env.P1_MAC:
                    this.users.push(new Player({id: socket.id, number: 1, mac: process.env.P1_MAC, animal: process.env.P1_ANIMAL}));
                    this.Root.io.to(socket.id).emit("animal", process.env.P1_ANIMAL);
                    break;
                default:
                    this.Root.io.to(socket.id).emit("err", "unknownUser");
                    break;
            }        
        });
        
    }

    initPlayer(socket){
        const user = this.users.find(user => user.id === socket.id);
        this.players.push(user);

        this.Root.io.emit("players", this.players.length, this.playerCount);

        if(this.players.length === this.playerCount){
            this.startGame();
            if(this.playerCount < 4){
                this.handleInactiveUsers();
            }
        }
    }

    handleInactiveUsers(){
        this.users.forEach(user => {
            if(this.players.filter(player => player.id !== user.socketid).length > 0){
                this.Root.io.to(user.id).emit("inactive");
            }
        })
    }

    startGame(){
        this.Root.io.emit("startStoryline", true);
    }

    userDisconnected(socket){
        this.users = this.users.filter(user => user.id !== socket.id);
        this.players = this.players.filter(player => player.id !== socket.id);
    }
    
    reset(){
        this.playerCount = 0;
        this.players = [];
    }

    handleSetAnimal(socketId, animal){
        const user = this.users.find(user => user.id === socketId);
        user.setAnimal(animal);
    }

    getAnimal(socket){
        const user = this.users.find(user => user.id === socket.id);
        socket.emit("getAnimal", user.animal);
    }

}

module.exports =  Initalisation