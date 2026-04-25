// ══════════════════════════════════════════
// QUẢN LÝ TEXTURE
// Canvas-generated textures + Load ảnh thật
// + Toggle texture/màu nền
// ══════════════════════════════════════════

import * as THREE from 'three';
import { rand } from './utils.js';
import { allMeshes } from './state.js';

// ── Tạo texture bằng Canvas (fallback) ──
function mktex(sz, fn, rep = [1, 1]) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = sz;
  fn(cv.getContext('2d'), sz);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(...rep);
  return t;
}

function noise(c, s, a = 0.1) {
  for (let i = 0; i < s * s * 0.25; i++) {
    const v = Math.random() > .5 ? 255 : 0;
    c.fillStyle = `rgba(${v},${v},${v},${a * Math.random()})`;
    c.fillRect(Math.random() * s, Math.random() * s, 1, 1);
  }
}

// ══ CANVAS-GENERATED TEXTURES (mặc định) ══
export const TX = {
  sun: mktex(512, (c, s) => {
    const g = c.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, '#fffce8'); g.addColorStop(.25, '#ffee44');
    g.addColorStop(.6, '#ff9000'); g.addColorStop(1, '#ff3800');
    c.fillStyle = g; c.fillRect(0, 0, s, s); noise(c, s, .04);
  }),
  mercury: mktex(512, (c, s) => {
    c.fillStyle = '#887462'; c.fillRect(0, 0, s, s); noise(c, s, .07);
  }),
  venus: mktex(512, (c, s) => {
    const g = c.createLinearGradient(0, 0, s, s);
    g.addColorStop(0, '#d9a85e'); g.addColorStop(.5, '#e8ca88'); g.addColorStop(1, '#b87a30');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    for (let i = 0; i < 14; i++) {
      c.fillStyle = `rgba(${200 + rand(0, 40) | 0},${155 + rand(0, 40) | 0},${70 + rand(0, 30) | 0},.22)`;
      c.fillRect(0, rand(0, s), s, rand(12, 50));
    }
    noise(c, s, .05);
  }),
  earth: mktex(512, (c, s) => {
    c.fillStyle = '#1a4a96'; c.fillRect(0, 0, s, s);
    c.fillStyle = '#258434'; c.beginPath();
    c.ellipse(150, 150, 170, 130, rand(0, Math.PI), 0, Math.PI * 2); c.fill();
    noise(c, s, .025);
  }),
  moon: mktex(256, (c, s) => {
    c.fillStyle = '#aaaaaa'; c.fillRect(0, 0, s, s); noise(c, s, .06);
  }),
  mars: mktex(512, (c, s) => {
    const g = c.createLinearGradient(0, 0, s, s);
    g.addColorStop(0, '#c3450f'); g.addColorStop(.5, '#d4641c'); g.addColorStop(1, '#a82e0c');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    c.fillStyle = 'rgba(225,238,255,.65)'; c.beginPath();
    c.ellipse(s / 2, s * .04, s * .28, s * .055, 0, 0, Math.PI * 2); c.fill();
    for (let i = 0; i < 35; i++) {
      c.fillStyle = `rgba(80,30,10,${.08 + Math.random() * .14})`;
      c.beginPath();
      c.ellipse(rand(0, s), rand(0, s), rand(8, 55), rand(4, 22), rand(0, Math.PI), 0, Math.PI * 2);
      c.fill();
    }
    noise(c, s, .065);
  }),
  jupiter: mktex(512, (c, s) => {
    const bands = ['#c08048', '#d4a86a', '#c89058', '#e0c888', '#b86038', '#d4a060',
      '#c87848', '#e8d0a8', '#b85a2a', '#d4a870', '#c08848', '#e0c878', '#a85030', '#d09068'];
    const bh = s / bands.length;
    bands.forEach((col, i) => { c.fillStyle = col; c.fillRect(0, i * bh, s, bh + 2); });
    c.fillStyle = 'rgba(185,55,30,.65)'; c.beginPath();
    c.ellipse(s * .34, s * .59, s * .09, s * .055, 0, 0, Math.PI * 2); c.fill();
    c.fillStyle = 'rgba(215,95,65,.35)'; c.beginPath();
    c.ellipse(s * .34, s * .59, s * .065, s * .038, 0, 0, Math.PI * 2); c.fill();
    noise(c, s, .04);
  }),
  saturn: mktex(512, (c, s) => {
    const bands = ['#e4da8a', '#d4c268', '#e8dea8', '#c8b450', '#ece8b8', '#d4be60', '#f0e8c8'];
    const bh = s / bands.length;
    bands.forEach((col, i) => { c.fillStyle = col; c.fillRect(0, i * bh, s, bh + 2); });
    noise(c, s, .035);
  }),
  saturnRing: mktex(512, (c, s) => {
    const grd = c.createRadialGradient(s / 2, s / 2, .4 * s / 2, s / 2, s / 2, .9 * s / 2);
    grd.addColorStop(0, 'transparent'); grd.addColorStop(.5, 'rgba(195,178,122,.65)');
    grd.addColorStop(1, 'transparent');
    c.fillStyle = grd; c.fillRect(0, 0, s, s);
  }),
  uranus: mktex(512, (c, s) => {
    const g = c.createLinearGradient(0, 0, s, s);
    g.addColorStop(0, '#5dd2e5'); g.addColorStop(.5, '#38c0d5'); g.addColorStop(1, '#28a0b5');
    c.fillStyle = g; c.fillRect(0, 0, s, s); noise(c, s, .025);
  }),
  neptune: mktex(512, (c, s) => {
    const g = c.createLinearGradient(0, 0, s, s);
    g.addColorStop(0, '#1e44df'); g.addColorStop(.4, '#1538cb');
    g.addColorStop(.8, '#2552e2'); g.addColorStop(1, '#101fa2');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    c.fillStyle = 'rgba(38,80,205,.45)'; c.beginPath();
    c.ellipse(s * .58, s * .38, s * .072, s * .048, 0, 0, Math.PI * 2);
    c.fill(); noise(c, s, .045);
  }),
  stars: mktex(2048, (c, s) => {
    c.fillStyle = '#000308'; c.fillRect(0, 0, s, s);
    for (let i = 0; i < 6000; i++) {
      c.fillStyle = '#fff'; c.globalAlpha = rand(.3, .9);
      c.beginPath(); c.arc(rand(0, s), rand(0, s), rand(.4, 2.5), 0, Math.PI * 2);
      c.fill();
    }
  }),
};

