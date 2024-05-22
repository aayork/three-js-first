import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as ZapSplat from "@zappar/three-gaussian-splat";

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

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const loader = new GLTFLoader();

const bonsai = new URL("./public/bonsai.splat", import.meta.url).href;
const splat = new ZapSplat.GaussianSplatMesh(bonsai, Infinity);
scene.add(splat);

const maskPlane = new ZapSplat.MaskingPlane();

splat.addMaskMesh(maskPlane);

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
loadGLTF("/chair.glb", { x: -0.8, y: 0.03, z: 0 }, null, {
  x: 2.0,
  y: 2.0,
  z: 2.0,
});
loadGLTF(
  "/chair.glb",
  { x: 2, y: 0.03, z: 0 },
  { x: 0, y: 3, z: 0 },
  { x: 2.0, y: 2.0, z: 2.0 },
);
loadGLTF(
  "/chair.glb",
  { x: 0, y: 0.03, z: 0.7 },
  { x: 0, y: 7, z: 0 },
  { x: 2.0, y: 2.0, z: 2.0 },
);
loadGLTF("/rug.glb", null, null, { x: 2.0, y: 2.0, z: 2.0 });

camera.position.z = 5.0;
camera.position.y = 4.0;
camera.position.x = -2.0;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

var localPlane = new THREE.Plane();

renderer.clippingPlanes = [localPlane];

renderer.localClippingEnabled = true;

function animate() {
  controls.update();
  requestAnimationFrame(animate);
  splat.update();
  renderer.render(scene, camera);
}
animate();
