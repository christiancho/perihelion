const GameView = require('./game_view');

document.addEventListener('DOMContentLoaded', () => {

  const INSTRUCTIONS = {
    1 : {
      heading: "Introduction",
      details: "Hello, Astronaut. You're stranded in a faraway stellar system but you're out of energy and can't come home. You must gather more.",
      imageUrl: ""
    },
    2 : {
      heading: "Setting Your Course",
      details: "Click and drag your ship to set the intial speed. A red line will indicate the angle and speed of your launch.",
      imageUrl: ""
    },
    3 : {
      heading: "Gathering Energy",
      details: "Your ship will gather energy from the star in an amount inversely proportionate to the distance to the star (the closer the more energy).",
      imageUrl: ""
    },
    4 : {
      heading: "Steering",
      details: "Your ship will automatically orient itself to the mouse. Hold the left mouse button to active thrusters.",
      imageUrl: ""
    },
    5 : {
      heading: "Going Home",
      details: "Once your enery fills up, you will use all of it to open a portal. Hit the portal to come home.",
      imageUrl: ""
    }
  };

  let instructionsNum = 0;

  function progressInstructions(){
    instructionsNum++;
    if (instructionsNum > 5) {
      document.getElementById('modal-back').style.visibility = "hidden";
      return;
    }
    const instructions = INSTRUCTIONS[instructionsNum];
    document.getElementById('instructions-heading').innerHTML = "";
    document.getElementById('instructions-details').innerHTML = "";
    document.getElementById('instructions-image').src = "";
    document.getElementById('instructions-heading').innerHTML = instructions.heading;
    document.getElementById('instructions-details').innerHTML = instructions.details;
    document.getElementById('instructions-image').src = instructions.imageUrl;
  }

  progressInstructions();
  document.getElementById('instructions-next').addEventListener("click", progressInstructions);

  const gameView = new GameView();
  gameView.start();



});
