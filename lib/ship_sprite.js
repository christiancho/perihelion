const spriteData = {
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

const shipSpriteSheet = new createjs.SpriteSheet(spriteData);

module.exports = shipSpriteSheet;
