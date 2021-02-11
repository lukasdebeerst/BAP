class Story extends Phaser.Scene {

    constructor(){
        super("Story");
    }

    preload(){
        this.load.video("story", "./assets/story.mp4");
    }
    

    create() {
        const video = this.add.video(1280,800, "story");
        video.play();

        video.on('complete', () => {
            this.scene.start("Countdown");
        });

        const next = this.add.text(50,20, "next", {
            fontSize: "30pt"
        });
        next.setInteractive();
        next.on("pointerdown", () => {
            this.scene.start("Countdown");
        });   

    }   

}