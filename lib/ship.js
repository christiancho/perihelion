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

    this.thrustForce = 0.1;
    this.speedReducer = 0.025;

    this.setupAudio();

    this.turnThrustOn = this.turnThrustOn.bind(this);
    this.turnThrustOff = this.turnThrustOff.bind(this);

    this.setWindowCenter();

    window.onkeydown = this.turnThrustOn;
    window.onkeyup = this.turnThrustOff;
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
    if ( e.keyCode !== 32 || this.exploded || !this.launched || this.energy <= 0 ) return;
    this.thrusterSound.play();
    this.thrustersActive = true;
    this.sprite.gotoAndPlay("thrust");
  }

  turnThrustOff(e){
    if ( e.keyCode !== 32 || this.exploded || !this.launched || this.energy <= 0 ) return;
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
