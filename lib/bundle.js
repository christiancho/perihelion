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
	
	  const INSTRUCTIONS = {
	    1 : {
	      heading: "Introduction",
	      details: "Hello, astronaut. You're stranded in a faraway stellar system but you're out of energy and can't come home. You must gather more."
	    },
	    2 : {
	      heading: "Setting Your Course",
	      details: "Click and drag your ship to set the intial speed. A red line will indicate the angle and speed of your launch."
	    },
	    3 : {
	      heading: "Gathering Energy",
	      details: "Your ship will gather energy from the star in an amount inversely proportionate to the distance to the star (the closer the more energy)."
	    },
	    4 : {
	      heading: "Steering",
	      details: "Your ship will automatically orient itself to the mouse. Hold the left mouse button to activate thrusters."
	    },
	    5 : {
	      heading: "Going Home",
	      details: "Once your energy fills up, you will use all of it to open a portal. Hit the portal to come home."
	    }
	  };
	
	  let instructionsNum = 0;
	
	  function progressInstructions(){
	    instructionsNum++;
	    if (instructionsNum > 3) {
	      document.getElementById('pointer-arrow').style.right = "-200px";
	      document.getElementById('pointer-arrow').style.left = "";
	    }
	    if (instructionsNum > 5) {
	      document.getElementById('modal-back').style.visibility = "hidden";
	      return;
	    } else if (instructionsNum === 3){
	      document.getElementById('pointer-arrow').style.top = "50px";
	      document.getElementById('pointer-arrow').style.left = "100px";
	    }
	    const instructions = INSTRUCTIONS[instructionsNum];
	    document.getElementById('instructions-heading').innerHTML = instructions.heading;
	    document.getElementById('instructions-details').innerHTML = instructions.details;
	  }
	
	  progressInstructions();
	  document.getElementById('instructions-next').addEventListener("click", progressInstructions);
	  document.getElementById('skip-instructions').addEventListener("click", () => {
	    instructionsNum = 5;
	    progressInstructions();
	  });
	
	  document.getElementById('game-over').addEventListener("click", () => {
	    document.getElementById('game-over').style.visibility = "hidden";
	    document.getElementById('game-over-message').innerHTML = "";
	    document.getElementById('pointer-arrow').style.right = "100px";
	  });
	
	  const gameView = new GameView();
	  gameView.start();
	
	
	
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Star = __webpack_require__(2);
	const Ship = __webpack_require__(3);
	const Portal = __webpack_require__(4);
	const LaunchVector = __webpack_require__(5);
	
	class GameView {
	
	  constructor(){
	    this.board = new createjs.Stage('game-canvas');
	
	    this.star = new Star();
	    this.ship = new Ship();
	    this.portal = new Portal();
	    this.launchVector = new LaunchVector();
	
	    this.canvasEl = document.getElementById('game-canvas');
	    this.shipDrag = false;
	    this.gravitationalConstant = 0.5;
	
	    this.getVectorEnd = this.getVectorEnd.bind(this);
	    this.getVectorStart = this.getVectorStart.bind(this);
	    this.handleMouseUp = this.handleMouseUp.bind(this);
	    this.handleMouseDown = this.handleMouseDown.bind(this);
	    this.setCanvasSize = this.setCanvasSize.bind(this);
	    this.updateMousePosition = this.updateMousePosition.bind(this);
	    this.tick = this.tick.bind(this);
	    this.resetGame = this.resetGame.bind(this);
	
	    this.setupAudio();
	
	    this.canvasEl.addEventListener('mousedown', this.handleMouseDown);
	    this.canvasEl.addEventListener('mouseup', this.handleMouseUp);
	
	    document.getElementById('reset-button').addEventListener('mousedown', this.resetGame);
	
	    window.onload = window.onresize = this.setCanvasSize;
	    window.onmousemove = this.updateMousePosition;
	
	  }
	
	  handleMouseDown(){
	    if ( this.ship.launched ) {
	      this.ship.turnThrustOn();
	    } else {
	      this.getVectorStart();
	    }
	  }
	
	  handleMouseUp(){
	    if ( this.ship.launched ) {
	      this.ship.turnThrustOff();
	    } else {
	      this.getVectorEnd();
	    }
	  }
	
	  setupAudio(){
	    this.bgMusic = new Audio('./assets/sounds/main_theme.mp3');
	    this.bgMusic.loop = true;
	  }
	
	  start() {
	    this.ticker = createjs.Ticker;
	    this.ticker.setFPS(30);
	    this.ticker.on("tick", this.tick);
	
	    this.bgMusic.play();
	  }
	
	  render(){
	    this.board.removeAllChildren();
	    this.star.render(this.board);
	    this.ship.render(this.board);
	    if ( this.ship.energy === 200 && !this.portal.open ) {
	      this.ship.energy = 0;
	      this.portal.appear();
	    }
	    this.portal.render(this.board);
	    this.launchVector.render(this.board);
	    this.board.update();
	  }
	
	  resetGame(e){
	    this.ticker.setFPS(30);
	    this.ship = new Ship();
	    this.portal = new Portal();
	    document.getElementById('pointer-arrow').style.right = "-200px";
	  }
	
	  updateMousePosition(event){
	    this.mousePosition = {
	      X: event.pageX,
	      Y: event.pageY
	    };
	    this.launchVector.updateMousePosition(this.mousePosition);
	  }
	
	  updateShipRotation(){
	    this.ship.updateRotation(this.mousePosition);
	  }
	
	  updateShipEnergy(){
	    if ( this.ship.energy >= 200 || !this.ship.launched ) return;
	    const distance = this.distanceBetween(this.ship, this.star);
	    const addedEnergy = ( 20 * this.star.mass ) / Math.pow( distance, 2 );
	    this.ship.updateEnergy(addedEnergy);
	  }
	
	  updateEnergyMeter(){
	    document.getElementById('energy-level').style.width = `${ this.ship.energy }px`;
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
	      this.launchVector.setStartPosition( mousePosition );
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
	      this.launchVector.active = false;
	    }
	  }
	
	  setShipVelocity(){
	    const deltaX = this.vectorEndX - this.vectorStartX;
	    const deltaY = this.vectorEndY - this.vectorStartY;
	    this.ship.setInitVelocity( deltaX, deltaY );
	  }
	
	  distanceBetween(obj1, obj2){
	    const deltaX = obj1.position.X - obj2.position.X;
	    const deltaY = obj1.position.Y - obj2.position.Y;
	    return Math.sqrt( Math.pow(deltaX, 2) + Math.pow(deltaY, 2) );
	  }
	
	  gravitationalNormal(){
	    return (
	      ( this.gravitationalConstant * this.ship.mass * this.star.mass ) /
	      Math.pow( this.distanceBetween(this.ship, this.star), 2)
	    );
	  }
	
	  tick(event){
	    const gForce = {
	      normal: this.gravitationalNormal(),
	      deltaX: this.star.position.X - this.ship.position.X,
	      deltaY: this.star.position.Y - this.ship.position.Y
	    };
	    this.ship.changePosition( gForce );
	    this.updateShipRotation();
	    this.updateEnergyMeter();
	    this.updateShipEnergy();
	    this.render();
	
	    if ( this.starShipCollide() && !this.ship.exploded ){
	      this.ship.explode();
	      document.getElementById("game-over-message").innerHTML = "You never made it home...";
	      document.getElementById("game-over").style.visibility = "visible";
	      this.ticker.setFPS(0);
	    }
	
	    if ( this.shipPortalCollide() && this.portal.open && !this.ship.teleported ) {
	      this.portal.closePortal();
	      this.ship.teleport();
	      document.getElementById("game-over-message").innerHTML = "Welcome home, astronaut.";
	      document.getElementById("game-over").style.visibility = "visible";
	      this.ticker.setFPS(0);
	    }
	
	  }
	
	  starShipCollide(){
	    return ( this.distanceBetween(this.ship, this.star) <=
	      this.star.radius );
	  }
	
	  shipPortalCollide(){
	    return ( this.distanceBetween(this.ship, this.portal) <=
	      this.portal.radius );
	  }
	
	}
	
	module.exports = GameView;


