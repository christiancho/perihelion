# Perihelion

Perihelion is a space-based JavaScript game about finding your way home. It uses the Easel.js library and features a minimalist game aesthetic.

[Live version](http://christiancho.tech/perihelion)

![alt text](https://raw.githubusercontent.com/christiancho/perihelion/gh-pages/docs/screenshots/perihelion.png "Screenshot")

## Play Instructions

To begin the game, click and drag the ship to set the initial trajectory. The gravity of the star in the middle will always be active and set the ship in orbit if the ship has enough initial velocity. The ship will charge its energy as it passes by the star. Once the energy is full, all of it will be used to open a portal in a random location. Once the ship touches the portal, the game is over. To maneuver the ship, press space to activate the thrusters toward the mouse position.

## Technologies Used

#### [Easel.js](http://www.createjs.com/easeljs)

A component of the Create.js library, Easel.js facilitates the rendering of elements onto the HTML5 canvas element. It allows for the rendering of basic shapes and includes a way to utilize sprite sheets. Both the `Ship` and the `Portal` class use sprite sheets:

```javascript
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
```

## Technical Implementation

### Gravity

Newton's law of universal gravitation:
![alt text](https://wikimedia.org/api/rest_v1/media/math/render/svg/8c6ee5510ba3c7d6664775c0e76b53e72468303a "Newton's law of universal gravitation")

This formula was used to calculate the force of the star's gravity on the ship. While our universe's actual gravitational constant (G) is `6.67408(31) x 10¹¹m³kg⁻¹s⁻²`, the game's G is stored as a simple float value in the `GameView` class as `this.gravitationalConstant`. This allows for quick adjustments to the game's overall physical properties.

```javascript
distanceBetween(obj1, obj2){
  const deltaX = obj1.position.X - obj2.position.X;
  const deltaY = obj1.position.Y - obj2.position.Y;
  return Math.sqrt( Math.pow(deltaX, 2) + Math.pow(deltaY, 2) );
}

gravitationalNormal(){
  return (
    ( this.gravitationalConstant * this.ship.mass * this.star.mass ) /
    Math.pow( this.distanceBetween(this.ship, this.star), 2)
  );
}
```

### Thrust

Some trigonometry was needed to calculate the x and y forces of the ship's thrust. As the mouse moves around the page, the `ship`'s `rotation` property is updated:

```javascript
updateRotation(mousePosition){
  if ( !this.launched || this.exploded ) return;
  const deltaX = mousePosition.X - this.position.X;
  const deltaY = mousePosition.Y - this.position.Y;
  let angle = Math.atan( deltaY / deltaX ) * ( 180 / Math.PI);
  if (deltaX < 0) angle += 180;
  this.rotation = angle;
  this.sprite.rotation = this.rotation;
}
```

Once the angle has been updated, the thrust of the ship can be calculated:

```javascript
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
```

#### Style & Implementation

The overall mood of the game is designed to emphasize the desolation of space, and appropriate to the theme, I used the piano version of the main theme from a popular movie. All audio is played using JavaScript's native `Audio` class. An example from the `Portal` class:

```javascript
setupAudio(){
  this.teleportSound = new Audio("./assets/sounds/teleport.mp3");
}

closePortal(){
  this.sprite.gotoAndPlay("disappear");
  this.teleportSound.currentTime = 3.75;
  this.teleportSound.play();
}
```

### To-Do

- [ ] Refine the physics to create highly elliptical and stable orbits.
- [ ] Create multiple levels.
- [ ] Add more than one object to include planets and asteroids.
