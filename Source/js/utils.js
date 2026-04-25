// ══════════════════════════════════════════
// TIỆN ÍCH (UTILITY FUNCTIONS)
// ══════════════════════════════════════════

/**
 * Chuyển đổi độ (degree) sang radian
 * @param {number} v - Góc tính theo độ
 * @returns {number} Góc tính theo radian
 */
export const deg = v => v * Math.PI / 180;

/**
 * Random số thực trong khoảng [a, b]
 * @param {number} a - Giá trị nhỏ nhất
 * @param {number} b - Giá trị lớn nhất
 * @returns {number}
 */
export const rand = (a, b) => a + Math.random() * (b - a);

// Trích xuất kênh RGB từ chuỗi hex color
export const lx = c => parseInt(c.slice(1, 3), 16);
export const ly = c => parseInt(c.slice(3, 5), 16);
export const lz = c => parseInt(c.slice(5, 7), 16);

/**
 * Làm sáng một màu hex lên (~90 đơn vị RGB)
 * @param {string} c - Chuỗi hex color (vd: '#ff8800')
 * @returns {string} Chuỗi màu rgb() đã sáng hơn
 */
export const lighten = c => {
  try {
    return `rgb(${Math.min(255, lx(c) + 90)},${Math.min(255, ly(c) + 90)},${Math.min(255, lz(c) + 90)})`;
  } catch {
    return '#fff';
  }
};
