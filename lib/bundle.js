/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const GameView = __webpack_require__(5);
	
	document.addEventListener('DOMContentLoaded', () => {
	
	  const gameView = new GameView();
	  gameView.render();
	
	});


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ function(module, exports) {

	class Ship {
	
	  constructor(options){
	    this.mass = options.mass || 1;
	    this.fillColor = options.fillColor || '#6a6ced';
	    this.radius = options.radius || 5;
	    this.position = { x: 10, y: 10 };
	    this.velocity = { speed: 0, angle: 90 };
	  }
	
	  setVelocity(newVelocity = { speed: 0, angle: 0 }){
	    this.velocity = newVelocity;
	  }
	
	  render(board){
	    const ship = new createjs.Shape();
	    ship.graphics.beginFill(this.fillColor).drawCircle(0, 0, this.radius);
	    ship.x = this.position.x;
	    ship.y = this.position.y;
	    board.addChild(ship);
	  }
	
	}
	
	module.exports = Ship;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Star = __webpack_require__(6);
	const Ship = __webpack_require__(4);
	
	class GameView {
	
	  constructor(){
	    this.board = new createjs.Stage('game-canvas');
	    this.star = new Star({});
	    this.ship = new Ship({});
	    this.canvasEl = document.getElementById('game-canvas');
	
	    this.getVectorEnd = this.getVectorEnd.bind(this);
	    this.getVectorStart = this.getVectorStart.bind(this);
	
	    this.canvasEl.addEventListener('mousedown', this.getVectorStart);
	    this.canvasEl.addEventListener('mouseup', this.getVectorEnd);
	  }
	
	  render(){
	    const board = new createjs.Stage('game-canvas');
	    this.star.render(board);
	    this.ship.render(board);
	    board.update();
	  }
	
	  getVectorStart(){
	    this.vectorStartX = event.pageX - this.canvasEl.offsetLeft;
	    this.vectorStartY = event.pageY - this.canvasEl.offsetTop;
	  }
	
	  getVectorEnd(){
	    this.vectorEndX = event.pageX - this.canvasEl.offsetLeft;
	    this.vectorEndY = event.pageY - this.canvasEl.offsetTop;
	  }
	
	  setShipVelocity(){
	    const deltaX = this.vectorEndX - this.vectorStartX;
	    const deltaY = this.vectorEndY - this.vectorStartY;
	    const newSpeed = Math.sqrt( Math.pow(deltaX, 2) + Math.pow(deltaY, 2) );
	    const newAngle = Math.atan( deltaY / deltaX );
	    this.ship.setVelocity({ speed: newSpeed, angle: newAngle });
	  }
	
	}
	
	module.exports = GameView;


/***/ },
/* 6 */
/***/ function(module, exports) {

	class Star {
	
	  constructor(options){
	    this.mass = options.mass || 300;
	    this.fillColor = options.fillColor || '#f7ff91';
	    this.radius = options.radius || 75;
	    this.position = { x: 400, y: 300 };
	  }
	
	  render(board){
	    const star = new createjs.Shape();
	    star.graphics.beginFill(this.fillColor).drawCircle(0, 0, this.radius);
	    star.x = this.position.x;
	    star.y = this.position.y;
	    board.addChild(star);
	  }
	
	}
	
	module.exports = Star;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map