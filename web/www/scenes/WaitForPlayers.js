class WaitForPlayers extends Phaser.Scene {

    constructor(){
        super("WaitForPlayers");
        this.total = 0;
        this.players = 0;
        this.connected = {};
        this.bubble = {};
    }

    preload(){
        this.load.spritesheet("wait", "./assets/wait.png",{frameWidth: 529, frameHeight: 525} );
    }

    create() {
        this.add.image(1280,800, "background");

        this.add.text(800,300, "Wachten op andere spelers", {
            fontFamily: "proxima-nova-condensed, sans-serif",
            fontSize: "72pt",
            color: "black"
        });
        this.connected = this.add.text(750,1200, ``, {
            fontFamily: "proxima-nova-condensed, sans-serif",
            fontSize: "64pt",
            color: "black"
        });

        this.bubble = this.add.sprite(1280,800,"wait", players);

        const cancel = this.add.image(400, 350, "cancel");
        cancel.setInteractive();
        cancel.on("pointerdown", () => socket.emit("reset"));
    }   
    
    update(){
        if(players !== this.players){
            this.connected.setText(`${players} van de ${playerCount} spelers zijn geconnecteerd`);
            this.handleBubble(players, playerCount);
            this.players = players;
            if(playerCount === 1){
                this.scene.start("Story");
            }
        }

        if(startStory){
            this.tweens.add({
                targets: this.bubble,
                scaleX: 10,
                scaleY: 10,
                ease: 'Linear',
                duration: 1000,
                repeat: 0,
                onComplete: () => {
                    this.scene.start("Story");
                }
            })
        }

        if(reset){
            this.scene.start("Players");
            this.totalPlayers = 0;
            reset = false;
        }
    }

    handleBubble(players, playerCount){
        switch(playerCount){
            case 2: 
                switch(players){
                    case 1:
                        this.bubble.setFrame(2);
                        break;
                    case 2:
                        this.bubble.setFrame(4);
                        break;
                }
                break;
            case 3:
                if(players === 3){
                    this.bubble.setFrame(4);
                } else {
                    this.bubble.setFrame(players);
                }
                break;
            case 4: 
                this.bubble.setFrame(players);
                break;
            default:
                this.bubble.setFrame(players);
                break;
        }
    }
    
}   