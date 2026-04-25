// ══════════════════════════════════════════
// PHÉP BIẾN ĐỔI AFFINE (TRANSFORM)
// Tịnh tiến, Quay, Tỉ lệ
// ══════════════════════════════════════════

import { deg } from './utils.js';
import { state } from './state.js';

// ══ TRẠNG THÁI BIẾN ĐỔI ══
export const xfState = { tx: 0, ty: 0, tz: 0, rx: 0, ry: 0, rz: 0, sc: 1 };

/**
 * Đọc trạng thái biến đổi hiện tại từ đối tượng đang chọn
 * và cập nhật các slider UI
 */
export function xfLoadCurrentState() {
  if (!state.selObj) return;
  const m = state.selObj.mesh;

  xfState.tx = m.userData.utx || 0;
  xfState.ty = m.userData.uty || 0;
  xfState.tz = m.userData.utz || 0;
  xfState.rx = m.userData.urx || 0;
  xfState.ry = m.userData.ury || 0;
  xfState.rz = m.userData.urz || 0;
  xfState.sc = m.userData.usc || 1;

  document.getElementById('stx').value = xfState.tx;
  document.getElementById('sty').value = xfState.ty;
  document.getElementById('stz').value = xfState.tz;
  document.getElementById('srx').value = xfState.rx;
  document.getElementById('sry').value = xfState.ry;
  document.getElementById('srz').value = xfState.rz;
  document.getElementById('ssc').value = xfState.sc;
  xfUpdateLabels();
}

/**
 * Áp dụng phép biến đổi Affine lên đối tượng đang chọn
 * - Tịnh tiến (Translate): dịch chuyển trong không gian 3D
 * - Quay (Rotate): xoay quanh trục X, Y, Z
 * - Tỉ lệ (Scale): phóng to / thu nhỏ
 */
export function xfApply() {
  if (!state.selObj) return;
  const m = state.selObj.mesh;
  const xfGrp = m.userData.xfGroup || m;

  // Lưu trạng thái vào userData
  m.userData.utx = xfState.tx;
  m.userData.uty = xfState.ty;
  m.userData.utz = xfState.tz;
  m.userData.urx = xfState.rx;
  m.userData.ury = xfState.ry;
  m.userData.urz = xfState.rz;
  m.userData.usc = xfState.sc;

  // Tính vị trí gốc (base distance) cho hành tinh
  const baseDist = (state.selObj.data &&
    state.selObj.data.type !== 'Hình học cơ bản' &&
    state.selObj.data.type !== '3D Model Import' &&
    state.selObj.data.type !== 'Vật thể tự ghép')
    ? state.selObj.data.dist || 0 : 0;

  // Phép Tịnh Tiến (Translate)
  xfGrp.position.set(baseDist + xfState.tx, xfState.ty, xfState.tz);

  // Phép Quay (Rotate) - chuyển độ sang radian
  m.rotation.set(deg(xfState.rx), deg(xfState.ry), deg(xfState.rz));

  // Phép Tỉ Lệ (Scale) - đồng đều 3 trục
  m.scale.setScalar(xfState.sc);
}

/**
 * Cập nhật labels hiển thị giá trị biến đổi
 */
export function xfUpdateLabels() {
  document.getElementById('vtx').textContent = xfState.tx.toFixed(1);
  document.getElementById('vty').textContent = xfState.ty.toFixed(1);
  document.getElementById('vtz').textContent = xfState.tz.toFixed(1);
  document.getElementById('vrx').textContent = xfState.rx + '°';
  document.getElementById('vry').textContent = xfState.ry + '°';
  document.getElementById('vrz').textContent = xfState.rz + '°';
  document.getElementById('vsc').textContent = xfState.sc.toFixed(2) + '×';
}

/**
 * Reset tất cả phép biến đổi về mặc định
 */
export function xfReset() {
  xfState.tx = 0; xfState.ty = 0; xfState.tz = 0;
  xfState.rx = 0; xfState.ry = 0; xfState.rz = 0;
  xfState.sc = 1;
  xfUpdateLabels();
  xfApply();
  ['tx', 'ty', 'tz', 'rx', 'ry', 'rz'].forEach(k => {
    document.getElementById('s' + k).value = 0;
  });
  document.getElementById('ssc').value = 1;
}

/**
 * Toggle tự động xoay (Auto Spin) cho đối tượng đang chọn
 */
export function xfAuto() {
  state.autoSpinModel = !state.autoSpinModel;
  document.querySelector('[onclick="xfAuto()"]').textContent =
    state.autoSpinModel ? '⏸ Dừng Auto Spin' : '▶ Auto Spin Model';
}

// ══ BINDING UI CONTROLS ══

/**
 * Gắn sự kiện cho các slider biến đổi Affine
 */
export function bindTransformUI() {
  // Tịnh tiến (Translate)
  ['tx', 'ty', 'tz'].forEach(k => {
    document.getElementById('s' + k).addEventListener('input', function () {
      xfState[k] = parseFloat(this.value);
      xfUpdateLabels();
      xfApply();
    });
  });

  // Quay (Rotate)
  ['rx', 'ry', 'rz'].forEach(k => {
    document.getElementById('s' + k).addEventListener('input', function () {
      xfState[k] = parseInt(this.value);
      xfUpdateLabels();
      xfApply();
    });
  });

  // Tỉ lệ (Scale)
  document.getElementById('ssc').addEventListener('input', function () {
    xfState.sc = parseFloat(this.value);
    xfUpdateLabels();
    xfApply();
  });
}
