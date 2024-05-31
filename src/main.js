import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.z = -10.0;
camera.position.y = 4.0;
camera.position.x = 2.0;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.autoClear = false;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor({ color: 0x000000 });
renderer.render(scene, camera);

// Loader for 3D files
const loader = new GLTFLoader();

// Function to load a GLTF file and add it to the scene
function loadGLTF(url, position, rotation, scale) {
  loader.load(
    url,
    function (gltf) {
      const object = gltf.scene;
      scene.add(object);
      if (position) object.position.set(position.x, position.y, position.z);
      if (rotation) object.rotation.set(rotation.x, rotation.y, rotation.z);
      if (scale) object.scale.set(scale.x, scale.y, scale.z);

      animate();
    },
    function (xhr) {
      console.log(url + " " + (xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.error("An error happened", error);
    },
  );
}

// Load the chairs and rug with appropriate positions and scales
loadGLTF("/chair.glb", { x: -1.5, y: -1.25, z: -2 }, null, {
  x: 6.0,
  y: 6.0,
  z: 6.0,
});

loadGLTF("/my_room.glb", { x: -1.5, y: 10.68, z: 3 }, null, {
  x: 8.0,
  y: 8.0,
  z: 8.0,
});

loadGLTF(
  "/chair.glb",
  { x: 1, y: -1.25, z: 5 },
  { x: 0, y: 3, z: 0 },
  { x: 6.0, y: 6.0, z: 6.0 },
);

loadGLTF(
  "/chair.glb",
  { x: 0, y: -1.25, z: 0.7 },
  { x: 0, y: 7, z: 0 },
  { x: 6.0, y: 6.0, z: 6.0 },
);

loadGLTF("/rug.glb", { x: 0, y: -1.2, z: 0 }, null, {
  x: 6.0,
  y: 6.0,
  z: 6.0,
});

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

const light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(0, 1, 0).normalize();
scene.add(light2);

const light3 = new THREE.DirectionalLight(0xffffff, 1);
light3.position.set(1, 1, 0).normalize();
scene.add(light3);

// Add a hemispheric light to the scene
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x420042);
hemisphereLight.position.set(-2, -3, -4);
scene.add(hemisphereLight);

const viewer = new GaussianSplats3D.Viewer({
  selfDrivenMode: true,
  renderer: renderer,
  camera: camera,
  useBuiltInControls: true,
  sharedMemoryForWorkers: false,
  sceneRevealMode: GaussianSplats3D.SceneRevealMode.Instant,
  antialiased: false,
  logLevel: GaussianSplats3D.LogLevel.None,
  sphericalHarmonicsDegree: 0,
  dynamicScene: true,
  scene: scene,
});

/*
viewer
  .addSplatScenes([
    {
      path: "/bigger_room.cleaned.splat",
      position: [-2, -0.3, -3],
      rotation: [1, 0, 0, 0],
      scale: [2.5, 2.5, 2.5],
    },
  ])
  .then(() => {
    viewer.start();
  });
  */

viewer.start();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
