import * as THREE from 'three';
import { renderer, scene, camera, axis, controls, sun, ambient_light } from './core.js';
import { build_Planet, build_Satellite, createPreview, dispose_object } from './functions.js';

// Constants
export const G = 0.8;
export const DT = 0.1;
export const SATELLITE_RADIUS = 0.1;

// Clock (for blinking)
let clock = new THREE.Clock();

// Add elements to scene
scene.add(axis);
scene.add(sun);
scene.add(ambient_light);

// Create Planet
const planet = build_Planet(1, 2);

// Variables
let preview = createPreview(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0), 0xababab, planet);
export let sats = [];

// Input values
const visibleInput = document.getElementById("visible");

const posXInput = document.getElementById("x");
const posYInput = document.getElementById("y");
const posZInput = document.getElementById("z");
const velXInput = document.getElementById("vx");
const velYInput = document.getElementById("vy");
const velZInput = document.getElementById("vz");

const createColorInput = document.getElementById("create-color");

const createInput = document.getElementById("create-button");

const pathInput = document.getElementById("path");
const tracerInput = document.getElementById("tracer");
const colorInput = document.getElementById("color");

// Animate
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    if (sats.length > 0) {
        for (let i = sats.length-1; i >= 0; i--){
            sats[i][0].update(planet.mass, DT);
            sats[i][0].blink(clock.getElapsedTime());
            sats[i][2].update(sats[i][0].position);

            if (sats[i][0].collided(planet.position, planet.geometry.parameters.radius)) {
                dispose_object(sats[i]);
                sats.splice(i, 1);
            }
        }
    }
    renderer.render(scene, camera);
}
animate();


// Preview

visibleInput.addEventListener("change", () => {
    console.log("preview: ", preview[0], preview[1]);
    if (visibleInput.checked) {
        preview[0].visible = true;
        preview[1].visible = true;
    } else {
        preview[0].visible = false;
        preview[1].visible = false;
    }
});

posXInput.addEventListener("input", (event) => {
    // Changes temp_sat Position
    preview[0].position.x = event.target.value !== "" ? parseFloat(event.target.value) : 0;
    // Updates temp_path Geometry
    preview[1].calculate_points(preview[0].geometry.parameters.radius, planet.geometry.parameters.radius,
        preview[0].position, planet.position, preview[0].velocity, planet.mass);
    preview[1].geometry.setPositions(preview[1].orbitPoints.flatMap(p => [p.x, p.y, p.z]));
    preview[1].computeLineDistances();
});

posYInput.addEventListener("input", (event) => {
    // Changes temp_sat Position
    preview[0].position.y = event.target.value !== "" ? parseFloat(event.target.value) : 0;
    // Updates temp_path Geometry
    preview[1].calculate_points(preview[0].geometry.parameters.radius, planet.geometry.parameters.radius,
        preview[0].position, planet.position, preview[0].velocity, planet.mass);
    preview[1].geometry.setPositions(preview[1].orbitPoints.flatMap(p => [p.x, p.y, p.z]));
    preview[1].computeLineDistances();
});

posZInput.addEventListener("input", (event) => {
    // Changes temp_sat Position
    preview[0].position.z = event.target.value !== "" ? parseFloat(event.target.value) : 0;
    // Updates temp_path Geometry
    preview[1].calculate_points(preview[0].geometry.parameters.radius, planet.geometry.parameters.radius,
        preview[0].position, planet.position, preview[0].velocity, planet.mass);
    preview[1].geometry.setPositions(preview[1].orbitPoints.flatMap(p => [p.x, p.y, p.z]));
    preview[1].computeLineDistances();
});

velXInput.addEventListener("input", (event) => {
    // Changes temp_sat Velocity
    preview[0].velocity.x = event.target.value !== "" ? parseFloat(event.target.value) : 0;
    // Updates temp_path Geometry
    preview[1].calculate_points(preview[0].geometry.parameters.radius, planet.geometry.parameters.radius,
        preview[0].position, planet.position, preview[0].velocity, planet.mass);
    preview[1].geometry.setPositions(preview[1].orbitPoints.flatMap(p => [p.x, p.y, p.z]));
    preview[1].computeLineDistances();
});

velYInput.addEventListener("input", (event) => {
    // Changes temp_sat Velocity
    preview[0].velocity.y = event.target.value !== "" ? parseFloat(event.target.value) : 0;
    // Updates temp_path Geometry
    preview[1].calculate_points(preview[0].geometry.parameters.radius, planet.geometry.parameters.radius,
        preview[0].position, planet.position, preview[0].velocity, planet.mass);
    preview[1].geometry.setPositions(preview[1].orbitPoints.flatMap(p => [p.x, p.y, p.z]));
    preview[1].computeLineDistances();
});

velZInput.addEventListener("input", (event) => {
    // Changes temp_sat Velocity
    preview[0].velocity.z = event.target.value !== "" ? parseFloat(event.target.value) : 0;
    // Updates temp_path Geometry
    preview[1].calculate_points(preview[0].geometry.parameters.radius, planet.geometry.parameters.radius,
        preview[0].position, planet.position, preview[0].velocity, planet.mass);
    preview[1].geometry.setPositions(preview[1].orbitPoints.flatMap(p => [p.x, p.y, p.z]));
    preview[1].computeLineDistances();
});

createInput.addEventListener("click", () => {
    const posX = posXInput.value !== "" ? parseFloat(posXInput.value) : 0;
    const posY = posYInput.value !== "" ? parseFloat(posYInput.value) : 0;
    const posZ = posZInput.value !== "" ? parseFloat(posZInput.value) : 0;

    const velX = velXInput.value !== "" ? parseFloat(velXInput.value) : 0;
    const velY = velYInput.value !== "" ? parseFloat(velYInput.value) : 0;
    const velZ = velZInput.value !== "" ? parseFloat(velZInput.value) : 0;


    const pos = new THREE.Vector3(posX, posY, posZ);
    const vel = new THREE.Vector3(velX, velY, velZ);
    const color = createColorInput.value;

    sats.push(build_Satellite(pos, vel, color, planet, clock.getElapsedTime()));
    colorInput.value = color;
});


// Existing Satellite
pathInput.addEventListener("change", () => {
    if (pathInput.checked) {
        sats[0][1].visible = true;
    } else {
        sats[0][1].visible = false;
    }
});

tracerInput.addEventListener("change", () => {
    if (tracerInput.checked) {
        sats[0][2].visible = true;
    } else {
        sats[0][2].visible = false;
    }
});

colorInput.addEventListener("input", (event) => {
    sats[0][0].material.color.set(event.target.value);
    sats[0][0].material.emissive.set(event.target.value);
    sats[0][2].material.color.set(event.target.value);
});


// Misc

window.addEventListener("resize", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width/height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
});