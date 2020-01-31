/*
* @Author: root
* @Date:   2020-01-30 23:30:09
* @Last Modified by:   root
* @Last Modified time: 2020-02-01 03:07:33
*/
var foodPS = new Array();
var MoveDirection = [1, 0];
var Snake = function() {
	var body = new Array();
}
Snake.prototype.InitSnakeBody = function() { 
	let arr = [[1, 0], [0, 0]];
	return body = arr;
}
Snake.prototype.getSnakeBody = function() {
	//console.log(body);
	return body;
}
Snake.prototype.MoveSnake = function(map, direction) {
	var head = body[0];
	//console.log(direction, head);
	switch(direction) {
		case "up"	: 
			MoveDirection[0] = 0;
			MoveDirection[1] = -1;
			if(!Transboundary(map, head[0], head[1]-1) || map[head[0]][head[1]-1] == "*") 
				console.log("Game Over!");
			if (Transboundary(map, head[0], head[1]-1) &&
				map[head[0]][head[1]-1] == "-" ||
				map[head[0]][head[1]-1] == "0" ) {
				var bodyEnd = body.pop();
				eatFood(head[0], head[1]-1, bodyEnd);
				body.unshift(new Array(head[0], head[1]-1));
				reDrawSnake(body[0], head, bodyEnd);
			}
			if(direction == "down") direction = "up";
			break;
		case "down"	: 
			MoveDirection[0] = 0;
			MoveDirection[1] = 1;
			if(!Transboundary(map, head[0], head[1]+1) || map[head[0]][head[1]+1] == "*") 
				console.log("Game Over!");
			if(Transboundary(map, head[0], head[1]+1)&&
				map[head[0]][head[1]+1] == "-" ||
				map[head[0]][head[1]+1] == "0" ) {
				var bodyEnd = body.pop();
				eatFood(head[0], head[1]+1, bodyEnd);
				body.unshift(new Array(head[0], head[1]+1));
				reDrawSnake(body[0], head, bodyEnd);
			}
			if(direction == "up") direction = "down";
			break;
		case "left" : 
			if(!Transboundary(map, head[0]-1, head[1]) || map[head[0]-1][head[1]] == "*") 
				console.log("Game Over!");
			MoveDirection[0] = -1;
			MoveDirection[1] = 0;
			if(Transboundary(map, head[0]-1, head[1])&&
				map[head[0]-1][head[1]] == "-" ||
				map[head[0]-1][head[1]] == "0" ) {
				var bodyEnd = body.pop();
				eatFood(head[0]-1, head[1], bodyEnd);
				body.unshift(new Array(head[0]-1, head[1]));
				reDrawSnake(body[0], head, bodyEnd);
			}
			if(direction == "right") direction = "left";
			break;
		case "right": 
			if(!Transboundary(map, head[0]+1, head[1]) || map[head[0]+1][head[1]] == "*") 
				console.log("Game Over!");
			MoveDirection[0] = 1;
			MoveDirection[1] = 0;
			if(Transboundary(map, head[0]+1, head[1])&&
				map[head[0]+1][head[1]] == "-" ||
				map[head[0]+1][head[1]] == "0" ) {
				var bodyEnd = body.pop();
				eatFood(head[0]+1, head[1], bodyEnd);
				body.unshift(new Array(head[0]+1, head[1]));
				reDrawSnake(body[0], head, bodyEnd);
			}
			if(direction == "left") direction = "right";
			break;
	}
	//console.log(body);
	function eatFood(x, y, bodyEnd) {
		//console.log(map[x][y]);
		if(map[x][y] == "0") {
			body.push(bodyEnd);
			eatFood1(bodyEnd);
			createFood();
		}
	}
	/*function selfMove() {
		if(Transboundary(map, head[0]+MoveDirection[0], head[1]+MoveDirection[1])&&
			map[head[0]+MoveDirection[0]][head[1]+MoveDirection[1]] == "-" ||
			map[head[0]+MoveDirection[0]][head[1]+MoveDirection[1]] == "0" ) {
			var bodyEnd = body.pop();
			eatFood(head[0]+MoveDirection[0], head[1]+MoveDirection[1], bodyEnd);
			body.unshift(new Array(head[0]+MoveDirection[0], head[1]+MoveDirection[1]));
			reDrawSnake(body[0], head, bodyEnd);
		}
	}*/
	function Transboundary(map, x, y) {
		if(x>=0 && x<map.length && y>=0 && y<map[0].length)
			return true;
		return false;
	}
}
var GameMap = function() {
	let map = new Array();
	for(let i=0; i<50; i++) {
		map[i] = [];
		for(let j=0; j<50; j++) {
			map[i][j] = "-";
		}
	}
	
	let canvas = document.getElementById("box");
	let ctx    = canvas.getContext("2d");
	var snake  = new Snake();
	
	this.getMap = function() {
		return map;
	}
	this.DrawMap = function() {
		let snakeXY = snake.InitSnakeBody();
		for(let i=0; i<=50; i++) {
			ctx.moveTo(i*10, 0);
			ctx.lineTo(i*10, 500);
			ctx.moveTo(0, i*10);
			ctx.lineTo(500, i*10);
			ctx.stroke();
		}
		
		map[snakeXY[0][0]][snakeXY[0][1]] = "*";
		this.drawInitSnake(snakeXY[0][0]+0.5, snakeXY[0][1]+0.5, 5, "red");
		for(let i=1; i<snakeXY.length; i++) {
			let x = snakeXY[i][0]+0.5;
			let y = snakeXY[i][1]+0.5;
			this.drawInitSnake(x, y, 5, "blue");
			map[snakeXY[i][0]][snakeXY[i][1]] = "*";
		}
		
	}
	this.drawInitSnake = function(x, y, r, color) {
		ctx.beginPath();
		ctx.arc(x*10,y*10, r, 0, 2*Math.PI);
		ctx.fillStyle = color;
		ctx.fill();
		ctx.stroke();
	}
	this.clearSnake = function(x, y) {
		ctx.beginPath();
		ctx.clearRect((x-0.5)*10, (y-0.5)*10, 10, 10);
		ctx.moveTo((x-0.5)*10, (y-0.5)*10);
        ctx.lineTo((x-0.5)*10+10, (y-0.5)*10);
        ctx.lineTo((x-0.5)*10+10, (y-0.5)*10+10);
        ctx.lineTo((x-0.5)*10, (y-0.5)*10+10);
        ctx.lineTo((x-0.5)*10, (y-0.5)*10);
		ctx.stroke();
	}
	this.reMap = function(newHead, clearEnd) {
		map[newHead[0]][newHead[1]]   = "*";
		map[clearEnd[0]][clearEnd[1]] = "-";			
	}
	this.DrawSnake = function(SnakeBody) {
		//var x = 
	}
}

