class Star {

  constructor(options){
    this.mass = 300;
    this.fillColor = '#f7ff91';
    this.radius = 75;
    this.position = { x: 400, y: 300 };
  }

  render(board){
    const star = new createjs.Shape();
    star.graphics.beginFill(this.fillColor).drawCircle(0, 0, this.radius);
    star.x = this.position.x;
    star.y = this.position.y;
    board.addChild(star);
  }

}

module.exports = Star;
