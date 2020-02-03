/*
* @Author: root
* @Date:   2020-01-30 23:30:09
* @Last Modified by:   root
* @Last Modified time: 2020-02-03 19:02:04
*/
var GameConfig = function() {
	this.MapSize   = 50;
	this.MoveDires = [1, 0];
}
GameConfig.prototype.updateMoveDires = function(x, y) {
	this.MoveDires = [x, y];
}
var Snake = function(n) {
	this.Body = new Array();
	this.Food = new Array();
	this.GameMap;
	this.getSnakeBody = function() {
		return this.Body;
	}	
	var config = new GameConfig();
	var draw   = new Draw();
}
Snake.prototype.InitGameMap = function(MapSize) {
	this.GameMap = new Array(MapSize);
	for(let i=0; i<MapSize; i++) {
		this.GameMap[i] = new Array(MapSize);
		this.GameMap[i].fill("-");
	}
}
Snake.prototype.InitSnakeBody = function() {
	return this.Body = [[1, 0], [0, 0]];
}
Snake.prototype.InitSnake = function() {
	let Body = this.getSnakeBody();
	this.GameMap[Body[0][0]][Body[0][1]] = "*"; 
	draw.drawRole(Body[0][0]+0.5, Body[0][1]+0.5, 5, "red");
	for(let i=1; i<Body.length; i++) {
		draw.drawRole(Body[i][0]+0.5, Body[i][1]+0.5, 5, "blue");
		this.GameMap[Body[i][0]][Body[i][1]] = "*"; 
	}
}
Snake.prototype.createFood = function() {
	this.Food[0] = parseInt((Math.random()*config.MapSize).toString(10));
	this.Food[1] = parseInt((Math.random()*config.MapSize).toString(10));
	if(this.GameMap[this.Food[0]][this.Food[1]] == "-") {
		this.GameMap[this.Food[0]][this.Food[1]] = "0";
		draw.drawRole(this.Food[0]+0.5, this.Food[1]+0.5, 5, "yellow");
	}else
		this.createFood();
}
Snake.prototype.reMap = function(newHead, clearTail) {
	this.GameMap[newHead[0]][newHead[1]]   = "*";
	this.GameMap[clearTail[0]][clearTail[1]] = "-";	
}
Snake.prototype.MoveSnake = function(map, direction) {
	var head   = this.Body[0];
	switch(direction) {
		case "up":config.updateMoveDires(0, -1); break;
		case "down":config.updateMoveDires(0, 1); break;
		case "left":config.updateMoveDires(-1, 0); break;
		case "right":config.updateMoveDires(1, 0); break;
	}
	let dires = config.MoveDires;
	let x = head[0] + dires[0];
	let y = head[1] + dires[1];
	if(!isTransboundary(map, x, y) || this.GameMap[x][y]=="*")
		console.log("Game Over!");
	if(isTransboundary(map, x, y) && (map[x][y]=="-" || map[x][y]=="0")) {
		let tail = (this.Body).pop();	// clear old tail;
		this.eatFood(x, y, tail);
		this.Body.unshift(new Array(x, y)); // insert new head;
		this.reMap(new Array(x, y), tail); // update game map;
		reDrawSnake(new Array(x, y), this.Body[1], tail);
	}
	function isTransboundary(map, x, y) {
		if(x>=0 && x<map.length && y>=0 && y<map[0].length) 
			return true;
		return false;
	}
	function reDrawSnake(newHead, oldHead, clearTail) {
		draw.drawRole(newHead[0]+0.5, newHead[1]+0.5, 5, "red");
		draw.drawRole(oldHead[0]+0.5, oldHead[1]+0.5, 5, "blue");
		draw.clearRole(clearTail[0]+0.5, clearTail[1]+0.5);
	}
}
Snake.prototype.eatFood = function(x, y, tail) {
	if(this.GameMap[x][y] == "0") {
		this.Body.push(tail);
		draw.drawRole(tail[0]+0.5, tail[1]+0.5, 5, "blue");
		this.createFood();	
	}
}

