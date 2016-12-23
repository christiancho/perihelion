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
