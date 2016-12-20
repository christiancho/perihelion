# Perihelion

## Background

Perihelion is a JavaScript game about recharging a spaceship by flying it close to a star but not too close to damage the ship. It will rely heavily on Newtonian laws of gravitational attraction and give players just one chance to slingshot a ship around a star. The shot will be considered successful if the ship recharges an acceptable amount while preventing its health from running dangerously low. After each successful shot, the game will render a new randomly generated board.

## Functionality & MVP

In Perihelion, players will be able to:

- [ ] Choose a ship's vector amount with the mouse
- [ ] Choose from a variety of levels for varied gameplay

In addition, this project will include:

- [ ] Tutorial levels to teach players how to play
- [ ] A production README

## Wireframes

The game will be rendered on a single screen with the game board with links to the game's GitHub repo as well as to my personal page and LinkedIn profile. The screen will also include a ship's health and energy levels so that users can see them change with their plays.

![alt text](https://raw.githubusercontent.com/christiancho/perihelion/master/wireframes/main.jpg "Main Wireframe")

## Architecture and Technologies

Perihelion will be developed using the following technologies:

- Vanilla JavaScript and jQuery for basic structure and rendering
- PhysicsJS for Newtonian physics handling and collision detection
- EaselJS for rendering to HTML5 canvas
- Webpack to bundle all files and serve up the assets

`board.js`: this script will be responsible for the rendering of all of the elements and managing the overall physics of the objects.

`celestial.js`: this script will house the constructor and values for each of the celestial bodies, both planets and stars, which will inherit from planets. All celestials will have mass and a location in space, but stars will also have an energy level. These objects will be based on the PhysicsJS' Physics class.

`ship.js`: this script will include the constructor and values of the `Ship` class, which will include the velocity vector value, health, and energy values.

## Implementation Timeline

**Day 1**: Set up all necessary Node modules, including getting webpack up and running and EaselJS and PhysicsJS installed. Create `webpack.config.js` as well as `package.json`. Write a basic entry file and the skeletons for all three files above. Learn the basics of `Easel.js` and `Physics.js`. Goals for the day:
- Get a green bundle with `webpack`.
- Learn enough `Easel.js` and `Physics.js` to render a simple Newtonian orbit with a star and a ship.

**Day 2**: Build out the `Celestial` object and the child class `Star` with the respective values. Get the rendering of all kinds of `Star`s and with different colors and positions. Goals for the day:
- Complete the `celestial.js` module (constructor and update functions)
- Render the planets to the `Canvas` using `Easel.js`

**Day 3**: Focus on the `Ship` class. Ensure that the `Ship` class responds to click and drag input to change velocity vector. Once that is complete, have the ship's health and energy levels change in response to proximity to the `Star` class objects. Goals for the day:
- Render the `Ship` class
- Have the `Ship` class respond to click and drag mouse input
- Handle game over logic

## Bonus Features

A physics game like Perihelion naturally has the potential to handle complex physics through the presence of multiple objects. I envision the game to:
1. Handle several other `Celestial` child classes like `Asteroid`s
2. Give players options to upgrade their `Ship`
3. Render elements in 3D using a library like `Babylon.js` and potentially create a first-person view of the ship when it launches.
