var snakeArray = [];
var snakeBit;
var foodArray = [];
var food;
var ctx;
var xDir = 50;
var yDir = 0;
var speed = 1;
var canvasWidth = 400;
var canvasHeight = 400;
var previousPosition = {x: 0, y: 0};
var xx = 0;
var yy = 0;

document.addEventListener("click", function() {
    myGameArea.reset();
})

function startGame() {
    snakeArray.push(new SnakeBit(100, 0, 50, 50, "red"));
    snakeArray.push(new SnakeBit(0, 0, 50, 50, "blue"));
    snakeArray.push(new SnakeBit(0, 0, 50, 50, "green"));
    
    snakeBit = snakeArray[0];

    for (var i = 0; i < 0; i++){
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

           
            
            
            
        }
    }    
}



function updateGameArea() {
    myGameArea.clear();
    console.log(snakeArray);

    //var head = {x: snakeBit.x, y: snakeBit.y};
    

    // for (var i = snakeArray.length -1; i >= 0; i--)
    // {
    //     snakeArray[i].x = head.x;
    //     snakeArray[i].y = head.y;

    //     snakeArray[i].newPos();
    //     snakeArray[i].update();

    //     head.x = snakeArray[i].x;
    //     head.y = snakeArray[i].y;
    // }
    var save;
    
    console.log(snakeArray);
    for (var i = 0; i < snakeArray.length; i++){
        

        //console.log('start', snakeArray[i].x, '   coor ' + xx + " " + yy);/// 1
        if (i != 0){
            snakeArray[i].x = snakeArray[i - 1].x;
            snakeArray[i].y = snakeArray[i - 1].y;
        } 

        snakeArray[i].newPos();
        snakeArray[i].update();
        // if (i == 0) {
        //     xx = snakeArray[i].x;
        //     yy = snakeArray[i].y;

        //     snakeArray[i].newPos();
        //     snakeArray[i].update();

        //     console.log('a', snakeArray[i].x, '   coor ' + xx + " " + yy);/// 2

        // } else {
            // snakeArray[i].x = xx;
            // snakeArray[i].y = yy;

            // console.log('b', snakeArray[i].x, '   coor ' + xx + " " + yy);/// 3


            // snakeArray[i].newPos();
            // snakeArray[i].update();

            // console.log('c', snakeArray[i].x, '   coor ' + xx + " " + yy);/// 4

            // xx = snakeArray[i].x;
            // yy = snakeArray[i].y;

            // console.log("d");
        //}
        
    }
    // if (snakeArray[0].x > 150) {
    //     console.log("stu", xx + " " + yy);
    //     myGameArea.reset();
    // }
    
   
    

    

    foodArray.forEach((x) => {
        x.checkEaten();
        if(!x.isEaten) x.update();
    })
    
    //document.getElementById("info").innerHTML = `x: ${food.x} y: ${food.y}`;
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