var gmap  = new GameMap();
var snake = new Snake();
gmap.DrawMap();
gmap.DrawSnake();
var m = gmap.getMap();

setInterval("selfMove1()", 1);
function selfMove1() {

	if(MoveDirection[0]==-1 && MoveDirection[1]==0) direction = "left";
	if(MoveDirection[0]==0 && MoveDirection[1]==-1) direction = "up";
	if(MoveDirection[0]==1 && MoveDirection[1]==0) direction = "right";
	if(MoveDirection[0]==0 && MoveDirection[1]==1) direction = "down";


	var snake_body = snake.getSnakeBody();
	//console.log("getbody", snake_body[0], foodPS);
	//console.log("??", BFSPath(m, snake_body[0], foodPS));
	snake.MoveSnake(m, BFSPath(m, snake_body[0], foodPS));

	//snake.MoveSnake(m, direction);	
}

function reDrawSnake(newHead, oldHead, clearEnd) {
	gmap.drawInitSnake(newHead[0]+0.5, newHead[1]+0.5, 5, "red");
	gmap.drawInitSnake(oldHead[0]+0.5, oldHead[1]+0.5, 5, "blue");
	gmap.clearSnake(clearEnd[0]+0.5, clearEnd[1]+0.5);
	gmap.reMap(newHead, clearEnd);
	//console.clear();
	//showMap();
}
function eatFood1(bodyEnd) {
	gmap.drawInitSnake(bodyEnd[0]+0.5, bodyEnd[1]+0.5, 5, "blue");
}

