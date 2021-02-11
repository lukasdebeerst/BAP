class Game extends Phaser.Scene {

    constructor(){
        super("Game");
        this.goodItems = ['poop', 'tomato'];
        this.badItems = ['pitchfork', 'bottle'];
        this.items = this.goodItems.concat(this.badItems);
        this.points = 0;
        this.minigamePoints = 0;
        this.scoreboard = 0;
        this.engine = {};
    }

    preload(){
        this.load.image("barn", "./assets/gameAssets/barn.png");
        this.load.image("background_chicken", "./assets/gameAssets/background_chicken.png");
        this.load.image("background_cow", "./assets/gameAssets/background_cow.png");
        this.load.image("background_pig", "./assets/gameAssets/background_pig.png");
        this.load.image("background_sheep", "./assets/gameAssets/background_sheep.png");
    
        this.load.spritesheet("generator_body", "./assets/gameAssets/generator_body.png", {frameWidth: 780, frameHeight: 941});
        this.load.spritesheet("generator_side", "./assets/gameAssets/generator_side.png", {frameWidth: 300, frameHeight: 418});

        this.load.spritesheet("reactor_body", "./assets/gameAssets/reactor_body.png", {frameWidth: 631, frameHeight: 1000});
        this.load.spritesheet("reactor_top", "./assets/gameAssets/reactor_top.png", {frameWidth: 338, frameHeight: 230});
        this.load.image("reactor_bottom", "./assets/gameAssets/reactor_bottom.png");

        this.load.image("poop", "./assets/gameAssets/poop.png");
        this.load.image("tomato", "./assets/gameAssets/tomato.png");
        this.load.image("pitchfork", "./assets/gameAssets/pitchfork.png");
        this.load.image("bottle", "./assets/gameAssets/bottle.png");
        this.load.image("bubble", "./assets/gameAssets/bubble.png");

        this.load.image("reactor_minigame", "./assets/gameAssets/reactor_minigame.png");
        this.load.image("minigame_bad", "./assets/gameAssets/minigame_bad.png");
        this.load.image("minigame_good", "./assets/gameAssets/minigame_good.png");

        this.load.audio("bubble_sound", "./assets/sounds/bubble.mp3");
        this.load.audio("generator_sound", "./assets/sounds/generator.mp3");
        this.load.audio("reactor_sound", "./assets/sounds/reactor.mp3");
        this.load.audio("led_point", "./assets/sounds/led_point.mp3");
        this.load.audio("engine", "./assets/sounds/engine.mp3");


        this.load.image('overlay', 'assets/overlay.png');
    }   

    create(){

        if(animal){
            const bg = "background_" + animal;
            this.add.image(1280, 800, bg);
        } else {
            this.add.image(1280, 800, "background_cow");
        }


        this.barn = this.add.image(580, 410, "barn");
        this.tip = this.add.text(800, 1500, "", {
            fontFamily: "proxima-nova-condensed, sans-serif",
            fontSize: "40pt",
            color: "white",
        });


        this.generator_body = this.add.sprite(380, 1000, "generator_body", 0);
        this.generator_body.setDepth(1);
        this.generator_side = this.add.sprite(700, 1150, "generator_side", 0);
        this.generator_side.setDepth(1);
        this.generator_side.setInteractive();
        this.generator_side.input.dropZone = true;

        this.reactor_body = this.add.sprite(2030, 810, "reactor_body", 0);
        this.reactor_top = this.add.sprite(2100, 460, "reactor_top", 0);
        const reactor_bottom = this.add.image(1700, 1230, "reactor_bottom");
        this.reactor_top.setInteractive();
        this.reactor_top.input.dropZone = true;
        
        // handle Item generation
        this.handleItemGenerator();
        this.createAnims();
        this.handleBlink(this.reactor_body, 'reactorBlink');
        this.handleBlink(this.generator_body,'generatorBlink');

        this.energy = this.add.rectangle(1070, 1510, 0, 60, 0xE58F66);

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        
        this.input.on('drop', (pointer, gameObject, dropZone) => {
            gameObject.destroy();
            if(dropZone.texture.key === "reactor_top"){
                this.handleDropInReactor(gameObject);
            } else if(dropZone.texture.key === "generator_side" && gameObject.texture.key === "bubble"){
                this.handleGenerator();
            } else if(dropZone.texture.key === "minigame_good" || dropZone.texture.key === "minigame_bad"){
                this.handlePointsMinigame(dropZone.texture.key, gameObject.texture.key);
            }
        });

      
        this.input.on('dragend', function (pointer, gameObject, dropped) {
            if (!dropped){
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
    
        });


        const cancel = this.add.image(50, 50, "cancel");
        cancel.setInteractive();
        cancel.on("pointerdown", () => socket.emit("reset"));
        cancel.setDepth(1);
    }

    createAnims(){
        this.anims.create({
            key: 'dropInReactor',
            frames: this.anims.generateFrameNumbers('reactor_top',{frames: [ 2, 3, 2, 1, 0]}),
            frameRate: 24,
        });
        this.anims.create({
            key: 'reactorBlink',
            frames: this.anims.generateFrameNumbers('reactor_body',{frames: [ 1, 2, 3, 4, 3, 2, 1, 0]}),
            frameRate: 24,
        });
        this.anims.create({
            key: 'generatorBlink',
            frames: this.anims.generateFrameNumbers('generator_body',{frames: [ 1, 2, 1, 0]}),
            frameRate: 24,
        });
        this.anims.create({
            key: 'generateElectricity',
            frames: this.anims.generateFrameNumbers('generator_body',{frames: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 21] }),
            frameRate: 24,
        });
        this.generatorAnim = this.anims.create({
            key: 'getBubble',
            frames: this.anims.generateFrameNumbers('generator_side',{frames: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0]}),
            frameRate: 24,
        });

    }

    handleBlink(gameObject,animKey){
        const time = Phaser.Math.Between(2500, 6000);  
        setTimeout(() => {
            if(reset === false && this.points < 12){
                gameObject.play(animKey);
            }
            this.handleBlink(gameObject,animKey);
        }, time);
    }


    handleItemGenerator(){
        if(animal){
            if(animal === "cow" || animal === "pig"){
                this.items = this.items.concat(this.goodItems);
            }
        }
        this.itemGenerator = setInterval(() => {
            const item = Phaser.Math.Between(0, this.items.length);  
            let generatedItem = this.add.image(0, 500, this.items[item]);
            generatedItem.setInteractive();
            this.input.setDraggable(generatedItem);
            this.barn.setDepth(1);
            this.tweens.add({
                targets: generatedItem,
                props: {
                    y: {
                        value: '+=100', duration: 1000, ease: "power1"
                    },
                    x: {
                        value: '+=1200', duration: 1000, ease: "power1"
                    },
                }
            }); 
            this.time.addEvent({
                delay: 3000,
                callback: ()=> generatedItem.destroy(),
                loop: false
            });
        }, 2000);
    }

    handleDropInReactor(gameObject){
        this.sound.add("reactor_sound").play();
        this.reactor_top.play('dropInReactor');
        if(this.goodItems.includes(gameObject.texture.key)){
            this.generateBubbles();
        } else {
            this.wrongItems(gameObject);
        }
    }


    generateBubbles() {
        this.bubbleGenerator = this.time.addEvent({
            delay: 2000,
            callback: ()=> {
                const bubble = this.add.image(1650, 1230, "bubble");
                bubble.setInteractive();
                this.input.setDraggable(bubble);
                this.sound.add("bubble_sound").play();
                const animation = this.tweens.add({
                    targets: bubble,
                    props: {
                        y: {
                            value: '-=500', duration: 3000
                        },
                        x: {
                            value: '-=300', duration: 3000
                        },
                        alpha: {
                            value: '0', duration: 3000
                        },
                        angle: {
                            value: '360', duration: 3000
                        }
                    }
                }); 
                this.tweens.add({
                    targets: bubble,
                    props: {
                        alpha: {
                            value: '0', duration: 3000
                        }
                    }
                }); 
                bubble.on("drag", () => {
                    animation.stop();
                })
                
            },
            repeat: 4
        });
    }

    wrongItems(){
        clearInterval(this.itemGenerator);
        if(this.bubbleGenerator){
            this.time.removeEvent(this.bubbleGenerator);
        }
        this.minigame_overlay = this.add.image(1280, 800, "overlay").setDepth(1);
        
        this.minigame_reactor = this.add.image(1450,310, "reactor_minigame").setDepth(1);
        this.minigame_bad = this.add.image(400,1195, "minigame_bad");
        this.minigame_bad.setDepth(1);
        this.minigame_bad.setInteractive();
        this.minigame_bad.input.dropZone = true;
        this.minigame_good = this.add.image(2130,1130, "minigame_good");
        this.minigame_good.setDepth(1);
        this.minigame_good.setInteractive();
        this.minigame_good.input.dropZone = true;

        this.wrongItemItemGenerator();
        
    }

    wrongItemItemGenerator(){
        this.minigame_items = this.add.group();
        this.minigame_generator = setInterval(() => {
            const item = Phaser.Math.Between(0, this.items.length);
            const generatedItem = this.add.image(1280,350, this.items[item]);
            generatedItem.setInteractive();
            this.input.setDraggable(generatedItem);
            generatedItem.setDepth(1);
            this.minigame_items.add(generatedItem);
            const animation = this.tweens.add({
                targets: generatedItem,
                props: {
                    y: {
                        value: '+=1000', duration: 3000
                    },
                }
            }); 

            const timer = this.time.addEvent({
                delay: 3000,
                callback: ()=> generatedItem.destroy(),
                loop: false
            });
            generatedItem.on("drag", () => {
                animation.pause();
                timer.paused = true;
            });
            generatedItem.on("dragend", () => {
                animation.resume();
                timer.paused = false;
            });
        }, 2000);
    }

    handlePointsMinigame(dropzone, gameObject){
        if(dropzone === "minigame_good" && this.goodItems.includes(gameObject)){
            this.minigamePoints++
            this.sound.add("reactor_sound").play();
        }
        if(dropzone === "minigame_bad" && this.badItems.includes(gameObject)){
            this.minigamePoints++
            this.sound.add("reactor_sound").play();
        }
        if(this.minigamePoints === 3){
            this.minigame_overlay.destroy();
            this.minigame_reactor.destroy();
            this.minigame_bad.destroy();
            this.minigame_good.destroy();
            this.handleItemGenerator();
            clearInterval(this.minigame_generator);
            this.minigamePoints = 0;
            this.minigame_items.getChildren().map(child => child.destroy());

        }
    }
    

    handleGenerator(){
        this.sound.add("generator_sound").play();
        if(this.points === 12){
            this.engine.stop();
        }
        if(this.points < 11){
            this.generator_side.play("getBubble");
            setTimeout(() => {
                this.generator_body.play('generateElectricity');
            }, 1000);
        }
        if(this.points === 0){
            this.add.circle(1060, 1510, 30, 0xE58F66);
        }
        this.points++;
        socket.emit("point", socket.id);
        this.tweens.add({
            targets: this.energy,
            props: {
                width: {
                    value: '+=45', duration: 300, ease: "power1"
                },
            }
        });
        this.scoreboard++;
        if(this.scoreboard === 3){
            this.sound.add("led_point").play();
            this.scoreboard = 0;
        }
        if(this.points === 6){
            this.engine = this.sound.add("engine", {volume: 0.2}).play();
        }
    }

    update(){
        if(result){
            clearInterval(this.itemGenerator);
            this.scene.start("End");
        }

        if(reset){
            this.scene.start("Players");
            reset = false;
        }
    }

}