class Start extends Phaser.Scene {

    constructor(){
        super("Start");
    }

    preload(){
        this.load.spritesheet("wait", "./assets/wait.png",{frameWidth: 529, frameHeight: 525} );
        this.load.image("button_starten", "./assets/button_starten.png");
    }


    create() {
        this.add.image(1280,800, "background");

        const title = this.add.text(800,300, "Wil je mee doen aan het spel?", {
            fontFamily: "proxima-nova-condensed, sans-serif",
            fontSize: "72pt",
            color: "black"
        });        
        
        this.add.sprite(1280,800,"wait", 0);

        const start = this.add.image(1280,1300, "button_starten");
        start.setInteractive();
        start.on("pointerdown", () => {
            socket.emit("start", true); 
            this.scene.start("WaitForPlayers");
        });
        
    }   
    
    update(){
        if(inactive){
            this.scene.start("Inactive");
        }
    }


}