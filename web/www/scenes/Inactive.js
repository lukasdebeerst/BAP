class Inactive extends Phaser.Scene {

    constructor(){
        super("Inactive");
    }


    create() {
        this.add.image(1280,800, "background");

        this.add.text(700,300, "Deze tablet wordt niet gebruikt in dit spel", {
            fontFamily: "proxima-nova-condensed, sans-serif",
            fontSize: "64pt",
            color: "black",
        });
        
        this.add.image(1280,800,"hourglass");


        this.add.text(900,1200, "Wacht tot het volgend spel", {
            fontFamily: "proxima-nova-condensed, sans-serif",
            fontSize: "64pt",
            color: "black"
        });
        
        
    }   
    
    update(){

    }


}