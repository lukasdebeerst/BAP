class Error extends Phaser.Scene {

    constructor(){
        super("Error");
    }

    preload(){
        this.load.image("button_probeer_opnieuw", "./assets/ui/button_probeer_opnieuw.png");
    }

    create(){
        this.add.image(1280,800, "background");
        switch(error){
            case "unknownUser":
                elements.newTitle(this, 800,300, "Error: niet gekende speler.");
                elements.newSubtitle(this, 900,600, "Contacteer een medewerker.");
                break;
            case "disconnected":
                elements.newTitle(this, 725,300, "Error: geen connectie met server.");
                elements.newSubtitle(this, 1000,400, "Contacteer een medewerker.");
                break;
            case "boardFailed":
                elements.newTitle(this, 725,300, "Error: geen connectie met Arduino.");
                elements.newSubtitle(this, 1000,400, "Contacteer een medewerker.");
                break;
            default:
                elements.newTitle(this, 725,300, "Error: Er is een onbekende fout.");
                elements.newSubtitle(this, 1000,400, "Contacteer een medewerker.");
        }

        const button = this.add.image(1280,1300, "button_probeer_opnieuw");
        button.setInteractive();
        button.on("pointerdown", () => {
            location.reload();
        })

    }
}