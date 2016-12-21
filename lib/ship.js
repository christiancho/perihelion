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
