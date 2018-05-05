var snakeArray = [];
var snakeBit;
var foodArray = [];
var food;
var ctx;
var xDir = 50;
var yDir = 0;
var speed = 3;
var canvasWidth = 400;
var canvasHeight = 400;
var previousPosition = {x: 0, y: 0};
var xx = 0;
var yy = 0;
var moves = [];
var coord = {};

document.addEventListener("click", function() {
    myGameArea.reset();
})

function startGame() {
    snakeArray.push(new SnakeBit(100, 0, 50, 50, "black"));
    
    
    snakeBit = snakeArray[0];

    for (var i = 0; i < 1; i++){
        food = new foodMaker(50, 50, "red");
        foodArray.push(food);
    }
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 400;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 1000/speed);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    reset: function() {
        clearInterval(this.interval);
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
        var newSnakeBit = new SnakeBit(previousPosition.x, previousPosition.y, 50, 50, 'black');
            snakeArray.push(newSnakeBit);
    }

    this.newPos = function() {
        window.addEventListener('keyup', (e) => {
            if (e.keyCode == 37) {
                xDir = -50;
                yDir = 0;
            }
            else if (e.keyCode == 39) {
                xDir = 50;
                yDir = 0;
            }
            else if (e.keyCode == 38) {
                xDir = 0;
                yDir = -50;
            }
            if (e.keyCode == 40) {
                xDir = 0;
                yDir = 50;
            }
        })
        this.x += xDir;
        this.y += yDir;

        //wall check
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
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width - 4, this.height - 4)
    }
    this.isEaten = false;
    this.checkEaten = function() {
         if (snakeBit.x + snakeBit.width > this.x && snakeBit.x < this.x + this.width &&
        snakeBit.y + snakeBit.height > this.y && snakeBit.y < this.y + this.height && this.isEaten == false) {
            this.isEaten = true;
            foodArray.push(new foodMaker(50, 50, "black"));
            snakeArray[snakeArray.length - 1].grow();

           
            
            
            
        }
    }    
}



function updateGameArea() {
    myGameArea.clear();
    
    snakeBit.newPos();
    snakeBit.update();

    coord = {x: snakeBit.x, y: snakeBit.y};
    moves.push(coord);
    
    if(snakeBit.touchingSelf()) {
        console.log(snakeBit.touchingSelf());
        myGameArea.reset();
    };
    console.log('snake bit ', snakeBit.touchingSelf());

    for (var i = 1; i < snakeArray.length; i++){
        snakeArray[i].x = moves[moves.length - 1 - i].x;
        snakeArray[i].y = moves[moves.length - 1 - i].y;
        snakeArray[i].update();

        
    }

    foodArray.forEach((x) => {
        x.checkEaten();
        if(!x.isEaten) x.update();
    })
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
