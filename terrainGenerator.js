import * as P5 from 'p5'
import * as THREE from 'three';

export default class TerrainGenerator {
    constructor(width, height) {
        this.terrain = [];
        this.width = width;
        this.height = height;
        this.p5 = new P5();
        this.baseNoiseOffset = this.p5.createVector(this.p5.random(0, 9999), this.p5.random(0, 9999));
        // this.baseNoiseInc = 0.007;
        this.baseNoiseInc = 0.05;
        this.detailNoiseOffset = this.p5.createVector(this.p5.random(0, 9999), this.p5.random(0, 9999));
        // this.detailNoiseInc = 0.01;
        this.detailNoiseInc = 0.01;
        this.seaLevel = 0.15;
        this.beachLevel = 0.035;
    }

    generate() {
        this.terrain = [];

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                let base = this.p5.noise(this.baseNoiseOffset.x + this.baseNoiseInc * j, this.baseNoiseOffset.y + this.baseNoiseInc * i);
                let detail = this.p5.noise(this.detailNoiseOffset.x + this.detailNoiseInc * j, this.detailNoiseOffset.y + this.detailNoiseInc * i) / 10;

                // Alpha mask for creating islands, creates radial linear gradient
                let a = 1;
                let d = this.p5.dist(this.width / 2, this.height / 2, j, i);
                let r = (3 / 5) * this.width;
                if (d < r) {
                    a = d / r;
                }

                let y = base + detail - a;
                y *= 10;

                this.terrain.push(y >= 0? y : 0); // Don't let the value go below 0
            }
        }
    }

    regenerate() {
        this.p5.noiseSeed(this.p5.random(0, 99999999));
        this.baseNoiseOffset = this.p5.createVector(this.p5.random(0, 9999), this.p5.random(0, 9999));
        this.detailNoiseOffset = this.p5.createVector(this.p5.random(0, 9999), this.p5.random(0, 9999));
        this.generate();
    }

    drawTerrain(scene) {
        const geometry = new THREE.PlaneGeometry(this.width, this.height, this.width, this.height);
        
        
        const plane = new THREE.Mesh(
            geometry,
            new THREE.MeshStandardMaterial({ color: 0xAAAAAA, wireframe: true, })
            );
        plane.rotateX(-Math.PI/2);
            
        const positions = plane.geometry.attributes.position.array;
        
        for(let i = 0; i < positions.length; i+=3) {
            if(i < this.terrain.length*3){
                const v = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2])
                positions[i] = v.x
                positions[i + 1] = v.y 
                positions[i + 2] = v.z + this.terrain[i/3]
            }
        }
        
        plane.geometry.attributes.position.needsUpdate = true;
        scene.add(plane);

        // for (let y = 0; y < this.height; y++) {
        //     for (let x = 0; x < this.width; x++) {
        //         let h = this.terrain[y][x];
        //         let col = [0, 0, 0];

        //         // Set the colour
        //         if (h < this.seaLevel) {
        //             col[1] = this.fastMap(h, 0, this.seaLevel, 90, 110);
        //             col[2] = this.fastMap(h, 0, this.seaLevel, 160, 200);
        //         }
        //         else if (h < this.seaLevel + this.beachLevel) {
        //             col[0] = 255;
        //             col[1] = 236;
        //             col[2] = 188;
        //         }
        //         else {
        //             col[0] = this.fastMap(h, this.seaLevel, 1, 80, 100);
        //             col[1] = this.fastMap(h, this.seaLevel, 1, 90, 160);
        //         }

        //         // Create box at position x, y, with height h with colour col;
        //         const box = new THREE.Mesh(
        //             new THREE.PlaneGeometry(1, 1),
        //             new THREE.MeshStandardMaterial({ color: new THREE.Color() })
        //         );
        //         box.position.set(x, h * 10, y);
        //         box.rotateX(-Math.PI/2);
        //         scene.add(box);


        //         // // loop over
        //         // let index = ((x + this.posOffset.x) + (y + this.posOffset.y) * width) * 4;

        //         // pixels[index] = col[0];
        //         // pixels[index + 1] = col[1];
        //         // pixels[index + 2] = col[2];
        //     }
        // }
    }

    updateParams(seaLevel, beachLevel) {
        this.seaLevel = seaLevel;
        this.beachLevel = beachLevel;
    }

    fastMap(val, valMin, valMax, resMin, resMax) {
        let valRange = valMax - valMin;
        let valPercent = val / valRange;

        let resRange = resMax - resMin;
        let res = resMin + resRange * valPercent;

        return res;
    }
}