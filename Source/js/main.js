// ══════════════════════════════════════════
// MAIN.JS — ENTRY POINT
// Import all modules, animation loop,
// UI bindings, resize handler
// ══════════════════════════════════════════

import * as THREE from 'three';

// ── Import Modules ──
import { renderer, scene, camera, controls, composer, bloom, canvasW, canvasH, PW, BH } from './scene.js';
import { TX, loadRealTextures, toggleTextureMode } from './textures.js';
import { state, clickable, orbLines, allMeshes, demoLabels, demoItemsData } from './state.js';
import { SS, PD, initSolarSystem } from './solarSystem.js';
import { demoGroup, initDemoObjects } from './demoObjects.js';
import { ambLight, sunLight, dirLight, hemiLight, bindLightingUI } from './lighting.js';
import { spawnParticles, updateParticles } from './particles.js';
import { xfState, xfApply, xfReset, xfAuto, xfLoadCurrentState, xfUpdateLabels, bindTransformUI } from './transform.js';
import { selectObj, rpClose, rpFocus, setTab, buildPlanetListUI, initUI, projectLabel, camPreset } from './ui.js';
import { initLoaders } from './loader.js';

// ══════════════════════════════════════════
// INITIALIZATION
// ══════════════════════════════════════════

initSolarSystem();
initDemoObjects();
buildPlanetListUI();
loadRealTextures();

// ══ Expose to window (for onclick handlers in HTML) ══
window.camPreset = camPreset;
window.xfReset = xfReset;
window.xfAuto = xfAuto;
window.rpClose = rpClose;
window.rpFocus = rpFocus;
window.setTab = setTab;

// ══ INIT UI & BINDINGS ══
initUI();
bindLightingUI();
bindTransformUI();
initLoaders();

// ── Camera Controls ──
const B = (id, fn, ev = 'input') => document.getElementById(id).addEventListener(ev, fn);

B('sFov', function () {
  camera.fov = parseFloat(this.value);
  camera.updateProjectionMatrix();
  document.getElementById('vFov').textContent = this.value + '°';
});
B('sNear', function () {
  camera.near = parseFloat(this.value);
  camera.updateProjectionMatrix();
  document.getElementById('vNear').textContent = parseFloat(this.value).toFixed(2);
});
B('sFar', function () {
  camera.far = parseFloat(this.value);
  camera.updateProjectionMatrix();
  document.getElementById('vFar').textContent = this.value;
});

// ── Play / Speed Controls ──
document.getElementById('playBtn').addEventListener('click', function () {
  state.paused = !state.paused;
  this.textContent = state.paused ? '▶' : '⏸';
});
document.getElementById('spd').addEventListener('input', function () {
  state.speedMult = parseFloat(this.value);
  document.getElementById('spdV').textContent = state.speedMult.toFixed(2) + '×';
});

// ══════════════════════════════════════════
// ANIMATION LOOP
// ══════════════════════════════════════════
const clock = new THREE.Clock();
let fpsT = 0, fpsN = 0;

function tick() {
  requestAnimationFrame(tick);

  const dt = Math.min(clock.getDelta(), .033);
  const t = clock.elapsedTime;

  // FPS Counter
  fpsT += dt; fpsN++;
  if (fpsT >= .5) {
    document.getElementById('fps').textContent =
      `FPS: ${(fpsN / fpsT).toFixed(0)} | Objects: ${allMeshes.length}`;
    fpsT = fpsN = 0;
  }

  // Camera Lerping
  if (state.isCameraLerping) {
    camera.position.lerp(state.targetCameraPos, 0.05);
    controls.target.lerp(state.targetControlsPos, 0.05);
    if (camera.position.distanceTo(state.targetCameraPos) < 0.5) {
      state.isCameraLerping = false;
    }
  }

  if (!state.paused) {
    const s = dt * state.speedMult;

    // Sun rotation
    SS.sun.rotation.y += s * .006;

    // Planets
    SS.planets.forEach(obj => {
      obj.orbitPivot.rotation.y += s * obj.data.orb;
      if (!state.selObj || state.selObj.mesh !== obj.mesh) {
        obj.mesh.rotation.y += s * obj.data.rot;
      }
      obj.moons.forEach(mo => {
        mo.pivot.rotation.y += s * mo.data.orb;
        mo.mesh.rotation.y += s * mo.data.rot;
      });
    });

    // Floating objects
    demoGroup.children.forEach(grp => {
      if (grp.userData.isBase) {
        grp.userData.angle += s * grp.userData.orbSpd;
        grp.position.x = Math.cos(grp.userData.angle) * grp.userData.dist;
        grp.position.z = Math.sin(grp.userData.angle) * grp.userData.dist;
        grp.position.y = grp.userData.yOffset + Math.sin(t + grp.userData.dist) * 2;

        const isSel = state.selObj && state.selObj.mesh.userData.baseGroup === grp;
        if (!isSel) {
          const m = grp.children[0]?.children[0];
          if (m) {
            m.rotation.x += grp.userData.rotSpd.x * state.speedMult;
            m.rotation.y += grp.userData.rotSpd.y * state.speedMult;
            m.rotation.z += grp.userData.rotSpd.z * state.speedMult;
          }
        }
      }
    });

    // Auto Spin
    if (state.autoSpinModel && state.selObj) {
      xfState.ry = (xfState.ry + 1) % 360;
      document.getElementById('sry').value = xfState.ry;
      document.getElementById('vry').textContent = xfState.ry + '°';
      xfApply();
    }
  }

  // Particles
  updateParticles(dt);

  // Labels
  demoLabels.forEach(l => projectLabel(l.mesh, l.el));

  // Camera position display
  document.getElementById('cx').textContent = camera.position.x.toFixed(1);
  document.getElementById('cy').textContent = camera.position.y.toFixed(1);
  document.getElementById('cz').textContent = camera.position.z.toFixed(1);

  // Render
  controls.update();
  composer.render();
}

// ══ RESIZE ══
window.addEventListener('resize', () => {
  const w = canvasW(), h = canvasH();
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setSize(w, h);
  bloom.setSize(w, h);
});

// ── Start ──
tick();
