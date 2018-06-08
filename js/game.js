// Create the canvas
var canvas = document.createElement("canvas");
canvas.id = "Canvas";
var ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;
document.getElementById("game-screen").appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Snake head image
var snakeHeadReady = false;
var snakeHeadImage = new Image();
snakeHeadImage.onload = function () {
	snakeHeadReady = true;
};
snakeHeadImage.src = "images/head.png";

// Snake body image
var snakeReady = false;
var snakeImage = new Image();
snakeImage.onload = function () {
	snakeReady = true;
};
snakeImage.src = "images/snake.png";

// Apple image
var appleReady = false;
var appleImage = new Image();
appleImage.onload = function () {
	appleReady = true;
};
appleImage.src = "images/apple.png";

// Mine image
var mineReady = false;
var mineImage = new Image();
mineImage.onload = function () {
	mineReady = true;
};
mineImage.src = "images/mine.png";

var mineX = 0;
var mineY = 0;

// Game objects
var snake = {
	"x":0,
	"y":0,
	"direction": 0,
	"tail": 0,
	"speed": 0
}

var applesEaten;
var board;

// Handle keyboard controls
var userInput; // Flag that prevents multiple direction changes in one cycle (could occur if user not only press, but holds the key down)
var paused;

addEventListener("keydown", function (e) {
	if (e.keyCode == 37 && userInput && !paused) { // Player press left
		userInput = false;
		if (snake.direction != 3) snake.direction = 1;
	}
	if (e.keyCode == 38 && userInput && !paused) { // Player press up
		userInput = false;
		if (snake.direction != 0) snake.direction = 2;
	}
	if (e.keyCode == 39 && userInput && !paused) { // Player press right
		userInput = false;
		if (snake.direction != 1) snake.direction = 3;
	}	
	if (e.keyCode == 40 && userInput && !paused) { // Player press down
		userInput = false;
		if (snake.direction != 2) snake.direction = 0;
	}
	if (e.keyCode == 32 && userInput) { // Player press space
		if (paused) {
			paused = false;
			loop = setInterval(main, snake.speed);
			document.getElementById("bgquit").style.display = "none";
		}
		else {
			paused = true;
			clearInterval(loop);
			ctx.fillStyle = "rgb(250, 250, 250)";
			ctx.font = "50px Verdana";
			ctx.fillText("||", 175, 150);
			document.getElementById("bgquit").style.display = "block";
		}
	}
}, false);

var loop;
var mines;

// Functions
function init() {
	board = new Array(20);
	for (var i=0; i <20; i++) board[i] = new Array(20);
	for (var i=0; i < 20; i++) {
		for(var j = 0; j < 20; j++) {
			board[i][j] = 0;
		}
	}
	userInput = false; // Flag that prevents multiple direction changes in one cycle (could occur if user not only press, but holds the key down)
	paused = false;
	applesEaten = 0;
	setSnake();
	setApple();
	loop = setInterval(main, snake.speed);
	mines = setInterval(setMine, 30000);
}

function setSnake() {
	board[10][0] = -1;
	snake.x = 10;
	snake.y = 0;
	snake.tail = 0;
	snake.direction = 0;
	snake.speed = 300;
};

function setApple () {
	if (snake.tail > 397) end(); // If snake is above 397 long, there is no free space on the board to set an apple
	var x = Math.floor((Math.random() * 20));
	var y = Math.floor((Math.random() * 20));
	if(board[x][y] == 0) board[x][y] = -2;
	else setApple();
};

function setMine () {
	if (snake.tail > 397) return;
	if(board[mineX][mineY] == -3) board[mineX][mineY] = 0;
	mineX = Math.floor((Math.random() * 20));
	mineY = Math.floor((Math.random() * 20));
	if(board[mineX][mineY] == 0) board[mineX][mineY] = -3;
	else setMine();
};

function update () {
	var foundHead = false;
	for (var i=0; i < 20; i++) {
		for(var j = 0; j < 20; j++) {
			if(board[i][j] != 0) { // Checks only non-empty fields
				// Tail update
				if(board[i][j] == snake.tail) board[i][j] = 0;
				else if((board[i][j] >= 1) && (board[i][j] < snake.tail)) board[i][j]++;
				
				// Head update
				if(board[i][j] == -1  && !foundHead) {
					foundHead = true;
					switch (checkNext()) {
						case 1:
						setApple();
						applesEaten++;
						snake.tail++;
						if((snake.tail % 5) == 0) {
							clearInterval(loop);
							snake.speed /= 1.25;
							loop = setInterval(main, snake.speed);
						}
						case 0:
						board[snake.x][snake.y] = -1;
						if(snake.tail > 0) board[i][j] = 1;
						else board[i][j] = 0;
						break;					
						case -1:
						return false;
					}
				}
			}			
		}
	}
	userInput = true;
	return true;
}

function checkNext() {
	switch (snake.direction) {
		case 1: snake.x--; break;
        case 3: snake.x++; break;
        case 2: snake.y--; break;
        case 0: snake.y++; break;
	}
	if((snake.x == -1 || snake.y == -1) || (snake.x > 19 || snake.y > 19)) return -1;
	else if (board[snake.x][snake.y] == -3) {
		board[mineX][mineY] = 0;
		return -1;
	}
	else if (board[snake.x][snake.y] > 0) return -1;	
	else if (board[snake.x][snake.y] == -2) {
		board[snake.x][snake.y] = 0;
		return 1;
	}
	else return 0;
}

function render () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}
	for (var i=0; i <20; i++) {
		for(var j = 0; j < 20; j++) {
			if(board[i][j] != 0) { // Rendering only non empty fields
				if(board[i][j] == -1) {
					if (snakeHeadReady) {
						ctx.drawImage(snakeHeadImage, snake.direction * 20, 0, 20, 20, i * 20, j * 20, 20, 20);
					}
				}
				else if(board[i][j] > 0) {
					if (snakeReady) {
						ctx.drawImage(snakeImage, i * 20, j * 20);
					}
				}
				else if(board[i][j] == -2) {
					if (appleReady) {
						ctx.drawImage(appleImage, i * 20, j * 20);
					}
				}
				else if(board[i][j] == -3) {
					if (mineReady) {
						ctx.drawImage(mineImage, i * 20, j * 20);
					}
				}
			}
			
		}
	}	

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "18px Verdana";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + applesEaten, 10, 10);
};

var main = function () {
	if (update()) render();
	else end();
};