/***/ },
/* 2 */
/***/ function(module, exports) {

	class Star {
	
	  constructor(){
	    this.mass = 400;
	    this.fillColor = '#f7ff91';
	    this.radius = 50;
	
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

	const shipSprite = {
	  images: ["./assets/images/spaceship.png"],
	  frames: { width: 50, height: 50 },
	  animations: {
	    none: [7],
	    standard: [13],
	    thrust: {
	      frames: [0, 13]
	    },
	    explode: [30, 36, 'none']
	  }
	};
	
	const shipSpriteSheet = new createjs.SpriteSheet(shipSprite);
	
	class Ship {
	
	  constructor(){
	    this.mass = 1;
	    this.fillColor = '#6a6ced';
	    this.radius = 25;
	    this.sprite = new createjs.Sprite(shipSpriteSheet, "standard");
	
	    this.reset();
	
	    this.thrustForce = 0.3;
	    this.speedReducer = 0.015;
	
	    this.setupAudio();
	
	    this.turnThrustOn = this.turnThrustOn.bind(this);
	    this.turnThrustOff = this.turnThrustOff.bind(this);
	
	    this.setWindowCenter();
	  }
	
	  reset(){
	    this.position = {
	      X: window.innerWidth / 2 - 250,
	      Y: window.innerHeight / 2 - 250
	    };
	    this.velocity = { deltaX: 0, deltaY: 0 };
	    this.launched = false;
	    this.exploded = false;
	    this.teleported = false;
	    this.rotation = 0;
	    this.energy = 0;
	    this.sprite.gotoAndPlay("standard");
	  }
	
	  setupAudio(){
	    this.explosionSound = new Audio('./assets/sounds/explosion.mp3');
	
	    this.thrusterSound = new Audio('./assets/sounds/thrusters.mp3');
	    this.thrusterSound.loop = true;
	    this.thrusterSound.addEventListener('timeupdate', () => {
	      if (this.currentTime > this.duration - 1) {
	        this.currentTime = 1;
	      }
	    });
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
	    this.sprite.x = this.position.X;
	    this.sprite.y = this.position.Y;
	    this.sprite.regX = this.radius;
	    this.sprite.regY = this.radius;
	    board.addChild(this.sprite);
	  }
	
	  clicked( mousePosition = { X: 0, Y: 0 } ){
	    if ( this.launched ) return false;
	    const diffX = Math.abs( mousePosition.X - this.position.X );
	    const diffY = Math.abs( mousePosition.Y - this.position.Y );
	    return ( diffX <= this.radius && diffY <= this.radius );
	  }
	
	  changePosition( gForce ){
	    if ( !this.launched || this.exploded ) return;
	    const gNormal = gForce.normal;
	    this.velocity.deltaX += gForce.deltaX * gNormal;
	    this.velocity.deltaY += gForce.deltaY * gNormal;
	    if ( this.thrustersActive && this.energy > 0 ) this.addThrustForce();
	    this.position.X += this.velocity.deltaX;
	    this.position.Y += this.velocity.deltaY;
	  }
	
	  addThrustForce(){
	    const angle = this.rotation * ( Math.PI / 180 );
	    const deltaX = Math.cos(angle) * this.thrustForce;
	    const deltaY = Math.sin(angle) * this.thrustForce;
	    this.velocity.deltaX += deltaX;
	    this.velocity.deltaY += deltaY;
	    if ( this.energy > 0 ) this.energy -= 0.1;
	    if ( this.energy <= 0 ) {
	      this.thrusterSound.pause();
	      this.thrustersActive = false;
	      this.sprite.gotoAndPlay("standard");
	    }
	  }
	
	  updateRotation(mousePosition){
	    if ( !this.launched || this.exploded ) return;
	    const deltaX = mousePosition.X - this.position.X;
	    const deltaY = mousePosition.Y - this.position.Y;
	    let angle = Math.atan( deltaY / deltaX ) * ( 180 / Math.PI);
	    if (deltaX < 0) angle += 180;
	    this.rotation = angle;
	    this.sprite.rotation = this.rotation;
	  }
	
	  updateEnergy(addedEnergy){
	    if ( this.exploded ) return;
	    this.energy += addedEnergy;
	    if ( this.energy >= 200 ) this.energy = 200;
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
	
	  turnThrustOn(e){
	    if ( this.teleported || this.exploded || !this.launched || this.energy <= 0 ) return;
	    this.thrusterSound.play();
	    this.thrustersActive = true;
	    this.sprite.gotoAndPlay("thrust");
	  }
	
	  turnThrustOff(e){
	    if ( this.teleported || this.exploded || !this.launched || this.energy <= 0 ) return;
	    this.thrusterSound.pause();
	    this.thrustersActive = false;
	    this.sprite.gotoAndPlay("standard");
	  }
	
	  explode(){
	    this.exploded = true;
	    this.explosionSound.play();
	    this.thrusterSound.pause();
	    this.sprite.gotoAndPlay("explode");
	  }
	
	  teleport(){
	    this.sprite.gotoAndPlay("none");
	    this.teleported = true;
	  }
	
	}
	
	module.exports = Ship;


/***/ },
/* 4 */
/***/ function(module, exports) {

	const portalSprite = {
	  images: ["./assets/images/portal.png"],
	  frames: { width: 96, height: 96 },
	  animations: {
	    appear: [0, 4, 'stable'],
	    stable: {
	      frames: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 13, 12, 11, 10, 9, 8, 7, 6]
	    },
	    disappear: [15, 23, 'none'],
	    none: [24]
	  }
	};
	
	const portalSpriteSheet = new createjs.SpriteSheet(portalSprite);
	
	class Portal {
	
	  constructor(){
	    this.radius = 48;
	    this.sprite = new createjs.Sprite(portalSpriteSheet);
	    this.open = false;
	    this.position = {
	      X: 0,
	      Y: 0
	    };
	
	    this.setupAudio();
	  }
	
	  setupAudio(){
	    this.teleportSound = new Audio("./assets/sounds/teleport.mp3");
	  }
	
	  appear(){
	    const randomAngle = Math.random() * 0.5 * Math.PI;
	    this.open = true;
	    let deltaX = Math.cos( randomAngle ) * 300;
	    let deltaY = Math.sin( randomAngle ) * 300;
	    deltaX = ( Math.random() >= 0.5 ) ? deltaX : deltaX * -1;
	    deltaY = ( Math.random() >= 0.5 ) ? deltaY : deltaY * -1;
	    this.position = {
	      X: window.innerWidth / 2 + deltaX,
	      Y: window.innerHeight / 2 + deltaY
	    };
	    this.sprite.gotoAndPlay("appear");
	    this.teleportSound.play();
	  }
	
	  render(board){
	    if ( !this.open ) return;
	    this.sprite.x = this.position.X;
	    this.sprite.y = this.position.Y;
	    this.sprite.regX = this.radius;
	    this.sprite.regY = this.radius;
	    board.addChild(this.sprite);
	  }
	
	  openPortal(){
	    this.open = true;
	  }
	
	  closePortal(){
	    this.sprite.gotoAndPlay("disappear");
	    this.teleportSound.currentTime = 3.75;
	    this.teleportSound.play();
	  }
	
	}
	
	module.exports = Portal;


/***/ },
/* 5 */
/***/ function(module, exports) {

	class LaunchVector {
	
	  constructor(){
	    this.active = false;
	    this.line = new createjs.Shape();
	  }
	
	  setStartPosition(mousePosition){
	    this.startPosition = mousePosition;
	    this.active = true;
	  }
	
	  updateMousePosition(mousePosition){
	    this.endPosition = mousePosition;
	  }
	
	  render(board){
	    if ( !this.active ) return;
	    this.line.graphics.clear();
	    this.line.graphics.beginStroke("#AA0000");
	    this.line.graphics.setStrokeStyle(1);
	    this.line.graphics.moveTo(this.startPosition.X, this.startPosition.Y);
	    this.line.graphics.lineTo(this.endPosition.X, this.endPosition.Y);
	    board.addChild(this.line);
	  }
	
	}
	
	module.exports = LaunchVector;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map