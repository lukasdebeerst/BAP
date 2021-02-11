let socket, elements,players, playerCount, startStory, inactive, countdown, result, reset, error, animal;

{
    const init = () => {
        socket = io.connect("http://192.168.1.56:4000");
        initPhaser();
        initSocket();
        checkInactivity();

        elements = new Elements();
    }

    const initPhaser = () => {
        let config = {
            type: Phaser.canvas,
            parent: "game",
            dom: {
                createContainer: true
            },
            width: 2560,
            height: 1600,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 },
                    debug: false
                }
            },
            scene: [
                Players, 
                Start, 
                WaitForPlayers,
                Inactive,
                Story,
                Countdown,
                Game,
                End,
                Error
            ]
        };

        new Phaser.Game(config);
    }

    const initSocket = () => {
        socket.on("connect", () => {
            console.log("connected:", socket.id);
        });
    
        
        socket.on("players", (plyrs, plyrCnt) => {
            players = plyrs;
            playerCount = plyrCnt;
        }); 
        
        socket.on("startStoryline", () => startStory = true)
        
        socket.on("inactive", () => inactive = true);
        
        socket.on("startCountdown", () => countdown = true);

        socket.on("animal", value => animal = value);
        
        socket.on("endGame", socketid => {
            if(socket.id === socketid){
                result = "winner";
            } else {
                result = "loser";
            }
        });
        
        socket.on("reset", () => reset = true);

        socket.on("err", message => error = message)
        
    }

    const checkInactivity = () => {
        const time = 180000;  
        let timer;
        timer = setTimeout(() => {
            location.reload();
        }, time);
        window.addEventListener('click', () => clearTimeout(timer));    
    }

    init();
}








