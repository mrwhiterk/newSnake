var snakeArray = [];
var snakeBit;
var ctx;
var xDir = 50;
var yDir = 0;
var speed = 4;

//remove later
document.addEventListener("click", function() {
    myGameArea.reset();
})

function startGame() {
    snakeBit = new snakeBit(0, 0, 50, 50, "blue");
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

function snakeBit(x, y, width, height, color){
    this.x = x;
    this.y = y;
    // this.xDir = 50;
    // this.yDir = 50;
    this.width = width;
    this.height = height;
    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height)
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

function foodMaker(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

function updateGameArea() {
    myGameArea.clear();    
    snakeBit.newPos();
    snakeBit.update();
    document.getElementById("info").innerHTML = `x: ${snakeBit.x} y: ${snakeBit.y}`;
}

function getAllXPositions(width){
    var list = [];
    for (var i = 0; i <= myGameArea.canvas.width - width; i += width) {
        list.push(i);
    }
    return list;
}

function getAllYPositions(height) {
    var list = [];
    for (var i = 0; i <= myGameArea.canvas.height - height; i += height) {
        list.push(i);
    }
    return list;
}

function getRandFromList(list) {
    return list[Math.floor(Math.random() * list.length)]
}
