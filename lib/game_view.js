const Star = require('./star');
const Ship = require('./ship');

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
