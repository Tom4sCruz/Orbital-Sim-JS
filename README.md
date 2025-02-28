# Orbital-Sim-JS

A 3D orbit simulator with Newtonian Physics. You can add as many satellites as you want, change their color and toggle on and off their paths and tracers.<br>

![Example-of-usage](media/orbital-sim-js-animated.gif)

## How to run it
I've been opening it using the 'Live Server' in VSCode.<br>
Another possibility is doing:
```bash
npx serve .
```
If you want to run it in your local network, where any device connected to your network can open the project, you may do:
```bash
npx serve . -l tcp://0.0.0.0
```

### Dependencies
To execute <code>npx</code> you'll need to have installed <code>nodejs</code> and <code>npm</code>.

## Further work
Some new features could still be implemented, but I feel like the main objective for this project is done.

## Known bugs
- If a satellite's initial position is (0,0,0) - planet's position -, an error is thrown because of a NaN value in the function .setPoints();
- If a satellite collides, its button does not disappear and the indices/satellites become wrongly identified.
