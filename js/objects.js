import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { G, DT } from './main.js';
import { scene } from './core.js';


export class Planet extends THREE.Mesh {

    constructor (radius, mass) {
        const geometry = new THREE.SphereGeometry(radius);
        const material = new THREE.MeshStandardMaterial({color: 0xdbbc5e}); // #dbbc5e

        super(geometry, material);
        
        this.mass = mass;
    }
}



export class Satellite extends THREE.Mesh {
    
    constructor (pos, radius, velocity, color, init_time) {
        const geometry = new THREE.SphereGeometry(radius);
        const material = new THREE.MeshStandardMaterial({color: color, emissive: color, emissiveIntensity: 0});

        super(geometry, material);

        this.velocity = velocity;
        this.init_time = init_time;

        this.position.copy(pos);
    }

    collided(planet_pos, planet_radius) {
        return this.geometry.parameters.radius + planet_radius >= this.position.distanceTo(planet_pos);
    }

    blink(t) {
        this.material.emissiveIntensity = Math.sin( (t-this.init_time) * Math.PI );
    }

    update(planet_mass, dt) {
        let r = Math.sqrt(this.position.x**2 + this.position.y**2 + this.position.z**2);

        let ag = G * planet_mass / r**2;
        
        let ax = ag * this.position.x / r;
        let ay = ag * this.position.y / r;
        let az = ag * this.position.z / r;

        this.velocity.x -= ax * dt;
        this.velocity.y -= ay * dt;
        this.velocity.z -= az * dt;

        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
        this.position.z += this.velocity.z * dt;
    }
}



export class Path extends Line2 {

    constructor (sat, planet, n_points, color = 0x313131) { // #313131

        const geometry = new LineGeometry(); 
        const material = new LineMaterial({color: color, linewidth: 1, transparent:true, opacity:0.5});

        super(geometry, material);

        this.n_points = n_points;
        this.orbitPoints = [];

        this.geometry.setPositions(new Array(n_points * 3).fill(0)); 

        this.calculate_points(sat.geometry.parameters.radius, planet.geometry.parameters.radius,
                            sat.position, planet.position, sat.velocity, planet.mass);

        if (this.orbitPoints.length > 1) {
            this.geometry.setPositions(this.orbitPoints.flatMap(p => [p.x, p.y, p.z]));
            this.computeLineDistances();
        }
    }

    calculate_points(sat_radius, planet_radius, sat_position, planet_pos, sat_velocity, planet_mass) {
        this.orbitPoints = [];
        let sat_pos = sat_position.clone();
        let sat_vel = sat_velocity.clone();
        let dt = DT;

        this.orbitPoints.push(sat_pos.clone());

        for (let i=0; i < this.n_points-1; i++) {

            if ( sat_radius + planet_radius >= 
                    sat_pos.distanceTo(planet_pos)) {
                return 0;
            }
            
            let r = Math.sqrt(sat_pos.x**2 + sat_pos.y**2 + sat_pos.z**2);

            let ag = G * planet_mass / r**2;
            
            let ax = ag * sat_pos.x / r;
            let ay = ag * sat_pos.y / r;
            let az = ag * sat_pos.z / r;

            sat_vel.x -= ax * dt;
            sat_vel.y -= ay * dt;
            sat_vel.z -= az * dt;

            sat_pos.x += sat_vel.x * dt;
            sat_pos.y += sat_vel.y * dt;
            sat_pos.z += sat_vel.z * dt;


            this.orbitPoints.push(sat_pos.clone());
        }

        return 1;
    }
}


export class Tracer extends Line2 {

    constructor (n_points, color){
        
        const geometry = new LineGeometry();
        const material = new LineMaterial({color: color, linewidth:3});

        super(geometry, material);

        this.n_points = n_points;
        this.orbitPoints = [];

        this.geometry.setPositions(new Array(n_points * 3).fill(0)); 
    }

    update (sat_pos) {
        if(this.orbitPoints.length >= this.n_points) {
            this.orbitPoints.shift();
        } 
            this.orbitPoints.push(sat_pos.clone());

            const flatPoints = this.orbitPoints.flatMap(p => [p.x, p.y, p.z]);

            if (this.orbitPoints.length < 2) return;
            /* 
            The reason for the line above is because if the allocation of memory.
            Even though, we allocate memory on ln. 151, .setPositions() still expects at least 
            2 points (6 elements) to update the geometry. Fewer than that (<5 elements, thus <2 points)
            and the geometry may be computed incorrectly, causing the line not to render.
            */

            this.geometry.setPositions(this.orbitPoints.flatMap(p => [p.x, p.y, p.z]));
            this.geometry.needsUpdate = true;

            this.computeLineDistances();
            this.material.needsUpdate = true;
    }
} 