import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as ZapSplat from "@zappar/three-gaussian-splat";

const scene = new THREE.Scene();

// If this is true, the scene is split in half
var splitVisible = true;

// Initialize camera and set its position
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.z = 5.0;
camera.position.y = 4.0;
camera.position.x = -2.0;

// Set up renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.autoClear = false;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor({ color: 0x000000 });
renderer.render(scene, camera);

// Set up controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Import the splat file and add it to the scene
const splat = new ZapSplat.GaussianSplatMesh("/model.splat", Infinity);
scene.add(splat);

// Masking sphere encapsulating the splat (removes artifacts)
const maskSphere = new ZapSplat.MaskingSphere();
splat.addMaskMesh(maskSphere);
maskSphere.position.y = 0;
maskSphere.scale.setScalar(3.5);
maskSphere.rotation.x = 1;
maskSphere.visible = false;

// Set up plane for splat
const maskPlane = new ZapSplat.MaskingPlane();
maskPlane.position.y = 0.5;
maskPlane.rotation.x = 1.58889;
maskPlane.visible = false;

splat.position.set(0, 1.25, 0);
splat.scale.set(2, 2, 2);
splat.addMaskMesh(maskPlane);

// Loading manager for the splat
const loadingManager = new THREE.LoadingManager();
splat.load(loadingManager);

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
loadGLTF("/chair.glb", { x: -0.5, y: -0.75, z: 0 }, null, {
  x: 2.0,
  y: 2.0,
  z: 2.0,
});

loadGLTF(
  "/chair.glb",
  { x: 2, y: -0.75, z: 0 },
  { x: 0, y: 3, z: 0 },
  { x: 2.0, y: 2.0, z: 2.0 },
);

loadGLTF(
  "/chair.glb",
  { x: 0, y: -0.75, z: 0.7 },
  { x: 0, y: 7, z: 0 },
  { x: 2.0, y: 2.0, z: 2.0 },
);

loadGLTF("/rug.glb", { x: 0, y: -0.745, z: 0 }, null, {
  x: 2.0,
  y: 2.0,
  z: 2.0,
});

// Add a light to the scene
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

// Add the cliping plane for 3D objects
var localPlane = new THREE.Plane();
localPlane.setFromNormalAndCoplanarPoint(
  new THREE.Vector3(0, 0, 1).applyQuaternion(maskPlane.quaternion),
  maskPlane.position,
);

renderer.clippingPlanes = [localPlane];
renderer.localClippingEnabled = true;

// Animation function
function animate() {
  controls.update();
  requestAnimationFrame(animate);
  splat.update(camera, renderer);
  renderer.render(scene, camera);
}
animate();

// Function to toggle the visibility of maskPlane and localPlane
function togglePlanes() {
  if (splitVisible == true) {
    localPlane.constant = Infinity; // Adjust the constant as needed
    maskPlane.position.y = -20;
    splitVisible = false;
  } else {
    splitVisible = true;
    maskPlane.position.y = 0.5;
    maskPlane.rotation.x = 1.58889;
    localPlane.constant = 0;
  }
}

// Event listener for keydown event
document.addEventListener("keydown", (event) => {
  if (event.key === "z") {
    togglePlanes();
  }
});
