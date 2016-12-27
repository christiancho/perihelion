class LaunchVector {

  constructor(){
    this.active = false;
    this.line = new createjs.Shape();
  }

  setStartPosition(mousePosition){
    this.startPosition = mousePosition;
    this.active = true;
  }

  updateMousePosition(mousePosition){
    this.endPosition = mousePosition;
  }

  render(board){
    if ( !this.active ) return;
    this.line.graphics.clear();
    this.line.graphics.beginStroke("#AA0000");
    this.line.graphics.setStrokeStyle(1);
    this.line.graphics.moveTo(this.startPosition.X, this.startPosition.Y);
    this.line.graphics.lineTo(this.endPosition.X, this.endPosition.Y);
    board.addChild(this.line);
  }

}

module.exports = LaunchVector;
