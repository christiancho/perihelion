const Star = require('./star');
const Ship = require('./ship');

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
