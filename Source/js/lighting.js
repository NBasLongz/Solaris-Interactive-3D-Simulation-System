// ══════════════════════════════════════════
// CHIẾU SÁNG & BÓNG ĐỔ (LIGHTING)
// Ambient + Hemisphere + Point + Directional
// ══════════════════════════════════════════

import * as THREE from 'three';
import { scene } from './scene.js';

// ══ ÁNH SÁNG MÔI TRƯỜNG (Ambient Light) ══
// Chiếu sáng đều mọi hướng, không tạo bóng
export const ambLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambLight);

// ══ ÁNH SÁNG BÁN CẦU (Hemisphere Light) ══
// Mô phỏng ánh sáng trời + phản xạ mặt đất
export const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
scene.add(hemiLight);

// ══ NGUỒN SÁNG ĐIỂM (Point Light - Mặt Trời) ══
// Phát sáng từ tâm Mặt Trời ra mọi hướng
export const sunLight = new THREE.PointLight(0xffffff, 5.0, 3500);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(1024, 1024);
sunLight.shadow.bias = -0.001;
scene.add(sunLight);

// ══ ÁNH SÁNG ĐỊNH HƯỚNG (Directional Light) ══
// Ánh sáng song song, tạo bóng đổ rõ ràng
export const dirLight = new THREE.DirectionalLight(0x8890c0, 0.35);
dirLight.position.set(100, 200, 50);
dirLight.castShadow = true;
dirLight.shadow.camera.left = -100;
dirLight.shadow.camera.right = 100;
dirLight.shadow.camera.top = 100;
dirLight.shadow.camera.bottom = -100;
scene.add(dirLight);

// ══ BINDING UI CONTROLS ══

/**
 * Gắn sự kiện cho các controls chiếu sáng trong panel
 */
export function bindLightingUI() {
  const B = (id, fn, ev = 'input') => document.getElementById(id).addEventListener(ev, fn);

  // Ambient Light
  B('chkAmb', function () { ambLight.visible = this.checked; }, 'change');
  B('sAmb', function () {
    ambLight.intensity = parseFloat(this.value);
    document.getElementById('vAmb').textContent = parseFloat(this.value).toFixed(2);
  });

  // Point Light (Mặt Trời)
  B('chkSun', function () { sunLight.visible = this.checked; }, 'change');
  B('sSun', function () {
    sunLight.intensity = parseFloat(this.value);
    document.getElementById('vSun').textContent = parseFloat(this.value).toFixed(1);
  });
  B('chkSunSh', function () { sunLight.castShadow = this.checked; }, 'change');

  // Directional Light
  B('chkDir', function () { dirLight.visible = this.checked; }, 'change');
  B('sDir', function () {
    dirLight.intensity = parseFloat(this.value);
    document.getElementById('vDir').textContent = parseFloat(this.value).toFixed(2);
  });
  B('sDx', function () {
    dirLight.position.x = parseFloat(this.value) * 10;
    document.getElementById('vDx').textContent = parseFloat(this.value).toFixed(1);
  });
}
