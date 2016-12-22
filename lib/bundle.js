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

	const GameView = __webpack_require__(1);
	
	document.addEventListener('DOMContentLoaded', () => {
	
	  const gameView = new GameView();
	  gameView.start();
	
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Star = __webpack_require__(2);
	const Ship = __webpack_require__(3);
	
	class GameView {
	
	  constructor(){
	    this.board = new createjs.Stage('game-canvas');
	    this.star = new Star();
	    this.ship = new Ship();
	    this.canvasEl = document.getElementById('game-canvas');
	    this.shipDrag = false;
	    this.gravitationalConstant = 0.5;
	
	    this.getVectorEnd = this.getVectorEnd.bind(this);
	    this.getVectorStart = this.getVectorStart.bind(this);
	    this.setCanvasSize = this.setCanvasSize.bind(this);
	    this.tick = this.tick.bind(this);
	
	    this.canvasEl.addEventListener('mousedown', this.getVectorStart);
	    this.canvasEl.addEventListener('mouseup', this.getVectorEnd);
	
	    window.onload = window.onresize = this.setCanvasSize;
	
	  }
	
	  start() {
	    this.timer = setInterval( this.tick, 17 );
	  }
	
	  render(){
	    this.board.removeAllChildren();
	    this.star.render(this.board);
	    this.ship.render(this.board);
	    this.board.update();
	  }
	
	  setCanvasSize(){
	    this.canvasEl.width = window.innerWidth;
	    this.canvasEl.height = window.innerHeight;
	    this.star.centerStar();
	    this.ship.changeOnResize();
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
	    this.ship.setInitVelocity( deltaX, deltaY );
	  }
	
	  distanceBetween(){
	    const deltaX = this.ship.position.X - this.star.position.X;
	    const deltaY = this.ship.position.Y - this.star.position.Y;
	    return Math.sqrt( Math.pow(deltaX, 2) + Math.pow(deltaY, 2) );
	  }
	
	  gravitationalNormal(){
	    return (
	      ( this.gravitationalConstant * this.ship.mass * this.star.mass ) /
	      Math.pow( this.distanceBetween(), 2)
	    );
	  }
	
	  tick(){
	    const gForce = {
	      normal: this.gravitationalNormal(),
	      deltaX: this.star.position.X - this.ship.position.X,
	      deltaY: this.star.position.Y - this.ship.position.Y
	    };
	    this.ship.changePosition( gForce );
	    this.render();
	    if ( this.didCollide() ){
	      console.log("COLLISION!");
	      clearInterval( this.timer );
	    }
	  }
	
	  didCollide(){
	    return ( this.distanceBetween() <= this.ship.radius + this.star.radius );
	  }
	
	}
	
	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports) {

	class Star {
	
	  constructor(){
	    this.mass = 300;
	    this.fillColor = '#f7ff91';
	    this.radius = 75;
	    
	    this.centerStar();
	  }
	
	  render(board){
	    const star = new createjs.Shape();
	    star.graphics.beginFill(this.fillColor).drawCircle(0, 0, this.radius);
	    star.x = this.position.X;
	    star.y = this.position.Y;
	    board.addChild(star);
	  }
	
	  centerStar(){
	    this.position = {
	      X: window.innerWidth / 2,
	      Y: window.innerHeight / 2
	    };
	  }
	
	}
	
	module.exports = Star;


/***/ },
/* 3 */
/***/ function(module, exports) {

	class Ship {
	
	  constructor(){
	    this.mass = 1;
	    this.fillColor = '#6a6ced';
	    this.radius = 10;
	    this.position = { X: 100, Y: 100 };
	    this.velocity = { deltaX: 5, deltaY: -10 };
	    this.launched = false;
	    this.speedReducer = 0.025;
	
	    this.setWindowCenter();
	  }
	
	  setWindowCenter(){
	    this.windowCenterX = window.innerWidth / 2;
	    this.windowCenterY = window.innerHeight / 2;
	  }
	
	  setInitVelocity( deltaX, deltaY ){
	    this.launched = true;
	    this.velocity = {
	      deltaX: deltaX * this.speedReducer,
	      deltaY: deltaY * this.speedReducer
	    };
	  }
	
	  render(board){
	    const ship = new createjs.Shape();
	    ship.graphics.beginFill(this.fillColor).drawCircle(0, 0, this.radius);
	    ship.x = this.position.X;
	    ship.y = this.position.Y;
	    board.addChild(ship);
	  }
	
	  clicked( mousePosition = { X: 0, Y: 0 } ){
	    if ( this.launched ) return false;
	    const diffX = Math.abs( mousePosition.X - this.position.X );
	    const diffY = Math.abs( mousePosition.Y - this.position.Y );
	    return ( diffX <= this.radius && diffY <= this.radius );
	  }
	
	  changePosition( gForce ){
	    if ( !this.launched ) return;
	    const gNormal = gForce.normal;
	    this.velocity.deltaX += gForce.deltaX * gNormal;
	    this.velocity.deltaY += gForce.deltaY * gNormal;
	    this.position.X += this.velocity.deltaX;
	    this.position.Y += this.velocity.deltaY;
	  }
	
	  changeOnResize(){
	    const distX = this.windowCenterX - this.position.X;
	    const distY = this.windowCenterY - this.position.Y;
	    this.setWindowCenter();
	    this.position = {
	      X: this.windowCenterX - distX,
	      Y: this.windowCenterY - distY
	    };
	  }
	
	}
	
	module.exports = Ship;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map