import { scene } from './core.js';
import { Planet, Satellite, Path } from './objects.js';

// Create the Planet
export function build_Planet(radius, mass) {
    const planet = new Planet(radius, mass); // (1, 5)
    scene.add(planet);

    return planet;
}

// Create a Satellite
export function build_Satellite(pos, velocity, r, color, planet, init_time = 0, n_points = 2000) {
    const sat = new Satellite(pos, r, velocity, color, init_time);
    scene.add(sat);

    const path = new Path(sat, planet, n_points);
    scene.add(path);

    return sat;
}