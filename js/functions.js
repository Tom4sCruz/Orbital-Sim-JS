import { scene } from './core.js';
import { Planet, Satellite, Path, Tracer } from './objects.js';
import { SATELLITE_RADIUS } from './main.js';

// Create the Planet
export function build_Planet(radius, mass) {
    const planet = new Planet(radius, mass);
    scene.add(planet);

    return planet;
}

// Create a Satellite
export function build_Satellite(pos, velocity, color, planet, init_time = 0, n_points = 20000, tracer_points = 20) {
    const sat = new Satellite(pos, SATELLITE_RADIUS, velocity, color, init_time);
    scene.add(sat);

    const path = new Path(sat, planet, n_points);
    scene.add(path);

    const tracer = new Tracer(tracer_points, color);
    scene.add(tracer);

    return [sat, path, tracer];
}

// Create a preview
export function createPreview(pos, velocity, color, planet) {
    const init_time = 0;
    const n_points = 20000;
    
    const temp_sat = new Satellite(pos, SATELLITE_RADIUS, velocity, color, init_time);
    scene.add(temp_sat);

    const temp_path = new Path(temp_sat, planet, n_points);
    scene.add(temp_path);

    return [temp_sat, temp_path];
}

// Remove object from Sim
export function dispose_object(info) {
    for( let j=0; j<3; j++) {
        scene.remove(info[j]);
        info[j].geometry.dispose();
        info[j].material.dispose();
    }
}