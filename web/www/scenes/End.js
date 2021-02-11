class End extends Phaser.Scene {

    constructor(){
        super("End");
    }

    preload(){
        this.load.image("button_speel_opnieuw", "./assets/ui/button_speel_opnieuw.png");
        this.load.image("winner", "./assets/gameAssets/winner.png");
        this.load.image("loser", "./assets/gameAssets/loser.png");

    }

    create(){
        this.add.image(1280,800, "background");
        switch(result){
            case "winner": 
                elements.newTitle(this,950,300, "Je bent gewonnen");
                this.add.image(1200,800, "winner");
            break;
            case "loser":
                elements.newTitle(this,950,300, "Je bent verloren");
                this.add.image(1200,800, "loser");
            break;
        }

        const button = this.add.image(1280,1300, "button_speel_opnieuw");
        button.setInteractive();
        button.on("pointerdown", () => {
            socket.emit("reset");
            location.reload();
        })

    }
}