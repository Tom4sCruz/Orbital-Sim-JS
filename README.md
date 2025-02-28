# Orbital-Sim-JS


## Known bugs
- If a satellite's initial position is (0,0,0) - planet's position -, An error is thrown because of a NaN value in the function .setPoints();
- If a satellite collides, its button does not disappear and the indices/satellites become wrongly identified.
