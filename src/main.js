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
camera.position.z = 5.0;
camera.position.y = 4.0;
camera.position.x = -2.0;

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
loadGLTF("/chair.glb", { x: -1, y: -1.25, z: 0 }, null, {
  x: 1.0,
  y: 1.0,
  z: 1.0,
});

loadGLTF(
  "/chair.glb",
  { x: 2, y: -1.25, z: 0 },
  { x: 0, y: 3, z: 0 },
  { x: 1.0, y: 1.0, z: 1.0 },
);

loadGLTF(
  "/chair.glb",
  { x: 0, y: -1.25, z: 0.7 },
  { x: 0, y: 7, z: 0 },
  { x: 1.0, y: 1.0, z: 1.0 },
);

loadGLTF("/rug.glb", { x: 0, y: -1.2, z: 0 }, null, {
  x: 1.0,
  y: 1.0,
  z: 1.0,
});

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

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

viewer
  .addSplatScenes([
    {
      path: "/football-field.splat",
      position: [0, -0.75, 0],
      rotation: [1, 0, 0, 0],
      scale: [50, 50, 50],
    },
  ])
  .then(() => {
    viewer.start();
  });

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
