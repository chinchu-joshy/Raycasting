import { FBXLoader } from "./js/fbxloader.js";
import { Scene } from "./js/three.module.js";
let camera, scene, renderer, directional, ambient, found, obj;

/* -------------------------------- constants ------------------------------- */
const raycaster = new THREE.Raycaster();
const clickmouse = new THREE.Vector2();
const movemouse = new THREE.Vector2();
var draggable = new THREE.Object3D();
/* --------------------------------- events --------------------------------- */
window.addEventListener("click", (event) => {
  if (draggable.parent) {
    draggable = new THREE.Object3D();
    return;
  }
  clickmouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  clickmouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(clickmouse, camera);
  found = raycaster.intersectObjects(scene.children);
  if (found.length > 0 && found[0].object.userData.draggable) {
    draggable = found[0].object;
  }
});
window.addEventListener("mousemove", (event) => {
  movemouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  movemouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
function dargObject() {
  if (draggable != null) {
    raycaster.setFromCamera(movemouse, camera);
    obj = raycaster.intersectObjects(scene.children);
    if (obj.length > 0) {
      for (let o of obj) {
        if (!o.object.userData.ground) {
          continue;
        } else {
          draggable.position.x = o.point.x;
          draggable.position.z = o.point.z;
        }
      }
    }
  }
}
/* -------------------------------- controls -------------------------------- */
function init() {
  /* -------------------------------- geometry -------------------------------- */
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbfd1e5);
  // scene.add(new THREE.AxesHelper(500));
  /* --------------------------------- camera --------------------------------- */
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 200, 200);

  /* -------------------------------- material -------------------------------- */
  const geometry = new THREE.PlaneGeometry(500, 500);

  const material = new THREE.MeshLambertMaterial({
    color: 0xa16f0b,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.castShadow = true;
  plane.reciveShadow = true;
  plane.userData.ground = true;
  const box = new THREE.BoxGeometry(20, 20, 20);
  const material2 = new THREE.MeshLambertMaterial({
    color: 0x0dba4d,
    side: THREE.DoubleSide,
  });
  const square = new THREE.Mesh(box, material2);
  plane.rotation.x = Math.PI / 2;
  // square.rotation.x = Math.PI / 1.8;
  square.position.y = 10.2;
  const sphereGeometry = new THREE.SphereGeometry(10, 32, 16);
  const material3 = new THREE.MeshLambertMaterial({ color: 0xe81328 });
  const sphere = new THREE.Mesh(sphereGeometry, material3);
  // sphere.rotation.x = Math.PI / 1.8;
  sphere.position.set(30, 10.1, 0);
  sphere.userData.draggable = true;
  sphere.userData.name = "sphere";
  square.userData.draggable = true;
  square.userData.name = "square";
  square.userData.ground = false;
  sphere.userData.ground = false;
  sphere.castShadow = true;
  square.castShadow = true;
  scene.add(sphere);
  scene.add(plane);
  scene.add(square);
  /* -------------------------------- Lighting -------------------------------- */
  ambient = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambient);
  directional = new THREE.DirectionalLight(0xffffff, 1);
  directional.position.set(-30, 50, -30);
  directional.castShadow = true;
  directional.shadow.mapSize.width = 2048;
  directional.shadow.mapSize.height = 2048;
  directional.shadow.camera.right = 70;
  directional.shadow.camera.left = -70;
  directional.shadow.camera.top = 70;
  directional.shadow.camera.bottom = -70;
  scene.add(directional);
  /* --------------------------------- render --------------------------------- */
  renderer = new THREE.WebGL1Renderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);
}
/* --------------------------------- animate -------------------------------- */
function animate() {
  dargObject();
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
init();
animate();
const controls = new THREE.OrbitControls(camera, renderer.domElement);
