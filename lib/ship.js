const shipSpriteSheet = require('./ship_sprite');

class Ship {

  constructor(){
    this.mass = 1;
    this.fillColor = '#6a6ced';
    this.radius = 25;
    this.sprite = new createjs.Sprite(shipSpriteSheet, "standard");

    this.position = { X: 300, Y: 300 };
    this.velocity = { deltaX: 0, deltaY: 0 };
    this.launched = false;
    this.exploded = false;
    this.speedReducer = 0.025;
    this.rotation = 0;

    this.setupAudio();

    this.turnThrustOn = this.turnThrustOn.bind(this);
    this.turnThrustOff = this.turnThrustOff.bind(this);

    this.setWindowCenter();

    window.onkeydown = this.turnThrustOn;
    window.onkeyup = this.turnThrustOff;
  }

  setupAudio(){
    this.explosionSound = new Audio('./assets/sounds/explosion.mp3');

    this.thrusterSound = new Audio('./assets/sounds/thrusters.mp3');
    this.thrusterSound.loop = true;
    this.thrusterSound.addEventListener('timeupdate', () => {
      const buffer = 1;
      if (this.currentTime > this.duration - buffer) {
        this.currentTime = 0.5;
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
    this.sprite.regX = 25;
    this.sprite.regY = 25;
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
    this.position.X += this.velocity.deltaX;
    this.position.Y += this.velocity.deltaY;
  }

  thrustForce(){

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
    if (e.keyCode !== 32 || this.exploded) return;
    this.thrusterSound.play();
    this.thrustersActive = true;
    this.sprite.gotoAndPlay("thrust");
  }

  turnThrustOff(e){
    if (e.keyCode !== 32 || this.exploded) return;
    this.thrusterSound.pause();
    this.thrustersActive = false;
    this.sprite.gotoAndPlay("standard");
  }

  explode(){
    this.exploded = true;
    this.explosionSound.play();
    this.sprite.gotoAndPlay("explode");
  }

}

module.exports = Ship;
