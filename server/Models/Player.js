class Player {

    constructor({id, number, points = 0, mac, animal}){
        this.id = id;
        this.number = number;
        this.points = points;
        this.animal = animal;
        this.mac = mac;
    }
}

module.exports = Player;