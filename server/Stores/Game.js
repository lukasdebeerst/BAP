require("dotenv").config({path:"./db/.env"});

class Game {

    constructor(RootStore){
        this.Root = RootStore;
        this.players = this.Root.initalisation.players;
        this.countdown = 0;
        
    }

    listenForPoints(socket){
        socket.on("point", socketId => {
            this.players.forEach(player => {
                if(player.id === socketId){
                    player.points++;
                    this.handleScoreBoard(player.number, player.points);
                    this.handleBarn(player.number, player.points);
                    this.handleTractor(player.number, player.points);
                    if(player.points == process.env.TOTAL_POINTS){
                        this.handleEndGame(player);
                    }
                }
            })
        })
    }

    handleArduino(pin, value){
        if(value){
            new this.Root.five.Led(pin).brightness(value);
        } else {
            new this.Root.five.Led(pin).on();
        }

    }

    handleScoreBoard(player, points){
        const ratio = process.env.TOTAL_POINTS/4;
        switch(player){
            case 0:
                switch(points){
                    case ratio:
                        new this.Root.five.Led(process.env.P0_01).on();
                        break;
                    case ratio*2: 
                        new this.Root.five.Led(process.env.P0_02).on();
                        break;
                    case ratio*3: 
                        new this.Root.five.Led(process.env.P0_03).on();
                        break;
                    case ratio*4: 
                        new this.Root.five.Led(process.env.P0_04).on();
                        break;
                }
            break;
            case 1: 
                switch(points){
                    case ratio: 
                        new this.Root.five.Led(process.env.P1_01).on();
                        break;
                    case ratio*2: 
                        new this.Root.five.Led(process.env.P1_02).on();
                        break; 
                    case ratio*3: 
                        new this.Root.five.Led(process.env.P1_03).on();
                        break;
                    case ratio*4: 
                        new this.Root.five.Led(process.env.P1_04).on();
                        break;
                }
            break;
        }
    }

    handleBarn(player, points){
        const percentage = (process.env.TOTAL_POINTS/4) * 3;
        switch(player){
            case 0: 
                this.handleArduino(process.env.P0_BARN, 255/percentage * points);
                break;
            case 1: 
                this.handleArduino(process.env.P1_BARN, 255/percentage * points);
                break;
            default:
                break;
        }
    }

    handleTractor(player, points){
        const percentage = process.env.TOTAL_POINTS/120;
        if(points === process.env.TOTAL_POINTS/2){
            switch(player){
                case 0: 
                    new this.Root.five.Servo({
                        pin: process.env.P0_TRACTOR, 
                        type: "continuous"
                    }).ccw(percentage*points);
                    break;
                case 1: 
                    new this.Root.five.Servo({
                        pin: process.env.P1_TRACTOR, 
                        type: "continuous"
                    }).ccw(percentage*points);
                    break;
                default:
                    break;
            }
        }
        
    }

    handleEndGame(winner){
        this.Root.io.emit("endGame", winner.id);
    }

    startGame(socket){
        this.listenForPoints(socket);
        this.Root.io.emit("startGame");
    }

    handleCountdown(){
        this.countdown++;
        if(this.countdown === this.players.length){
            this.Root.io.emit("startCountdown");
        }
    }


    reset(){
        this.players = this.Root.initalisation.players;
        this.countdown = 0;
        for (let i = 2; i < 14; i++) {
            if(i !== process.env.P0_TRACTOR && i !== process.env.P1_TRACTOR){
                new this.Root.five.Led(i).off();
            } else {
                new this.Root.five.Servo({
                    pin: process.env.P0_TRACTOR, 
                    type: "continuous"
                }).stop();
                new this.Root.five.Servo({
                    pin: process.env.P1_TRACTOR, 
                    type: "continuous"
                }).stop();
            }
        }
    }
}

module.exports = Game;