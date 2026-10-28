import "./style.css";
import * as THREE from "three";
import { DragControls } from "three/addons/controls/DragControls.js";

window.addEventListener("DOMContentLoaded", () => {
  main();
});

function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    500,
  );
  camera.position.set(0, 0, 10);
  scene.add(camera);

  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshNormalMaterial();
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.set(0, 0, 0);

  const light = new THREE.AmbientLight(0xffffff, 5);
  scene.add(light);

  const mouse = {
    x: 0,
    y: 0,
  };

  window.addEventListener("pointermove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
  });

  renderer.setAnimationLoop((time) => {
    cube.rotation.y = time / 1000;
    cube.rotation.x = time / 1000;
    cube.rotation.z = time / 1000;

    cube.position.set(mouse.x * 3, -mouse.y * 3, 0);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  });

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}
