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

var board = new Array(20);
for (var i=0; i <20; i++)
    board[i] = new Array(20);
for (var i=0; i < 20; i++) {
		for(var j = 0; j < 20; j++) {
			board[i][j] = 0;
		}
}

function update () {	
}

function render () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}
};

var main = function () {
	update();
	render();
};

(function init() {
	var loop = setInterval(main, 200);
})();