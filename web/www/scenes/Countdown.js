class Countdown extends Phaser.Scene {

    constructor(){
        super("Countdown");
        this.timer = 4
        this.message = {};
        this.timeEvent = {};

    }

    preload(){

    }

    create() {
        this.add.image(1280,800, "background");
        this.add.text(1050,300, "Spel start in ", {
            fontFamily: "proxima-nova-condensed, sans-serif",
            fontSize: "72pt",
            color: "black"
        });
        this.message = this.add.text(250,100, "", {
            fontFamily: "proxima-nova-condensed, sans-serif",
            fontSize: "1000pt",
            color: "#82796E"
        });    
        
        this.add.image(1280,800,"hourglass");

        socket.emit("countdown", socket.id);

    }   

    handleCountdown(){
        this.timeEvent = this.time.addEvent({ delay: 1000, callback: this.countdown, callbackScope: this, loop: true });
    }

    countdown(){
        this.timer = this.timer - 1;
        this.message.setText(this.timer);
        if([4,2,0].includes(this.timer)){
            this.message.setX(1700);
        } else {
            this.message.setX(250);
        }
        if(this.timer === 0){
            this.scene.start("Game");
            socket.emit("startGame");
            this.timer = 4;
        }
    }
    
    update(){
        if(countdown){
            this.handleCountdown();
            countdown = false;
        }
    }


}