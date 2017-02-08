const GameView = require('./game_view');

document.addEventListener('DOMContentLoaded', () => {

  const INSTRUCTIONS = {
    1 : {
      heading: "Introduction",
      details: "Hello, astronaut. You're stranded in a faraway stellar system but you're out of energy and can't come home. You must gather more."
    },
    2 : {
      heading: "Setting Your Course",
      details: "Click and drag your ship to set the intial speed. A red line will indicate the angle and speed of your launch."
    },
    3 : {
      heading: "Gathering Energy",
      details: "Your ship will gather energy from the star in an amount inversely proportionate to the distance to the star (the closer the more energy)."
    },
    4 : {
      heading: "Steering",
      details: "Your ship will automatically orient itself to the mouse. Hold the left mouse button to activate thrusters."
    },
    5 : {
      heading: "Going Home",
      details: "Once your energy fills up, you will use all of it to open a portal. Hit the portal to come home."
    },
    6 : {
      heading: "Resetting",
      details: "To reset the game, hit the reset button or press R."
    }
  };

  let instructionsNum = 0;

  function progressInstructions(){
    instructionsNum++;
    if (instructionsNum > 3) {
      document.getElementById('pointer-arrow').style.right = "-200px";
      document.getElementById('pointer-arrow').style.left = "";
    }
    if (instructionsNum > 5) {
      document.getElementById('modal-back').style.visibility = "hidden";
      return;
    } else if (instructionsNum === 3){
      document.getElementById('pointer-arrow').style.top = "50px";
      document.getElementById('pointer-arrow').style.left = "100px";
    }
    const instructions = INSTRUCTIONS[instructionsNum];
    document.getElementById('instructions-heading').innerHTML = instructions.heading;
    document.getElementById('instructions-details').innerHTML = instructions.details;
  }

  progressInstructions();
  document.getElementById('instructions-next').addEventListener("click", progressInstructions);
  document.getElementById('skip-instructions').addEventListener("click", () => {
    instructionsNum = 5;
    progressInstructions();
  });

  const gameView = new GameView();
  gameView.start();



});
