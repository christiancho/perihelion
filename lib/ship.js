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
