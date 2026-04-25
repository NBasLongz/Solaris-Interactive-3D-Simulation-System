// ══════════════════════════════════════════
// UI & INTERACTION
// Tabs, Raycaster, Planet list, Right panel
// ══════════════════════════════════════════

import * as THREE from 'three';
import { renderer, camera, controls, canvasW, canvasH, PW } from './scene.js';
import { state, clickable, orbLines, allMeshes, demoLabels, demoItemsData } from './state.js';
import { lighten } from './utils.js';
import { xfLoadCurrentState } from './transform.js';
import { spawnParticles } from './particles.js';
import { toggleTextureMode } from './textures.js';
import { demoGroup } from './demoObjects.js';

const ray = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tip = document.getElementById('tip');
const tmpV = new THREE.Vector3();

// ══ TAB SWITCHING ══
export function setTab(id) {
  document.querySelectorAll('.tab').forEach(t =>
    t.classList.toggle('on', t.dataset.t === id)
  );
  document.querySelectorAll('.tc').forEach(t =>
    t.classList.toggle('on', t.id === `tc-${id}`)
  );
}

// ══ SELECT OBJECT ══
export function selectObj(obj) {
  state.selObj = obj;
  const d = obj.data;

  document.getElementById('xfName').textContent = d.name || '—';
  document.getElementById('rpName').textContent = d.name || '—';
  document.getElementById('rpType').textContent = d.type || '';
  document.getElementById('rpVis').style.cssText =
    `width:72px;height:72px;border-radius:50%;margin:0 auto 11px;` +
    `background:radial-gradient(circle at 35% 35%,${lighten(d.col || '#888')},${d.col || '#888'} 65%,#000 100%);` +
    `box-shadow:0 0 28px ${d.col || '#4488ff'}44`;

  // Info grid
  const grid = document.getElementById('rpGrid');
  grid.innerHTML = '';
  if (d.info) {
    Object.entries(d.info).forEach(([k, v]) => {
      const b = document.createElement('div');
      b.className = 'ib';
      b.innerHTML = `<div class="ibl">${k}</div><div class="ibv">${v}</div>`;
      grid.appendChild(b);
    });
  }

  // Description
  const descEl = document.getElementById('rpDesc');
  if (d.desc) {
    descEl.style.display = 'block';
    descEl.innerHTML = `<div class="rp-desc-title">Description</div>${d.desc}`;
  } else {
    descEl.style.display = 'none';
  }

  document.getElementById('rp').classList.add('open');
  document.getElementById('focus').textContent = d.name || '—';
  document.querySelectorAll('.pitem').forEach(el =>
    el.classList.toggle('on', el.dataset.name === (d.name || ''))
  );

  xfLoadCurrentState();

  // Particle effect on click
  const pos = new THREE.Vector3();
  obj.mesh.getWorldPosition(pos);
  spawnParticles(pos, d.col || 0xffffff);
}

// ══ CLOSE RIGHT PANEL ══
export function rpClose() {
  document.getElementById('rp').classList.remove('open');
  state.selObj = null;
  document.getElementById('xfName').textContent = 'None selected';
}

// ══ FOCUS CAMERA ON OBJECT ══
export function rpFocus() {
  if (!state.selObj) return;
  const p = new THREE.Vector3();
  state.selObj.mesh.getWorldPosition(p);

  const baseOffset = (state.selObj.data.type === 'Basic Geometry' ||
    state.selObj.data.type === 'Composite Object' ||
    state.selObj.data.type?.includes('3D Model')) ? 8 : 30;
  const dist = (state.selObj.data.r || 5) * 5 + baseOffset;

  const dir = camera.position.clone().sub(p).normalize();
  state.targetControlsPos.copy(p);
  state.targetCameraPos.copy(p).addScaledVector(dir, dist);
  state.isCameraLerping = true;
}

// ══ CAMERA PRESETS ══
export function camPreset(t) {
  state.isCameraLerping = true;
  state.targetControlsPos.set(0, 0, 0);
  if (t === 'top') state.targetCameraPos.set(0, 900, 0);
  else if (t === 'side') state.targetCameraPos.set(900, 40, 0);
  else if (t === 'iso') state.targetCameraPos.set(500, 400, 500);
  else state.targetCameraPos.set(0, 250, 500);
}

