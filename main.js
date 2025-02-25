import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'

/********** Boilerplate **********/
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(5,3,7);
/*********************************/


const PLANET_MASS = 1;
const G = 0.6;
const PLANET_RADIUS = 2;


/* Optional */
const controls = new OrbitControls(camera, renderer.domElement);

const axis = new THREE.AxesHelper(5);
scene.add(axis);
/************/


/* Light */
const ambient_light = new THREE.AmbientLight(0x808080);
scene.add(ambient_light);

const sun = new THREE.PointLight(0xffffff, 1000);
sun.position.set(0,0,20);
scene.add(sun);
/*********/


/* Planet */
const planet_geometry = new THREE.SphereGeometry(PLANET_RADIUS);
const planet_material = new THREE.MeshStandardMaterial({color: 0xdbbc5e});
const planet = new THREE.Mesh(planet_geometry, planet_material);

scene.add(planet);
/**********/

class Satellite extends THREE.Mesh {
    constructor(x, y, z, vx, vy, vz, color) {

        const geometry = new THREE.SphereGeometry(0.1);
        const material = new THREE.MeshStandardMaterial({color: color, emissive: color, emissiveIntensity: 0});

        super(geometry, material);
        this.position.set(x, y, z);

        planet.add(this);

        this.vx = vx;
        this.vy = vy;
        this.vz = vz;
    }

    update(dt) {

        this.collided();
        
        let r = Math.sqrt(this.position.x**2 + this.position.y**2 + this.position.z**2);
        let ag = PLANET_MASS*G/r**2;
        let ax = -ag*this.position.x/r;
        let ay = -ag*this.position.y/r;
        let az = -ag*this.position.z/r;
        this.vx += ax*dt;
        this.vy += ay*dt;
        this.vz += az*dt;
        this.position.x += this.vx*dt;
        this.position.y += this.vy*dt;
        this.position.z += this.vz*dt;

    }
    collided() {
        if (this.geometry.parameters.radius+PLANET_RADIUS >= 
            this.position.distanceTo(planet.position)) {
                scene.remove(this);
                this.geometry.dispose;
                this.material.dispose;
                sats.splice(sats.indexOf(this), 1);
        }
    }
}

class Path extends THREE.Line {
    constructor(sat) {
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({color: sat.material.color});
        super(geometry, material);
        scene.add(this);

        this.orbitPoints = [];
    }
}

let sats = [];

function buildSat(x, y, z, vx, vy, vz, color) {
    const sat = new Satellite(x, y, z, vx, vy, vz, color);
    const path = new Path(sat);
    
    sats.push([sat, path]);
}

buildSat(0, 0, 4, 0.4, 0, 0, 0xff0000);

// Used for the blinking
let clock = new THREE.Clock();

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
});