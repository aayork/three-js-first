import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";

const scene = new THREE.Scene();
const boxColor = 0xbbbbbb;
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMesh = new THREE.Mesh(
  boxGeometry,
  new THREE.MeshBasicMaterial({ color: boxColor }),
);
boxMesh.position.set(3, 2, 2);
scene.add(boxMesh);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const viewer = new GaussianSplats3D.Viewer({
  scene: scene,
});
viewer.addSplatScene("/room.ply").then(() => {
  viewer.start();
});

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

/*

var material = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  specular: 0x111111,
  shininess: 200,
  vertexColors: THREE.VertexColors,
});


const plyLoader = new PLYLoader();
plyLoader.load(
  "/room.ply",
  function (geometry) {
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(-Math.PI / 2);
    mesh.scale.set(2, 2, 2);
    scene.add(mesh);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  },
);
*/

// setup renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor({ color: 0x000000 });
const element = renderer.domElement;
// document.querySelector(".panorama_viewer").appendChild(element);
renderer.render(scene, camera);

const loader = new GLTFLoader();

loader.load(
  "/chair.glb",
  function (gltf) {
    const chair = gltf.scene;
    scene.add(chair);
    chair.position.y = 0.03;
    chair.position.x = -0.4;
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
    chair.position.x = 0.4;
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

scene.background = new THREE.Color(0xffffff);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 1).normalize();
scene.add(light);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}
animate();
