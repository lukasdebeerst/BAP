const Game = require("./Game");
const Initalisation = require("./Initalisation");

class RootStore {

    constructor(io, five){
        this.five = five;
        this.io = io;
        this.initalisation = new Initalisation(this);
        this.game = new Game(this);
    }

}

module.exports = RootStore;