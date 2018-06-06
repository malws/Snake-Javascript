// Create the canvas
var canvas = document.createElement("canvas");
canvas.id = "Canvas";
var ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Snake image
var snakeReady = false;
var snakeImage = new Image();
snakeImage.onload = function () {
	snakeReady = true;
};
snakeImage.src = "images/snake.png";

// Game objects
var snake = {
	"x":0,
	"y":0,
	"direction": 0,
	"speed": 200
}

var board = new Array(20);
for (var i=0; i <20; i++)
    board[i] = new Array(20);
for (var i=0; i < 20; i++) {
		for(var j = 0; j < 20; j++) {
			board[i][j] = 0;
		}
}

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	if (e.keyCode == 37) { // Player press left
		if(snake.direction > 0) snake.direction--;
		else snake.direction = 3;
	 }
	 if (e.keyCode == 39) { // Player press right
		if(snake.direction < 3) snake.direction++;
		else snake.direction = 0;
	 }
}, false);


// Functions
function setSnake() {
	board[10][0] = -1;
	snake.x = 10;
	snake.y = 0;
};

function update () {
	var foundHead = false;
	for (var i=0; i < 20; i++) {
		for(var j = 0; j < 20; j++) {
			// Head update
			if(board[i][j] == -1  && !foundHead) {
				foundHead = true;
				switch (checkNext()) {
					case 1: // Snake finds apple
					break;
					case 0:
					board[snake.x][snake.y] = -1;
					board[i][j] = 0;
					break;					
					case -1:
					break;
				}
			}
		}
	}	
}

function checkNext() {
	switch (snake.direction) {
		case 1: snake.x--; break;
        case 3: snake.x++; break;
        case 2: snake.y--; break;
        case 0: snake.y++; break;
	}
	if((snake.x == -1 || snake.y == -1) || (snake.x > 19 || snake.y > 19)) return -1;	
	else if (board[snake.x][snake.y] == -2) return 1;
	else return 0;
}

function render () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}
	for (var i=0; i <20; i++) {
		for(var j = 0; j < 20; j++) {
			if(board[i][j] == -1 || board[i][j] > 0) {
				if (snakeReady) {
					ctx.drawImage(snakeImage, i * 20, j * 20);
				}
			}
		}
	}	
};

var main = function () {
	update();
	render();
};

(function init() {
	setSnake();
	var loop = setInterval(main, 200);
})();