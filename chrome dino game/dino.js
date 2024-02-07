//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context; //used for drawing

//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50; 
let dinoY = boardHeight -  dinoHeight; //to place dino on bottom of board
let dinoImg;
let dinoDucking = false;

let dino = {
    x: dinoX,
    y : dinoY,
    width: dinoWidth,
    height: dinoHeight
}

//cactus
let cactusArray = [];
let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//cloud
let cloudArray = [];

let cloudWidth = 84;
let cloudHeight = 33;

let cloudImg;

let cloudX = 700;
let cloudY = 50;

//track
let trackHeight = 28;
let trackWidth = 2404;
let trackImg;
let trackX = boardWidth/2 - 1202;
let trackY = boardHeight - trackHeight;

//bird
let birdArray = [];
let birdHeight = 68;
let birdWidth = 97;

let birdX = 700;
let birdY = 90;

let birdImg;

//physics
let velocityX = -8; //move left speed
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let gameOverImg;
let score = 0;

window.onload = function() { //when the window loads
    board = document.getElementById("board"); //gets the id set in html file
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); 

    //image sourcing
    dinoImg = new Image();
    dinoImg.src = "./assets/dino.png"; 
    dinoImg.onload = function() { 
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    } 

    cactus1Img = new Image();
    cactus1Img.src = "./assets/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./assets/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./assets/cactus3.png"; 

    gameOverImg = new Image();
    gameOverImg.src = "./assets/game-over.png";

    cloudImg = new Image();
    cloudImg.src = "./assets/cloud.png";

    trackImg = new Image();
    trackImg.src = "./assets/track.png";

    birdImg = new Image();
    birdImg.src = "./assets/bird1.png";

    //intervals, listeners and update func
    requestAnimationFrame(update);
    setInterval(placeCactus, 1000);
    setInterval(placeCloud, 2000);
    setInterval(imageChange, 200);
    setInterval(placeBird, 2000);
    document.addEventListener("keydown", moveDino);
    document.addEventListener("keyup", keyReleased);
    
}

function update() {
    requestAnimationFrame(update); //calls update func every second
    if(gameOver) {
        context.drawImage(gameOverImg, boardWidth/2 - 184, boardHeight/2, 368, 40);
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //track
    context.drawImage(trackImg, trackX, trackY, trackWidth, trackHeight);

    //dino
    velocityY += gravity; //draws dino to ground
    dino.y = Math.min(dino.y + velocityY, dinoY); //ensures dino cant fall through ground 

    if(dinoDucking == true)
    {
        dino.width = 118;
        dino.height = 60;
        dino.y = boardHeight - dino.height;
    } 
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height); 
    
    
    //cactus
    for (let i = 0; i < cactusArray.length; i++)
    {
        let cactus = cactusArray[i];
        cactus.x += velocityX; 
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);
        
        if(detectCollision(dino, cactus))
        {
            gameOver = true;
            dinoImg.src = "./assets/dino-dead.png";
            dinoImg.onload = function() {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    //cloud
    for(let i = 0; i < cloudArray.length; i++)
    {
        let cloud = cloudArray[i];
        cloud.x += -1;
        context.drawImage(cloudImg, cloud.x, cloud.y, cloud.width, cloud.height);
    }

    //bird
    for(let i = 0; i < birdArray.length; i++)
    {
        let bird = birdArray[i];
        bird.x += -5; //bird speed
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

        if(detectCollision(dino, bird))
        {
            gameOver = true;
            dinoImg.src = "./assets/dino-dead.png";
            dinoImg.onload = function() {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            
        }
    }
}
    
    //score
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function moveDino(e){
    if(gameOver) {
        
        return;
    }
    //ensures dino cant jump if not on ground
    if(e.code == "Space" || e.code == "ArrowUp" && dino.y == dinoY) {
        velocityY = -10;
    }
    //dino cant duck if not on ground
    if(e.code == "ArrowDown" && dino.y == dinoY){
        dinoDucking = true; //this boolean allows for me to change animations
        //and dino positions when neccesary

    }

}

function replay(){ //resets everything to replay game
    gameOver = false;
    score = 0;
    cactusArray = [];
    birdArray = [];
    cloudArray = [];
}
function keyReleased(e){
    if(e.code == "ArrowDown")
    {
        //when player relases down (ducking) key, reverses height and width 
        dinoDucking = false;
        dino.y = dinoY;
        dino.width = dinoWidth;
        dino.height = dinoHeight;

    }
}

//for sprite animations
let toggle = false;
function imageChange() {
    if(gameOver) {
        return;
    }
    if(dinoDucking == false)
    {
        dinoImg.src = toggle ? "assets/dino-run1.png" : "assets/dino-run2.png";
        toggle=!toggle;
    }
    else{
        dinoImg.src = toggle ? "assets/dino-duck1.png" : "assets/dino-duck2.png";
        toggle=!toggle;
    }

    birdImg.src = toggle ? "assets/bird1.png" : "assets/bird2.png";

}

function placeBird() {
    if(gameOver){
        return;
   }
   let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
   }
   let placeBirdChance = Math.random();
   if(placeBirdChance > 0.80) //20% chance of bird spawning
   {
        birdArray.push(bird);
   }
   
   if(birdArray.length > 5)
    {
        birdArray.shift(); //removes first element from array, saves space
    }
}


function placeCloud() {
   if(gameOver){
        return;
   }
   let cloud = {
    x : cloudX,
    y : cloudY,
    width: cloudWidth,
    height: cloudHeight
}
   cloudArray.push(cloud);
    if(cloudArray.length > 5)
    {
        cloudArray.shift(); //removes first element from array, saves space
    }

}

function placeCactus() {
    if(gameOver) {
        return;
    }

    let cactus = {
        img : null,
        x : cactusX,
        y : cactusY,
        width : null,
        height : cactusHeight
    }

    let placeCactusChance = Math.random(); //choses random num up to 0.999..
    if(placeCactusChance > 0.90) //10% chance
    {
        cactus.img = cactus3Img;
        cactus.width = cactus3Width
        cactusArray.push(cactus);
    }
    else if(placeCactusChance > 0.70) //30% chance
    {
        cactus.img = cactus2Img;
        cactus.width = cactus2Width
        cactusArray.push(cactus);
    }
    else if(placeCactusChance > 0.50) //50% chance
    {
        cactus.img = cactus1Img;
        cactus.width = cactus1Width
        cactusArray.push(cactus);
    }

    if(cactusArray.length > 5)
    {
        cactusArray.shift(); //removes first element from array, saves space
    }
}

function detectCollision(a, b){
    return a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
            a.x + a.width > b.x &&// a's top right corner passes b's top left corner
            a.y < b.y + b.height &&//a's top left corner doesn't reach b's bottom left corner
            a.y + a.height > b.y;//a's bottom left corner passes b's top left corner
}
