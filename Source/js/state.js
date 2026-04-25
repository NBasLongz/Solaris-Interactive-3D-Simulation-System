// ══════════════════════════════════════════
// TRẠNG THÁI TOÀN CỤC (SHARED STATE)
// Module chứa trạng thái dùng chung giữa các module
// để tránh circular dependency.
// ══════════════════════════════════════════

import * as THREE from 'three';

/**
 * Trạng thái ứng dụng (mutable)
 */
export const state = {
  /** Đối tượng đang được chọn */
  selObj: null,

  /** Có hiện nhãn (label) hay không */
  labelsVisible: true,

  /** Animation đang tạm dừng? */
  paused: false,

  /** Hệ số tốc độ quỹ đạo */
  speedMult: 1,

  /** Tự động xoay model đang chọn? */
  autoSpinModel: false,

  /** Camera đang lerp (di chuyển mượt) đến đích? */
  isCameraLerping: false,

  /** Vị trí đích camera */
  targetCameraPos: new THREE.Vector3(),

  /** Vị trí đích controls (nhìn vào đâu) */
  targetControlsPos: new THREE.Vector3(),
};

// ══ MẢNG DÙNG CHUNG ══

/** Danh sách các đối tượng có thể click (raycast) */
export const clickable = [];

/** Danh sách các đường quỹ đạo */
export const orbLines = [];

/** Tất cả mesh trong scene */
export const allMeshes = [];

/** Labels của các vật thể trôi dạt */
export const demoLabels = [];

/** Dữ liệu các vật thể trôi dạt (cho UI badges) */
export const demoItemsData = [];
