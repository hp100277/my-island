import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Water } from "three/examples/jsm/objects/Water2";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(-50, 50, 130);
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();
const texture = new THREE.TextureLoader().load("./textures/sky.jpg");
const skyGeometry = new THREE.SphereGeometry(1000, 60, 60);
const skyMaterial = new THREE.MeshBasicMaterial({ map: texture });
skyGeometry.scale(1, 1, -1);
const sky = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(sky);


const video = document.createElement("video");
video.src = "./textures/sky.mp4";
video.loop = true;

window.addEventListener("click", () => {
    if (video.paused) {
        video.play();
        const texture = new THREE.VideoTexture(video);
        skyMaterial.map = texture;
        skyMaterial.map.needsUpdate = true;
    }
});

const hdrLoader = new RGBELoader();
hdrLoader.loadAsync("./assets/050.hdr").then(textrue => {
    textrue.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = textrue;
    scene.environment = textrue;
});

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-100, 100, 10);
scene.add(light);

const waterGeometry = new THREE.CircleBufferGeometry(300, 64);
const water = new Water(waterGeometry, {
    textureWidth: 1024, textureHeight: 1024,
    color: 0xeeeeff, flowDirection: new THREE.Vector2(1, 1), scale: 1
});
water.position.y = 3;
water.rotation.x = -Math.PI / 2;
scene.add(water);

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/");
loader.setDRACOLoader(dracoLoader);
loader.load("./model/island2.glb", (gltf) => {
    scene.add(gltf.scene);
});




