import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

window.addEventListener("DOMContentLoaded", () => {
  main();
});

function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
  renderer.shadowMap.enabled = true;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    500,
  );
  camera.position.set(0, 10, 15);
  scene.add(camera);

  const planeGeo = new THREE.PlaneGeometry(50, 50);
  const planeMat = new THREE.MeshPhongMaterial({
    color: 0xd1c79f,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(planeGeo, planeMat);
  plane.receiveShadow = true;

  const cubeGeo = new THREE.BoxGeometry(5, 5, 5);
  const cubeMat = new THREE.MeshPhongMaterial({ color: 0x00ffff });
  const cube = new THREE.Mesh(cubeGeo, cubeMat);
  cube.castShadow = true;

  cube.position.set(0, 7, 0);

  plane.rotation.x = Math.PI * -0.5;
  camera.lookAt(plane);

  scene.add(plane, cube);

  const light = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(light);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
  directionalLight.position.set(0, 15, 7);
  directionalLight.target.position.set(-5, 0, 0);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
  scene.add(directionalLight.target);

  const dirLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    1,
    0xb51d12,
  );
  scene.add(dirLightHelper);

  function guiHelp(gui, vector3, name, onChangeFn) {
    const guiFolder = gui.addFolder(name);
    guiFolder.add(vector3, "x", -10, 10).onChange(onChangeFn);
    guiFolder.add(vector3, "y", 0, 10).onChange(onChangeFn);
    guiFolder.add(vector3, "z", -10, 10).onChange(onChangeFn);
    guiFolder.open();
  }

  function updateLight() {
    directionalLight.target.updateMatrixWorld();
    dirLightHelper.update();
  }

  updateLight();

  const gui = new GUI();

  gui
    .addColor(new ColorGUIHelper(directionalLight, "color"), "value")
    .name("color");
  gui.add(directionalLight, "intensity", 0.1, 10);
  gui.addColor(new ColorGUIHelper(cubeMat, "color"), "value").name("color");

  guiHelp(gui, directionalLight.position, "position", updateLight);
  guiHelp(gui, directionalLight.target.position, "target", updateLight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.12;
  controls.update();

  renderer.setAnimationLoop((time) => {
    cube.rotation.y = time / 1000;
    cube.rotation.x = time / 1000;
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.update();
    renderer.render(scene, camera);
  });

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}

class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return "#" + this.object[this.prop].getHexString();
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}
