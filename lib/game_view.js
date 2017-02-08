const Star = require('./star');
const Ship = require('./ship');
const Portal = require('./portal');
const LaunchVector = require('./launch_vector');

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

    document.addEventListener('keypress', this.resetGame);

    document.getElementById('reset-button').addEventListener('mousedown', this.resetGame);
    document.getElementById('game-over').addEventListener("click", (e) => {
      document.getElementById('game-over').style.visibility = "hidden";
      document.getElementById('game-over-message').innerHTML = "";
      this.resetGame(e);
    });

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
    if (e.key != "r") return;
    this.ticker.setFPS(30);
    this.ship = new Ship();
    this.portal = new Portal();
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
