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
	    this.mass = 1;
	    this.fillColor = '#6a6ced';
	    this.radius = 10;
	    this.position = { X: 25, Y: 25 };
	    this.velocity = { speed: 0, angle: 0 };
	  }
	
	  setVelocity(newVelocity = { speed: 0, angle: 0 }){
	    this.velocity = newVelocity;
	    console.log(`New speed: ${ this.velocity.speed }`);
	    console.log(`New angle: ${ this.velocity.angle * 180 / Math.PI }`);
	  }
	
	  render(board){
	    const ship = new createjs.Shape();
	    ship.graphics.beginFill(this.fillColor).drawCircle(0, 0, this.radius);
	    ship.x = this.position.X;
	    ship.y = this.position.Y;
	    board.addChild(ship);
	  }
	
	  clicked( mousePosition = { X: 0, Y: 0 } ){
	    const diffX = Math.abs( mousePosition.X - this.position.X );
	    const diffY = Math.abs( mousePosition.Y - this.position.Y );
	    return ( diffX <= this.radius && diffY <= this.radius );
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
	    this.star = new Star();
	    this.ship = new Ship();
	    this.canvasEl = document.getElementById('game-canvas');
	    this.shipDrag = false;
	
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
	
	  setShipDrag( mousePosition = { X: 0, Y: 0 } ){
	    if ( this.ship.clicked(mousePosition) ){
	      this.shipDrag = true;
	    }
	  }
	
	  getVectorStart(){
	    const mouseX = event.pageX - this.canvasEl.offsetLeft;
	    const mouseY = event.pageY - this.canvasEl.offsetTop;
	    this.vectorStartX = mouseX;
	    this.vectorStartY = mouseY;
	    this.setShipDrag( { X: mouseX, Y: mouseY } );
	  }
	
	  getVectorEnd(){
	    this.vectorEndX = event.pageX - this.canvasEl.offsetLeft;
	    this.vectorEndY = event.pageY - this.canvasEl.offsetTop;
	    if ( this.shipDrag ) {
	      this.shipDrag = false;
	      this.setShipVelocity();
	    }
	  }
	
	  setShipVelocity(){
	    const deltaX = this.vectorEndX - this.vectorStartX;
	    const deltaY = this.vectorEndY - this.vectorStartY;
	    const newSpeed = Math.sqrt( Math.pow(deltaX, 2) + Math.pow(deltaY, 2) );
	    const newAngle = Math.atan( deltaX / deltaY );
	    this.ship.setVelocity({ speed: newSpeed, angle: newAngle });
	  }
	
	}
	
	module.exports = GameView;


/***/ },
/* 6 */
/***/ function(module, exports) {

	class Star {
	
	  constructor(options){
	    this.mass = 300;
	    this.fillColor = '#f7ff91';
	    this.radius = 75;
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