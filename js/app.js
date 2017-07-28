/*
HTML 5 GAME:
Tools used html, css,  html 5 canvas, javascript
The HTML 5 canvas sheet: http://cheatsheetworld.com/programming/html5-canvas-cheat-sheet/
Javascript Keycodes: http://keycode.info/
*/

//draw the canvas in 2d and get canvas id
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

//By defult game will not start until enter is pressed
var gameStarted = false;

var keys = [];

//friction, gravity for jump
var friction = 0.8;
var gravity = 0.98;

var completed = false;

//The finish with door image
var door_image = new Image();
door_image.src = "img/door.png";

//character for the html 5 game
var image = new Image();
image.src = "img/character.png";

//The player
var player = {
	x: 5,
	y: canvas.height - 45,
	width: 40,
	height: 40,
	speed: 5,
	velX: 0,
	velY: 0,
	color: "#ff0000",
	jumping: false,
	grounded: false,
	jumpStrength: 7,
	position: "idle",
	draw: function(){
		startX = 40;
		if(this.position == "left"){
			startX = 0;
		} else if(this.position == "right"){
			startX = 80;
		}
		context.drawImage(image, startX, 0, 40, 40, this.x, this.y, 40, 40);
	}
}

//The goal
var goal = {
	x: canvas.width-90,
	y: 0,
	width:40,
	height:45,
	color: "#0098cb",
	draw: function(){
		context.drawImage(door_image, this.x, this.y);
	}
}

//The platforms
var platforms = [];
var platform_width = 120;
var platform_height = 10;

platforms.push({
    x: canvas.width-170,
    y: 50,
    width: platform_width,
    height: platform_height,
});
platforms.push({
    x: canvas.width-170,
    y: canvas.height-50,
    width: platform_width,
    height: platform_height,
});
platforms.push({
    x: canvas.width-380,
    y: canvas.height-120,
    width: platform_width,
    height: platform_height,
});
platforms.push({
    x: canvas.width-380,
    y: canvas.height-240,
    width: platform_width,
    height: platform_height,
});

platforms.push({
    x: canvas.width-590,
    y: canvas.height-180,
    width: platform_width,
    height: platform_height,
});

// Floor
platforms.push({
	x: 0,
	y: canvas.height-5,
	width: canvas.width,
	height: platform_height
});

// Left Wall
platforms.push({
	x: -10,
	y: 0,
	width: 10,
	height: canvas.height
});

// Left Wall
platforms.push({
	x: canvas.width,
	y: 0,
	width: 10,
	height: canvas.height
});

// Floor
platforms.push({
	x: 0,
	y: -10,
	width: canvas.width,
	height: platform_height
});

//listen for when enter key is  triggered
document.body.addEventListener("keydown", function(event){

	if(event.keyCode == 13 && !gameStarted){
		startGame();
	}
	if(event.keyCode == 13 && completed){
		reset();
	}
	keys[event.keyCode] = true;

});

//listen for when  the up keys are  triggered
document.body.addEventListener("keyup", function(event){
	keys[event.keyCode] = false;
});

//start the intro screen
intro_screen();

//Intro screen stying
function intro_screen(){
	context.font = "50px Impact";
	context.fillStyle = "#FFFFFF";
	context.textAlign = "center";
	context.fillText("HTML5 Game", canvas.width/2, canvas.height/2);

	context.font = "20px Arial";
	context.fillText("Press Enter To Start", canvas.width/2, canvas.height/2 + 50);
}

//start game if the enter key is triggered

function startGame(){
	gameStarted = true;
	clearCanvas();

	requestAnimationFrame(loop);

}

//if game is complete show this finish screen
function complete(){
	clearCanvas();
	completed = true;

	context.font = "50px Impact";
	context.fillStyle = "#FFFFFF";
	context.textAlign = "center";
	context.fillText("Congrats! You've Won!", canvas.width/2, canvas.height/2);

	context.font = "20px Arial";
	context.fillText("Press Enter to Play Again", canvas.width/2, canvas.height/2 + 50);
}


//if game is reset postion canvas back to normal
function reset(){
	player.x = 5;
	player.y = canvas.height-25;
	player.grounded = true;
	player.velY = 0;
	player.velX = 0;
	completed = false;

	requestAnimationFrame(loop);
}


//Draw platforms

function draw_platforms(){
	context.fillStyle = "#907020";

	for(var i = 0; i < platforms.length; i++){
		context.fillRect(platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
		context.lineWidth = 5;
		context.strokeStyle = "#90D030";
		context.strokeRect(platforms[i].x, platforms[i].y-2, platforms[i].width, 5);
	}
}

function loop(){

	clearCanvas();
	draw_platforms();
	player.draw();
	goal.draw();

	player.position = "idle";

	if(keys[38] || keys[32]){
		if(!player.jumping){
			player.velY = -player.jumpStrength*2;
			player.jumping = true;
		}
	}

	if(keys[39]){
		player.position = "right";
		if(player.velX < player.speed){
			player.velX+=2;
		}
	}

	if(keys[37]){
		player.position = "left";
		if(player.velX > -player.speed){
			player.velX-=2;
		}
	}

	player.x += player.velX;
	player.y += player.velY;

	player.velX *= friction;
	player.velY += gravity;

	player.grounded = false;
	for(var i = 0; i < platforms.length; i++){
		var direction = collisionCheck(player, platforms[i]);

		if(direction == "left" || direction == "right"){
			player.velX = 0;
		} else if(direction == "bottom"){
			player.jumping = false;
			player.grounded = true;
		} else if(direction == "top"){
			player.velY *= -1;
		}

	}

	if(player.grounded){
		player.velY = 0;
	}

	if(collisionCheck(player, goal)){
		complete();
	}

	if(!completed){
		requestAnimationFrame(loop);
	}

}


//cheack collision between the charater and the platforms

function collisionCheck(character, platform){

	var vectorX = (character.x + (character.width/2)) - (platform.x + (platform.width/2));
	var vectorY = (character.y + (character.height/2)) - (platform.y + (platform.height/2));

	var halfWidths = (character.width/2) + (platform.width/2);
	var halfHeights = (character.height/2) + (platform.height/2);

	var collisionDirection = null;

	if(Math.abs(vectorX) < halfWidths && Math.abs(vectorY) < halfHeights){

		var offsetX = halfWidths - Math.abs(vectorX);
		var offsetY = halfHeights - Math.abs(vectorY);
		if(offsetX < offsetY){

			if (vectorX > 0){
				collisionDirection = "left";
				character.x += offsetX;
			} else {
				collisionDirection = "right";
				character.x -= offsetX;
			}

		} else {

			if (vectorY > 0){
				collisionDirection = "top";
				character.y += offsetY;
			} else {
				collisionDirection = "bottom";
				character.y -= offsetY;
			}

		}

	}

	return collisionDirection;

}

// clear the canvas styling
function clearCanvas(){
	context.clearRect(0, 0, 640, 360);
}
