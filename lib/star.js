class Star {

  constructor(){
    this.mass = 400;
    this.fillColor = '#f7ff91';
    this.radius = 50;

    this.centerStar();
  }

  render(board){
    const star = new createjs.Shape();
    star.graphics.beginFill(this.fillColor).drawCircle(0, 0, this.radius);
    star.x = this.position.X;
    star.y = this.position.Y;
    board.addChild(star);
  }

  centerStar(){
    this.position = {
      X: window.innerWidth / 2,
      Y: window.innerHeight / 2
    };
  }

}

module.exports = Star;
