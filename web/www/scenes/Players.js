class Players extends Phaser.Scene {

    constructor(){
        super("Players");
        this.listenForPlayers();
        this.players = 0;
    }

    listenForPlayers(){
        socket.on("start", bool => {
            if(this.players === 0){
                this.scene.start("Start");
            }
        });
    }

    preload(){
        this.load.image("background", "./assets/ui/background.png");
        this.load.image("button_starten", "./assets/ui/button_starten.png");
        this.load.image("hourglass", "./assets/hourglass.png");
        this.load.image("cancel", "./assets/ui/close.png");

        this.load.image("1players", "./assets/1players.png");
        this.load.image("2players", "./assets/2players.png");
        this.load.image("3players", "./assets/3players.png");
        this.load.image("4players", "./assets/4players.png");
        this.load.image("1players_selected", "./assets/1players_selected.png");
        this.load.image("2players_selected", "./assets/2players_selected.png");
        this.load.image("3players_selected", "./assets/3players_selected.png");
        this.load.image("4players_selected", "./assets/4players_selected.png");

    }

    create() {
        this.resize();
        this.handleServerReset();
        this.add.image(1280,800, "background");
        
        elements.newTitle(this, 900,300, "Kies het aantal spelers");

        const allPlayers = this.add.container(380, 800);
        const speler_1 = this.add.container(0, 0);
        this.speler_1_text = this.add.text(0, 200, "1 speler", {
            fontFamily: "proxima-nova-condensed, sans-serif",
            fontSize: "64pt",
            color: "black",
        });
        this.speler_1_image = this.add.image(125, 0, "1players");
        speler_1.add([this.speler_1_text, this.speler_1_image]);
        this.speler_1_text.setInteractive();
        this.speler_1_text.on("pointerdown", () => this.setPlayer(1, this.speler_1_text, this.speler_1_image));
        this.speler_1_image.setInteractive();
        this.speler_1_image.on("pointerdown", () => this.setPlayer(1, this.speler_1_text, this.speler_1_image));    

        const speler_2 = this.add.container(500, 0);
        this.speler_2_text = this.add.text(0, 200, "2 spelers", {
            fontFamily: "proxima-nova-condensed, sans-serif",
            fontSize: "64pt",
            color: "black"
        });;
        this.speler_2_image = this.add.image(125, 0, "2players");
        speler_2.add([this.speler_2_text, this.speler_2_image]);
        this.speler_2_text.setInteractive();
        this.speler_2_text.on("pointerdown", () => this.setPlayer(2, this.speler_2_text, this.speler_2_image));
        this.speler_2_image.setInteractive();
        this.speler_2_image.on("pointerdown", () => this.setPlayer(2, this.speler_2_text, this.speler_2_image));

        const speler_3 = this.add.container(1000, 0);
        this.speler_3_text = this.add.text(0, 200, "3 spelers", {
            fontFamily: "proxima-nova-condensed, sans-serif",
            fontSize: "64pt",
            color: "black"
        });;;
        this.speler_3_image = this.add.image(125, 0, "3players");
        speler_3.add([this.speler_3_text, this.speler_3_image]);
        this.speler_3_text.setInteractive();
        this.speler_3_text.on("pointerdown", () => this.setPlayer(3, this.speler_3_text, this.speler_3_image));
        this.speler_3_image.setInteractive();
        this.speler_3_image.on("pointerdown", () => this.setPlayer(3, this.speler_3_text, this.speler_3_image));    

        const speler_4 = this.add.container(1500, 0);
        this.speler_4_text = this.add.text(0, 200, "4 spelers", {
            fontFamily: "proxima-nova-condensed, sans-serif",
            fontSize: "64pt",
            color: "black"
        });;;
        this.speler_4_image = this.add.image(125, 0, "4players");
        speler_4.add([this.speler_4_text, this.speler_4_image]);
        this.speler_4_text.setInteractive();
        this.speler_4_text.on("pointerdown", () => this.setPlayer(4, this.speler_4_text, this.speler_4_image));
        this.speler_4_image.setInteractive();
        this.speler_4_image.on("pointerdown", () => this.setPlayer(4, this.speler_4_text, this.speler_4_image));

        allPlayers.add([speler_1, speler_2, speler_3, speler_4]);

        const submit = this.add.image(1280,1300, "button_starten");
        submit.setInteractive();
        submit.on("pointerdown", () => {
            if(this.players){
                this.submitPlayer();
            } else {
                this.handlePlayerError();
            }
        })
    }

    resize(){
        const canvas = this.game.canvas; 
        const width = window.innerWidth;
        const height = window.innerHeight;
        const width_ratio = width / height;
        const ratio = canvas.width / canvas.height;
     
        if (width_ratio < ratio) {
            canvas.style.width = width + "px";
            canvas.style.height = (width / ratio) + "px";
        } else {
            canvas.style.width = (height * ratio) + "px";
            canvas.style.height = height + "px";
        }
    }
    
    setPlayer(players, text, image) {
        this.players = players;
        if(!image.texture.key.includes("_selected")){
            text.setColor("#D44500");
            const imagekey = image.texture.key + "_selected";
            image.setTexture(imagekey);
        }
        if(players !== 1){
            this.speler_1_text.setColor("black");
            this.speler_1_image.setTexture("1players");
        }
        if(players !== 2){
            this.speler_2_text.setColor("black");
            this.speler_2_image.setTexture("2players");
        }
        if(players !== 3){
            this.speler_3_text.setColor("black");
            this.speler_3_image.setTexture("3players");
        }
        if(players !== 4){
            this.speler_4_text.setColor("black");
            this.speler_4_image.setTexture("4players");
        }        
    }

    submitPlayer(){
        if(this.players !== 0){
            socket.emit("players", this.players);
            this.scene.start("WaitForPlayers");
        }
      
    }

    handlePlayerError(){
        elements.newErrorMessage(this, 900,500, "Kies het aantal speler voor je kan starten.")
    }

    handleServerReset(){
        socket.emit("serverReset");
    } 

    update(){
        if(reset){
            this.scene.start("Players");

            reset = false;
        }

        if(error){
            this.scene.start("Error");
        }

        if(socket.disconnected){
            error = "disconnected";
            this.scene.start("Error");
        }
    }
}