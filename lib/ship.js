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