createFood();
function createFood() {
	if(foodPS.length != 0) {
		gmap.clearSnake(foodPS[0]+0.5, foodPS[1]+0.5);
		m[foodPS[0]][foodPS[1]] = "-";
	}
	foodPS[0] = parseInt((Math.random()*49).toString(10));
	foodPS[1] = parseInt((Math.random()*49).toString(10));
	
	if(m[foodPS[0]][foodPS[1]] == "-") {
		m[foodPS[0]][foodPS[1]] = "0";
		gmap.drawInitSnake(foodPS[0]+0.5, foodPS[1]+0.5, 5, "yellow");
		//console.log(foodPS[0], foodPS[1]);
		//showMap();
	}else
		createFood();
}
$(document).ready(function() {
	document.onkeydown = function(event) {
		var e = event || window.event || arguments.callee.caller.arguments[0];
		if(e && e.keyCode == 37) snake.MoveSnake(gmap.getMap(), "left");
		if(e && e.keyCode == 38) snake.MoveSnake(gmap.getMap(), "up");
		if(e && e.keyCode == 39) snake.MoveSnake(gmap.getMap(), "right");
		if(e && e.keyCode == 40) snake.MoveSnake(gmap.getMap(), "down");
	}
});
function showMap() {
	for(let i=0; i<50; i++) {
		let s = "";
		for(let j=0; j<m[0].length; j++) {
			s = s + m[j][i] ;
		}
		console.log(s+" "+i);
	}
}
/*##############################################################*/
var dires = [[-1,  0], [ 1,  0], [ 0, -1], [ 0,  1]];
function BFSPath(map, snakePS, foodPS) {
	var ps = BFS(map, snakePS, foodPS);

	//console.log("----", ps);
	ps[0] = ps[0] - snakePS[0];
	ps[1] = ps[1] - snakePS[1];
	//console.log("!!!", ps);
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
	for(let i=0; i<50; i++) {
		flag[i] = [];
		for(let j=0; j<50; j++)
			flag[i][j] = 0; 
	}
	var que = new Array();
	que.push(new Array(snakePS[0], snakePS[1], 1));
	while(que.length != 0) {
		var ps = que.shift();
		flag[ps[0]][ps[1]] = ps[2];
		if(map[ps[0]][ps[1]] == "0"){
			return getPath(flag, ps[0], ps[1]);
			break;
		}
		for(let i=0; i<dires.length; i++) {
			if( Transboundary1(m, ps[0]+dires[i][0], ps[1]+dires[i][1]) &&
				m[ps[0]+dires[i][0]][ps[1]+dires[i][1]] != "*" &&
				flag[ps[0]+dires[i][0]][ps[1]+dires[i][1]] == 0 ) {

				que.push(new Array(ps[0]+dires[i][0], ps[1]+dires[i][1], ps[2]+1));
				flag[ps[0]+dires[i][0]][ps[1]+dires[i][1]] = ps[2] + 1;
			}
		}
	}
}
function getPath(nums, x, y) {
	var dires = [[-1,  0], [ 1,  0], [ 0, -1], [ 0,  1]];
	var result = new Array();
	var que = new Array();
	que.push(new Array(x, y, nums[x][y]));
	while(que.length != 0) {
		var ps = que.shift();
		if(ps[2] == 2)
			return ps;
		for(let i=0; i<dires.length; i++) {
			if( Transboundary1(nums, ps[0]+dires[i][0], ps[1]+dires[i][1]) &&
				nums[ps[0]+dires[i][0]][ps[1]+dires[i][1]] == ps[2]-1 ) {
				que.push(new Array(ps[0]+dires[i][0], ps[1]+dires[i][1], ps[2]-1));
				break;			
			}
		}
	}
}
function Transboundary1(map, x, y) {
	if(x>=0 && x<map.length && y>=0 && y<map[0].length)
		return true;
	return false;
}