import "./style.css";
import * as THREE from "three";
import gsap from "gsap";
import { all } from "three/src/nodes/math/MathNode.js";

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

  let scrollY = 0;
  const SECTION_HEIGHT = 60;

  camera.position.z = 80;
  scene.add(camera);

  const light = new THREE.AmbientLight(0xffffff, 5);
  scene.add(light);

  const material = new THREE.MeshStandardMaterial({ color: 0xffea00 });

  const objects = [
    {
      id: 1,
      name: "torus",
      geometry: new THREE.TorusGeometry(10, 3, 16, 100),
      mat: material,
    },
    {
      id: 2,
      name: "cone",
      geometry: new THREE.ConeGeometry(5, 20, 32),
      mat: material,
    },
    {
      id: 3,
      name: "knot",
      geometry: new THREE.TorusKnotGeometry(10, 3, 100, 16),
      mat: material,
    },
  ];

  const allMesh = [];

  objects.forEach((obj, index) => {
    let mesh = new THREE.Mesh(obj.geometry, obj.mat);
    mesh.castShadow = true;
    mesh.position.set(0, -index * SECTION_HEIGHT, 0);
    allMesh.push(mesh);
    scene.add(mesh);
  });

  window.addEventListener("wheel", (event) => {
    let direction = Math.sign(event.deltaY);

    if (direction === 1) {
      window.scrollBy({
        top: window.innerHeight,
        left: 0,
        behavior: "smooth",
      });
    }

    if (direction === -1) {
      window.scrollBy({
        top: -window.innerHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  });

  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
  });

  const mouse = new THREE.Vector2(10, 10);
  window.addEventListener("pointermove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  const raycaster = new THREE.Raycaster();
  let hovered = null;

  renderer.setAnimationLoop((time) => {
    allMesh.forEach((m) => {
      m.rotation.x = time / 1000;
      m.rotation.y = time / 1000;
    });

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(allMesh);
    hovered = intersects.length > 0 ? intersects[0].object : null;

    for (const obj of allMesh) {
      const targetScale = obj === hovered ? 2 : 1;
      obj.scale.setScalar(THREE.MathUtils.lerp(obj.scale.x, targetScale, 1));
    }

    camera.position.y = -(scrollY / window.innerHeight) * SECTION_HEIGHT;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  });

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}
