import * as THREE from 'three';
import { renderer, scene, camera, axis, controls, sun, ambient_light } from './core.js';
import { build_Planet, build_Satellite } from './functions.js';

// Constants
export const G = 0.6;
export const DT = 0.1;

// Clock (for blinking)
let clock = new THREE.Clock();

// Add elements to scene
scene.add(axis);
scene.add(sun);
scene.add(ambient_light);

// Create Planet & Satellite
const planet = build_Planet(1, 2);
const sat = build_Satellite(new THREE.Vector3(0, 1, 4), 
                new THREE.Vector3(0.4, 0.1, 0), 
                0.1, 
                0xff0000,
                planet,
                clock.getElapsedTime());


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    sat.update(planet, DT);
    sat.blink(clock.getElapsedTime());
    renderer.render(scene, camera);
}
animate();


/*
function animate() {
    // Blinking
    let time = clock.getElapsedTime();
    for (let i = 0; i < sats.length; i++) {
        let satellite = sats[i][0];
        let path = sats[i][1];
        // Update satellite's material emissive intensity
        satellite.material.emissiveIntensity = Math.sin(time * 1.5 * Math.PI);
    
        // Push a copy of the current position to avoid reference issues
        path.orbitPoints.push(satellite.position.clone());
        path.geometry.dispose();
        path.geometry = new THREE.BufferGeometry().setFromPoints(path.orbitPoints);   
    
        // Update the satellite's physics
        satellite.update(0.1);
    }
    controls.update();
    renderer.render(scene, camera);
}

const colorInput = document.getElementById("color");
colorInput.addEventListener("input", (event) => {
    sats[0][0].material.color.set(event.target.value);     // To change in a way that it changes the selected satellite
    sats[0][0].material.emissive.set(event.target.value);  // To change in a way that it changes the selected satellite
    sats[0][1].material.color.set(event.target.value);
});

const tracerInput = document.getElementById("tracer");
tracerInput.addEventListener("input", () => {
    if (tracerInput.checked) {
        sats[0][1].visible = true;
    } else {
        sats[0][1].visible = false;
    }
});*/