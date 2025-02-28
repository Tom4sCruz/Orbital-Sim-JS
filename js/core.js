import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(1,8,3);

// Axis
const axis = new THREE.AxesHelper(5);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Sun
const sun = new THREE.PointLight(0xffffff, 1000);
sun.position.set(0,0,20);

// Ambient Light
const ambient_light = new THREE.AmbientLight(0x808080); // Prevents it from being too dark


export { renderer, scene, camera, axis, controls, sun, ambient_light };
