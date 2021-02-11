class Elements {

    constructor(){

    }

    newTitle(scene, x, y, text){
        scene.add.text(x,y, text, {
            fontFamily: "proxima-nova-condensed, sans-serif",
            fontSize: "72pt",
            color: "black",
            align: "center",
            boundsAlignV: "middle"
        });
    }

    newSubtitle(scene, x, y, text){
        scene.add.text(x, y, text, {
            fontFamily: "proxima-nova-condensed, sans-serif",
            fontSize: "40pt",
            color: "black",
            boundsAlignV: "middle"
        });
    }


    newErrorMessage(scene, x, y, text){
        scene.add.text(x, y, text, {
            fontFamily: "proxima-nova-condensed, sans-serif",
            fontSize: "40pt",
            color: "#D32027",
        });
    }

}

