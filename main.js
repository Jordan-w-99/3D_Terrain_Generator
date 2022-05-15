import * as THREE from 'three';
import TerrainGenerator from './terrainGenerator';

const scene = new THREE.Scene();

const canvas = document.getElementById('app');
const renderer = new THREE.WebGLRenderer({
  canvas
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 9999999);
camera.position.setY(100);
camera.position.setX(150);
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
directionalLight.position.set(2, 5, 5);
scene.add(directionalLight);

// const pointLight = new THREE.PointLight(0xFFFFFF, 0.1);
// pointLight.position.set(2, 100, 5);
// scene.add(pointLight);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1),
  new THREE.MeshStandardMaterial({ color: 0xFF0000 })
);
// scene.add(sphere);

const terrainGenerator = new TerrainGenerator(100, 100);
terrainGenerator.generate();
terrainGenerator.drawTerrain(scene);

function animate() {
  renderer.render(scene, camera);

  // camera.rotateY(0.01);

  requestAnimationFrame(animate);
}

animate();