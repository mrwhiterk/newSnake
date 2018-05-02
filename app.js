var snakeArray = [];
var snakeBit;
var foodArray = [];
var food;
var ctx;
var xDir = 50;
var yDir = 0;
var speed = 2;
var canvasWidth = 400;
var canvasHeight = 400;
var previousPosition = {x: 0, y: 0};

//remove later
document.addEventListener("click", function() {
    myGameArea.reset();
})

function startGame() {
    snakeBit = new SnakeBit(0, 0, 50, 50, "blue");
    snakeArray.push(snakeBit);
    for (var i = 0; i < 2; i++){
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
        snakeBit.x = 0;
        clearInterval(this.interval);
    }
    
}

function SnakeBit(x, y, width, height, color){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    this.grow = function(){
        var newSnakeBit = new SnakeBit(previousPosition.x, previousPosition.y, 50, 50, `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`);
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
    }
    this.isEaten = false;
    this.checkEaten = function() {
         if (snakeBit.x + snakeBit.width > this.x && snakeBit.x < this.x + this.width &&
        snakeBit.y + snakeBit.height > this.y && snakeBit.y < this.y + this.height && this.isEaten == false) {
            this.isEaten = true;
             foodArray.push(new foodMaker(50, 50, "red"));
            //test ///////////////
            
             
            snakeArray[snakeArray.length - 1].grow();

           
            
            
            console.log(snakeArray);
        }
    }    
}

function updateGameArea() {
    myGameArea.clear();

    var head = {x: snakeBit.x, y: snakeBit.y};
    // snakeBit.newPos();
    // snakeBit.update();

    snakeArray.forEach((snakeBlock, index) => {
        //var oldPosition = {x: snakeBlock[snakeArray.length-1].x, y: snakeBlock[snakeArray.length-1].y}
        // if (index != 1){
            console.log(index);
            snakeBlock.x = head.x;
            snakeBlock.y = head.y;
            console.log('head x and y before', head.x, head.y);
            snakeBlock.newPos();
            snakeBlock.update();
            head.x = snakeBlock.x;
            head.y = snakeBlock.y;
            console.log('head x and y after', head.x, head.y);
        // }
        
    })

    foodArray.forEach((x) => {
        x.checkEaten();
        if(!x.isEaten) x.update();
    })
    
    document.getElementById("info").innerHTML = `x: ${food.x} y: ${food.y}`;
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
