var snakeArray = [];
var snakeBit;
var foodArray = [];
var food;
var foodWidth = 40;
var foodHeight = 40;
var foodMovementSpeed = 10;
var ctx;

var xDir = 50;
var yDir = 0;
var snakeHeadDirection = "right";
var speed = 4;

var isGameOver = false;

var canvasWidth = 800;
var canvasHeight = 800;
var moves = [];
var coord = {};
var gameMode = 2;


function startGame() {
    snakeArray.push(new SnakeBit(0, 0, 50, 50, "black"));
    snakeBit = snakeArray[0];

    for (var i = 0; i < 10; i++){
        food = new foodMaker(foodWidth, foodHeight, "black");
        foodArray.push(food);
    }
    myGameArea.start();
}

var myGameArea = {
    
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 800;
        this.canvas.height = 800;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 1000/speed);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    reset: function() {
        clearInterval(this.interval);
        setTimeout(function() {
            alert("Game Over");

        }, 500);
    }
}

function SnakeBit(x, y, width, height, color){
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = width;
    this.height = height;
    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.width - 4, this.height - 4)
    }
    this.grow = function(){
        var newSnakeBit = new SnakeBit(0, 0, 50, 50, 'black');
            snakeArray.push(newSnakeBit);
    }

    this.newPos = function() {
        var left = function(){
            xDir = -50;
            yDir = 0;
            snakeHeadDirection = "left";
        };
        var up = function(){
            xDir = 0;
            yDir = -50;
            snakeHeadDirection = "up";
        };
        var down = function(){
            xDir = 0;
            yDir = 50;
            snakeHeadDirection = "down";
        };
        var right = function(){
            xDir = 50;
            yDir = 0;
            snakeHeadDirection = "right";
        };

        
        
        window.addEventListener('keyup', (e) => {
            if (e.keyCode == 37 && snakeHeadDirection != "right") {
                left();
            }
            else if (e.keyCode == 39 && snakeHeadDirection != "left") {
                right();
            }
            else if (e.keyCode == 38 && snakeHeadDirection != "down") {
                up();
            }
            if (e.keyCode == 40 && snakeHeadDirection != "up") {
                down();
            }
        })
        this.x += xDir;
        this.y += yDir;

        //wall check
        if (gameMode == 1) {
            if (this.x + this.width > myGameArea.canvas.width) {
                this.x = 0;
            } else if (this.y + this.height > myGameArea.canvas.height) {
                this.y = 0;
            } else if (this.x < 0) {
                this.x = myGameArea.canvas.width - this.width;
            } else if (this.y < 0) {
                this.y = myGameArea.canvas.height - this.height;
            } 
        } else {
            if (this.x + this.width > myGameArea.canvas.width) {
                myGameArea.reset();
            } else if (this.y + this.height > myGameArea.canvas.height) {
                myGameArea.reset();
            } else if (this.x < 0) {
                myGameArea.reset();
            } else if (this.y < 0) {
                myGameArea.reset();
            } 
        }
        
    }

    this.touchingSelf = () => {
        var total = 0;
        snakeArray.forEach((item) => {
            if (item.x == this.x && item.y == this.y) {
                total++;
            }
        });
        return total > 1;
    }
}

function foodMaker(width, height, color) {
    this.x = getRandFromList(getAllXPositions(width));
    this.y = getRandFromList(getAllYPositions(height));
    this.width = width;
    this.height = height;
    this.setDirection = function(){
        var dir = Math.random();
        if (dir < .25) {
            return "left";
        } else if (dir < .50) {
            return "up";
        } else if (dir < .75) {
            return "right";
        } else {
            return "down";
        } 
    };
    this.direction = this.setDirection();
    this.update = function () {
        ctx = myGameArea.context;

        snakeArray.forEach((snakePiece) => {
            while (this.x == snakePiece.x && this.y == snakePiece.y ){
                this.x = getRandFromList(getAllXPositions(width));
                this.y = getRandFromList(getAllYPositions(height));
            }
        })

        //create scurrying effect from food
        if(this.direction == "left") this.x -= foodMovementSpeed;
        if(this.direction == "up") this.y -= foodMovementSpeed;
        if(this.direction == "right") this.x += foodMovementSpeed;
        if(this.direction == "down") this.y += foodMovementSpeed;
        console.log(this.direction);


        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width - 4, this.height - 4)

        if (this.x + this.width > myGameArea.canvas.width) {
            this.x = 0;
        } else if (this.y + this.height > myGameArea.canvas.height) {
            this.y = 0;
        } else if (this.x < 0) {
            this.x = myGameArea.canvas.width - this.width;
        } else if (this.y < 0) {
            this.y = myGameArea.canvas.height - this.height;
        } 
    }
    this.isEaten = false;
    this.checkEaten = function() {
         if (snakeBit.x + snakeBit.width > this.x && snakeBit.x < this.x + this.width &&
        snakeBit.y + snakeBit.height > this.y && snakeBit.y < this.y + this.height && this.isEaten == false) {
            this.isEaten = true;
            foodArray.push(new foodMaker(foodWidth, foodHeight, "black"));
            snakeArray[snakeArray.length - 1].grow();

        }
    }    
}



function updateGameArea() {
    myGameArea.clear();
    
    snakeBit.update();
    snakeBit.newPos();
    
    //save every snake head move to an array
    coord = {x: snakeBit.x, y: snakeBit.y};
    moves.push(coord);
    
    if(snakeBit.touchingSelf()) {
        myGameArea.reset();
    };
    
    

    for (var i = 1; i < snakeArray.length; i++){
        snakeArray[i].x = moves[moves.length - 2 - i].x;
        snakeArray[i].y = moves[moves.length - 2 - i].y;
        snakeArray[i].update();
    }

    foodArray.forEach((food) => {
        food.checkEaten();
        if(!food.isEaten) {
            
            
            food.update();

        }
    })

    $("#score").text(snakeArray.length - 1);

    
}

function getAllXPositions(width){
    var list = [];
    for (var i = 0; i <= canvasWidth - width; i += width) {
        list.push(i);
    }
    return list;
}

function getAllYPositions(height) {
    var list = [];
    for (var i = 0; i <= canvasHeight - height; i += height) {
        list.push(i);
    }
    return list;
}

function getRandFromList(list) {
    return list[Math.floor(Math.random() * list.length)]
}
