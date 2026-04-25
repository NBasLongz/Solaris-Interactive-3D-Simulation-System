// ══════════════════════════════════════════
// PARTICLE SYSTEM (HIỆU ỨNG HẠT)
// Tạo hiệu ứng nổ hạt khi click vào vật thể
// ══════════════════════════════════════════

import * as THREE from 'three';
import { scene } from './scene.js';
import { rand } from './utils.js';

const activeParticles = [];
const particleGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);

/**
 * Tạo hiệu ứng nổ hạt tại vị trí cho trước
 * @param {THREE.Vector3} position - Vị trí spawn
 * @param {number|string} colorHex - Màu hạt
 */
export function spawnParticles(position, colorHex) {
  const count = 20;
  for (let i = 0; i < count; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: colorHex || 0xffffff,
      transparent: true
    });
    const p = new THREE.Mesh(particleGeo, mat);
    p.position.copy(position);

    // Random vận tốc 3D
    const vx = (Math.random() - 0.5) * 2;
    const vy = (Math.random() - 0.5) * 2;
    const vz = (Math.random() - 0.5) * 2;
    p.userData.velocity = new THREE.Vector3(vx, vy, vz).normalize().multiplyScalar(rand(15, 35));
    p.userData.life = 1.0;          // Vòng đời hạt
    p.userData.decay = rand(0.5, 1.5); // Tốc độ biến mất

    scene.add(p);
    activeParticles.push(p);
  }
}

/**
 * Cập nhật hệ thống hạt mỗi frame
 * @param {number} dt - Delta time (giây)
 */
export function updateParticles(dt) {
  for (let i = activeParticles.length - 1; i >= 0; i--) {
    const p = activeParticles[i];
    p.position.addScaledVector(p.userData.velocity, dt);
    p.userData.life -= p.userData.decay * dt;

    if (p.userData.life <= 0) {
      scene.remove(p);
      p.material.dispose();
      activeParticles.splice(i, 1);
    } else {
      p.scale.setScalar(p.userData.life);
      p.material.opacity = p.userData.life;
    }
  }
}
