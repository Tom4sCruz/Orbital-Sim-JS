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
const planet_geometry = new THREE.SphereGeometry(2);
const planet_material = new THREE.MeshStandardMaterial({color: 0xdbbc5e});
const planet = new THREE.Mesh(planet_geometry, planet_material);

scene.add(planet);
/**********/

let sats = [];

function buildSat(color, pos) {
    const sat_geometry = new THREE.SphereGeometry(0.1);
    const sat_material = new THREE.MeshStandardMaterial({color:color, emissive:color, emissiveIntensity: 0});
    const sat = new THREE.Mesh(sat_geometry, sat_material);
    sat.position.copy(pos);
    
    scene.add(sat);
    sats.push(sat);
}


buildSat(0x0000ff, new THREE.Vector3(0,0,3));
buildSat(0xff0000, new THREE.Vector3(0,0,4));
buildSat(0x00ff00, new THREE.Vector3(0,0,5));


// Used for the blinking
let clock = new THREE.Clock();

function animate() {
    // Blinking

        let time = clock.getElapsedTime();
        for (let i=0; i<sats.length; i++) {
            sats[i].material.emissiveIntensity = Math.sin(time* Math.PI);
        }
    controls.update();
    renderer.render(scene, camera);
}