// ══ LOAD ẢNH TEXTURE THẬT TỪ THƯ MỤC assets/textures/ ══
const textureLoader = new THREE.TextureLoader();
const TEXTURE_PATH = 'assets/textures/';

/**
 * Thử tải ảnh texture thật từ file (.jpg)
 * Nếu thành công → override canvas texture và cập nhật materials
 */
export function loadRealTextures() {
  const names = ['sun', 'mercury', 'venus', 'earth', 'moon', 'mars',
    'jupiter', 'saturn', 'uranus', 'neptune'];

  names.forEach(name => {
    textureLoader.load(
      `${TEXTURE_PATH}${name}.jpg`,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        TX[name] = tex;

        // Cập nhật materials đã áp dụng texture này
        allMeshes.forEach(m => {
          m.traverse(child => {
            if (child.isMesh && child.userData.texKey === name && child.material) {
              child.material.map = tex;
              if (child.material.emissiveMap) child.material.emissiveMap = tex;
              child.material.needsUpdate = true;
            }
          });
        });
        console.log(`✅ Loaded texture: ${name}.jpg`);
      },
      undefined,
      () => { /* File không tồn tại → giữ canvas texture */ }
    );
  });
}

/**
 * Toggle hiển thị texture (ảnh) hoặc màu nền đơn sắc
 * Dùng cho checkbox "Hiện Texture (Ảnh)" trong UI
 * @param {boolean} showTexture - true = hiện texture, false = hiện màu nền
 */
export function toggleTextureMode(showTexture) {
  allMeshes.forEach(m => {
    m.traverse(child => {
      if (child.isMesh && child.material && child.userData.texKey) {
        if (showTexture) {
          // Bật texture: gán map và emissiveMap từ TX
          child.material.map = TX[child.userData.texKey];
          if (child.material.emissiveMap !== undefined) {
            child.material.emissiveMap = TX[child.userData.texKey];
          }
          child.material.color.setHex(0xffffff);
        } else {
          // Tắt texture: chỉ hiện màu nền đơn sắc
          child.material.map = null;
          if (child.material.emissiveMap !== undefined) {
            child.material.emissiveMap = null;
          }
          const baseCol = child.userData.baseColor || '#888888';
          child.material.color.set(baseCol);
        }
        child.material.needsUpdate = true;
      }
    });
  });
}