var Draw = function(ctx) {
	this.drawMap = function(MapSize) {
		for(let i=0; i<=MapSize; i++) {
			ctx.moveTo(i*10, 0);
			ctx.lineTo(i*10, MapSize*10);
			ctx.moveTo(0, i*10);
			ctx.lineTo(MapSize*10, i*10);
			ctx.stroke();
		}
	}
}
Draw.prototype.drawRole = function(x, y, r, color) {
	ctx.beginPath();
	ctx.arc(x*10,y*10, r, 0, 2*Math.PI);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.stroke();
}
Draw.prototype.clearRole = function(x, y) {
	ctx.beginPath();
	ctx.clearRect((x-0.5)*10, (y-0.5)*10, 10, 10);
	ctx.moveTo((x-0.5)*10, (y-0.5)*10);
    ctx.lineTo((x-0.5)*10+10, (y-0.5)*10);
    ctx.lineTo((x-0.5)*10+10, (y-0.5)*10+10);
    ctx.lineTo((x-0.5)*10, (y-0.5)*10+10);
    ctx.lineTo((x-0.5)*10, (y-0.5)*10);
	ctx.stroke();
}
var canvas = document.getElementById("box");
var ctx = canvas.getContext("2d");

var config = new GameConfig();
var snake  = new Snake();
var draw   = new Draw(ctx);

draw.drawMap(config.MapSize);
snake.InitSnakeBody();
snake.InitGameMap(config.MapSize);
snake.InitSnake();
snake.createFood();


document.onkeydown = function(event) {
	var e = event || window.event || arguments.callee.caller.arguments[0];
	if(e && e.keyCode == 37) snake.MoveSnake(snake.GameMap, "left");
	if(e && e.keyCode == 38) snake.MoveSnake(snake.GameMap, "up");
	if(e && e.keyCode == 39) snake.MoveSnake(snake.GameMap, "right");
	if(e && e.keyCode == 40) snake.MoveSnake(snake.GameMap, "down");
}
setInterval("selfMove()", 50);
function selfMove() {
	snake.MoveSnake(snake.GameMap, NextPath(snake.GameMap, snake.Body[0], snake.Food));
}
function NextPath(map, snakePS, foodPS) {
	var ps = BFS(map, snakePS, foodPS);
	ps[0] = ps[0] - snakePS[0];
	ps[1] = ps[1] - snakePS[1];
	if(ps.length !=0) {
		if(ps[0] == -1 && ps[1] ==0) return "left";
		if(ps[0] == 1 && ps[1] ==0) return "right";
		if(ps[0] == 0 && ps[1] ==-1) return "up";
		if(ps[0] == 0 && ps[1] ==1) return "down";
	}
}
function BFS(map, snakePS, foodPS) {
	var dires = [[-1,  0], [ 1,  0], [ 0, -1], [ 0,  1]];
	var flag = new Array();
	for(let i=0; i<config.MapSize; i++) {
		flag[i] = new Array(config.MapSize);
		flag[i].fill(0);
	}
	var que = new Array();
	que.push(new Array(snakePS[0], snakePS[1], 1));
	while(que.length != 0) {
		let ps = que.shift();
		flag[ps[0]][ps[1]] = ps[2];
		if(map[ps[0]][ps[1]] == "0")
			return getPath(flag, ps[0], ps[1]);
		for(let i=0; i<dires.length; i++) {
			let x = ps[0] + dires[i][0];
			let y = ps[1] + dires[i][1];
			if(Transboundary(map, x, y) && map[x][y]!="*" && flag[x][y]==0) {
				que.push(new Array(x, y, ps[2]+1));
				flag[x][y] = ps[2] + 1;
			}
		}
	}
}
function getPath(flag, x, y) {
	var dires = [[-1,  0], [ 1,  0], [ 0, -1], [ 0,  1]];
	var que = new Array();
	que.push(new Array(x, y, flag[x][y]));
	while(que.length) {
		let ps = que.shift();
		if(ps[2] == 2)
			return ps;
		for(let i=0; i<dires.length; i++) {
			let x = ps[0] + dires[i][0];
			let y = ps[1] + dires[i][1];
			if(Transboundary(flag, x, y) && flag[x][y]==ps[2]-1) {
				que.push(new Array(x, y, ps[2]-1));
				break;
			}
		}
	}
}
function Transboundary(map, x, y) {
	if(x>=0 && x<map.length && y>=0 && y<map[0].length) 
		return true;
	return false;
}