// ══ BUILD PLANET LIST UI ══
export function buildPlanetListUI() {
  const list = document.getElementById('plist');
  list.innerHTML = '';
  clickable
    .filter(o => o.data.type && (o.data.type.includes('Star') || o.data.type.includes('Terrestrial') || o.data.type.includes('Giant')))
    .forEach(obj => {
      const d = obj.data;
      const el = document.createElement('div');
      el.className = 'pitem';
      el.dataset.name = d.name;
      el.innerHTML = `<div class="pdot" style="background:${d.col}"></div>` +
        `<div><div class="pn">${d.name}</div>` +
        `<div style="font-size:9px;color:var(--mut)">${d.type}</div></div>`;
      el.onclick = () => { selectObj(obj); rpFocus(); };
      list.appendChild(el);
    });

  // Demo + model badges
  const badges = document.getElementById('demoBadgesContainer');
  badges.innerHTML = '';
  demoItemsData.forEach(item => {
    const b = document.createElement('span');
    b.className = 'sbadge';
    b.textContent = item.vn;
    b.onclick = () => {
      const obj = clickable.find(c => c.mesh === item.mesh);
      if (obj) { selectObj(obj); rpFocus(); }
    };
    badges.appendChild(b);
  });
}

// ══ PROJECT LABEL TO SCREEN ══
export function projectLabel(mesh, el) {
  mesh.getWorldPosition(tmpV);
  tmpV.project(camera);
  const x = (tmpV.x * .5 + .5) * canvasW() + PW;
  const y = (-tmpV.y * .5 + .5) * canvasH();
  if (tmpV.z > 1) { el.style.display = 'none'; return; }
  el.style.display = state.labelsVisible && document.getElementById('chkDemo').checked ? 'block' : 'none';
  el.style.left = x + 'px';
  el.style.top = (y - 30) + 'px';
}

// ══ MOUSE → NORMALIZED COORDS ══
function domMouse(e) {
  const r = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
  mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
}

// ══ INIT UI ══
export function initUI() {
  // Tab switching
  document.querySelectorAll('.tab').forEach(t =>
    t.addEventListener('click', () => setTab(t.dataset.t))
  );

  // Hover Tooltip (Raycaster)
  renderer.domElement.addEventListener('mousemove', e => {
    domMouse(e);
    ray.setFromCamera(mouse, camera);
    const hits = ray.intersectObjects(clickable.map(o => o.mesh));
    if (hits.length) {
      const f = clickable.find(o => o.mesh === hits[0].object);
      if (f) {
        tip.style.display = 'block';
        tip.style.left = (e.clientX + 14) + 'px';
        tip.style.top = (e.clientY - 32) + 'px';
        tip.textContent = f.data.name || '—';
        renderer.domElement.style.cursor = 'pointer';
      }
    } else {
      tip.style.display = 'none';
      renderer.domElement.style.cursor = 'grab';
    }
  });

  // Click Select (Raycaster)
  renderer.domElement.addEventListener('click', e => {
    domMouse(e);
    ray.setFromCamera(mouse, camera);
    const hits = ray.intersectObjects(clickable.map(o => o.mesh));
    if (hits.length) {
      const f = clickable.find(o => o.mesh === hits[0].object);
      if (f) selectObj(f);
    }
  });

  // Display checkboxes
  const B = (id, fn, ev = 'input') => document.getElementById(id).addEventListener(ev, fn);

  B('chkOrbit', function () { orbLines.forEach(l => l.visible = this.checked); }, 'change');
  B('chkLabel', function () {
    state.labelsVisible = this.checked;
    demoLabels.forEach(l => l.el.style.display = this.checked ? 'block' : 'none');
  }, 'change');
  B('chkDemo', function () {
    demoGroup.visible = this.checked;
    demoLabels.forEach(l => l.el.style.display = this.checked ? 'block' : 'none');
  }, 'change');
  B('chkWire', function () {
    allMeshes.forEach(m => {
      m.traverse(c => { if (c.isMesh && c.material) c.material.wireframe = this.checked; });
    });
  }, 'change');
  B('chkTexture', function () { toggleTextureMode(this.checked); }, 'change');
}
