import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as ZapSplat from "@zappar/three-gaussian-splat";

const scene = new THREE.Scene();

var splitVisible = true;

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

const splat = new ZapSplat.GaussianSplatMesh("/model.splat", Infinity);
scene.add(splat);

const maskSphere = new ZapSplat.MaskingSphere();

splat.addMaskMesh(maskSphere);
maskSphere.position.y = 0;
maskSphere.scale.setScalar(3.5);
maskSphere.rotation.x = 1;
// set to invisible once finalized position
maskSphere.visible = false;

const maskPlane = new ZapSplat.MaskingPlane();

maskPlane.position.y = 0.5;
maskPlane.rotation.x = 1.58889;
maskPlane.visible = false;

splat.position.set(0, 1.25, 0);

splat.scale.set(2, 2, 2);

splat.addMaskMesh(maskPlane);

const loadingManager = new THREE.LoadingManager();
splat.load(loadingManager);

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

camera.position.z = 5.0;
camera.position.y = 4.0;
camera.position.x = -2.0;

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

var localPlane = new THREE.Plane();
localPlane.setFromNormalAndCoplanarPoint(
  new THREE.Vector3(0, 0, 1).applyQuaternion(maskPlane.quaternion),
  maskPlane.position,
);

renderer.clippingPlanes = [localPlane];

renderer.localClippingEnabled = true;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function animate() {
  controls.update();
  requestAnimationFrame(animate);
  splat.update(camera, renderer);
  renderer.render(scene, camera);
}
animate();

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function render() {
  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, camera);

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < intersects.length; i++) {
    intersects[i].object.material.color.set(0xff0000);
  }

  renderer.render(scene, camera);
}

window.addEventListener("pointermove", onPointerMove);

window.requestAnimationFrame(render);

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
