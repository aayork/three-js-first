import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";
// import * as ZapSplat from "@zappar/three-gaussian-splat";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.autoClear = false;

// setup renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor({ color: 0x000000 });
renderer.render(scene, camera);

const loader = new GLTFLoader();

loader.load(
  "/chair.glb",
  function (gltf) {
    const chair = gltf.scene;
    scene.add(chair);
    chair.position.y = 0.03;
    chair.position.x = -0.8;
    chair.scale.set(2.0, 2.0, 2.0);

    animate();
  }, // called while loading is progressing
  function (xhr) {
    console.log("chair " + (xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  },
);

loader.load(
  "/chair.glb",
  function (gltf) {
    const chair = gltf.scene;
    scene.add(chair);
    chair.position.x = 2;
    chair.rotation.y = 3;
    chair.position.y = 0.03;
    chair.scale.set(2.0, 2.0, 2.0);

    animate();
  }, // called while loading is progressing
  function (xhr) {
    console.log("chair " + (xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  },
);

loader.load(
  "/chair.glb",
  function (gltf) {
    const chair = gltf.scene;
    scene.add(chair);
    chair.position.z = 0.7;
    chair.rotation.y = 7;
    chair.position.y = 0.03;
    chair.scale.set(2.0, 2.0, 2.0);

    animate();
  }, // called while loading is progressing
  function (xhr) {
    console.log("chair " + (xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  },
);

loader.load(
  "/rug.glb",
  function (gltf) {
    const rug = gltf.scene;
    scene.add(rug);
    rug.scale.set(2.0, 2.0, 2.0);

    animate();
  }, // called while loading is progressing
  function (xhr) {
    console.log("rug " + (xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  },
);

camera.position.z = 5.0;
camera.position.y = 4.0;
camera.position.x = -2.0;

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
  scene: scene,
});

viewer
  .addSplatScenes([
    {
      path: "/garden.ksplat",
      position: [0, 3.58, 0],
      rotation: [1, 0, 0, 0.2768976],
      scale: [1.15, 1.0, 1.0],
    },
  ])
  .then(() => {
    viewer.start();
  });

var localPlane = new THREE.Plane();

renderer.clippingPlanes = [localPlane];

renderer.localClippingEnabled = true;

viewer.clippingPlanes = [localPlane];

viewer.localClippingEnabled = true;

scene.clippingPlanes = [localPlane];

scene.localClippingEnabled = true;

var material = new THREE.MeshPhongMaterial({
  clippingPlanes: [localPlane],
  clipShadows: true,
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
