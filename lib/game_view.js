const Star = require('./star');
const Ship = require('./ship');

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