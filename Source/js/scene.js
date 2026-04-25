// ══════════════════════════════════════════
// CỐT LÕI SCENE (CORE SETUP)
// Renderer, Camera, Controls, Post-processing
// ══════════════════════════════════════════

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// ── Kích thước Panel ──
export const PW = 292;  // Chiều rộng panel trái (px)
export const BH = 52;   // Chiều cao thanh bottom (px)

export const canvasW = () => innerWidth - PW;
export const canvasH = () => innerHeight - BH;

// ══ RENDERER ══
export const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance'
});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(canvasW(), canvasH());
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.domElement.style.cssText = `position:absolute;left:${PW}px;top:0`;
document.body.appendChild(renderer.domElement);

// ══ SCENE ══
export const scene = new THREE.Scene();

// ══ CAMERA (Chiếu phối cảnh - Perspective) ══
export const camera = new THREE.PerspectiveCamera(
  60,                      // FOV (góc nhìn)
  canvasW() / canvasH(),   // Aspect ratio
  0.1,                     // Near plane (mặt gần)
  8000                     // Far plane (mặt xa)
);
camera.position.set(0, 250, 500);

// ══ ORBIT CONTROLS ══
export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.minDistance = 4;
controls.maxDistance = 4000;

// ══ POST-PROCESSING (Bloom - hiệu ứng phát sáng) ══
export const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

export const bloom = new UnrealBloomPass(
  new THREE.Vector2(canvasW(), canvasH()),
  1.2,   // strength
  0.4,   // radius
  0.75   // threshold
);
composer.addPass(bloom);
composer.addPass(new OutputPass());
