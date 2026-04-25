// ══════════════════════════════════════════
// SOLAR SYSTEM
// Sun, 8 Planets, Moons, Orbits
// ══════════════════════════════════════════

import * as THREE from 'three';
import { scene } from './scene.js';
import { TX } from './textures.js';
import { deg, rand } from './utils.js';
import { clickable, orbLines, allMeshes } from './state.js';

// ══ PLANET DATA (with real scientific info from NASA) ══
// Size scale: Earth radius = 1.5 units (all planets proportional to real diameters)
// Sun compressed to 30 units (real scale would be ~164 units)
// Distance: sqrt-compressed for visual clarity
export const PD = [
  {
    name: 'Mercury', type: 'Rocky Terrestrial', r: 0.6, dist: 60, orb: .042, rot: .004, tilt: deg(.03),
    tex: 'mercury', col: '#8c7966',
    info: { Diameter: '4,879 km', Mass: '3.30 × 10²³ kg', 'Dist. from Sun': '57.9M km', 'Orbital Period': '88 days', 'Rotation': '58.6 days', Temperature: '−173 to 427°C', Atmosphere: 'None (trace)', Moons: '0' },
    desc: 'Mercury is the smallest planet in our solar system and nearest to the Sun. It has no atmosphere to retain heat, causing extreme temperature swings between day and night.',
    moons: []
  },
  {
    name: 'Venus', type: 'Rocky Terrestrial', r: 1.4, dist: 83, orb: .018, rot: -.002, tilt: deg(177),
    tex: 'venus', col: '#e8cda0',
    info: { Diameter: '12,104 km', Mass: '4.87 × 10²⁴ kg', 'Dist. from Sun': '108.2M km', 'Orbital Period': '225 days', 'Rotation': '243 days (retro)', Temperature: '462°C avg', Atmosphere: 'CO₂, N₂', Moons: '0' },
    desc: 'Venus is the hottest planet due to its dense CO₂ atmosphere creating a runaway greenhouse effect. It rotates backwards (retrograde) compared to most planets.',
    moons: []
  },
  {
    name: 'Earth', type: 'Rocky Terrestrial', r: 1.5, dist: 98, orb: .01, rot: .022, tilt: deg(23.4),
    tex: 'earth', col: '#4fa8e0',
    info: { Diameter: '12,742 km', Mass: '5.97 × 10²⁴ kg', 'Dist. from Sun': '149.6M km', 'Orbital Period': '365.25 days', 'Rotation': '23.93 hours', Temperature: '15°C avg', Atmosphere: 'N₂, O₂', Moons: '1' },
    desc: 'Earth is the only known planet to harbor life. Its magnetic field protects the atmosphere from solar wind, and liquid water covers 71% of its surface.',
    moons: [{ name: 'Moon', r: 0.4, dist: 5, orb: .04, rot: .005, tex: 'moon', col: '#aaa' }]
  },
  {
    name: 'Mars', type: 'Rocky Terrestrial', r: 0.8, dist: 121, orb: .008, rot: .02, tilt: deg(25),
    tex: 'mars', col: '#c1440e',
    info: { Diameter: '6,779 km', Mass: '6.42 × 10²³ kg', 'Dist. from Sun': '227.9M km', 'Orbital Period': '687 days', 'Rotation': '24.62 hours', Temperature: '−65°C avg', Atmosphere: 'CO₂, Ar, N₂', Moons: '2' },
    desc: 'Mars is called the Red Planet due to iron oxide on its surface. It has the tallest volcano (Olympus Mons) and the deepest canyon (Valles Marineris) in the solar system.',
    moons: [{ name: 'Phobos', r: 0.15, dist: 3, orb: .1, rot: .01, tex: 'moon', col: '#888' }, { name: 'Deimos', r: 0.1, dist: 4.5, orb: .055, rot: .008, tex: 'moon', col: '#999' }]
  },
  {
    name: 'Jupiter', type: 'Gas Giant', r: 16.5, dist: 223, orb: .004, rot: .042, tilt: deg(3.1),
    tex: 'jupiter', col: '#b07545', rings: false,
    info: { Diameter: '139,820 km', Mass: '1.90 × 10²⁷ kg', 'Dist. from Sun': '778.5M km', 'Orbital Period': '11.86 years', 'Rotation': '9.93 hours', Temperature: '−110°C avg', Atmosphere: 'H₂, He', Moons: '95 confirmed' },
    desc: 'Jupiter is the largest planet, with a mass greater than all other planets combined. The Great Red Spot is a storm that has raged for over 350 years.',
    moons: [
      { name: 'Io', r: 0.43, dist: 25, orb: .032, rot: .01, tex: 'moon', col: '#e8c050' },
      { name: 'Europa', r: 0.37, dist: 32, orb: .024, rot: .008, tex: 'moon', col: '#c8b8a0' },
      { name: 'Ganymede', r: 0.62, dist: 40, orb: .018, rot: .007, tex: 'moon', col: '#a0a8b0' },
      { name: 'Callisto', r: 0.57, dist: 48, orb: .013, rot: .006, tex: 'moon', col: '#8a8070' }
    ]
  },
  {
    name: 'Saturn', type: 'Gas Giant', r: 13.7, dist: 303, orb: .0028, rot: .04, tilt: deg(26.7),
    tex: 'saturn', col: '#e4d191', rings: true,
    info: { Diameter: '116,460 km', Mass: '5.68 × 10²⁶ kg', 'Dist. from Sun': '1.43B km', 'Orbital Period': '29.46 years', 'Rotation': '10.66 hours', Temperature: '−140°C avg', Atmosphere: 'H₂, He', Moons: '146 confirmed' },
    desc: 'Saturn is famous for its spectacular ring system made of ice and rock particles. It is the least dense planet — it would float in water if a bathtub were large enough.',
    moons: [
      { name: 'Titan', r: 0.60, dist: 32, orb: .014, rot: .005, tex: 'moon', col: '#c8a040' },
      { name: 'Enceladus', r: 0.06, dist: 24, orb: .028, rot: .01, tex: 'moon', col: '#e0e8f0' },
      { name: 'Rhea', r: 0.18, dist: 38, orb: .01, rot: .006, tex: 'moon', col: '#b0b0a8' }
    ]
  },
  {
    name: 'Uranus', type: 'Ice Giant', r: 6.0, dist: 429, orb: .0015, rot: .026, tilt: deg(97.8),
    tex: 'uranus', col: '#7de8e8', rings: true,
    info: { Diameter: '50,724 km', Mass: '8.68 × 10²⁵ kg', 'Dist. from Sun': '2.87B km', 'Orbital Period': '84.01 years', 'Rotation': '17.24 hours', Temperature: '−195°C avg', Atmosphere: 'H₂, He, CH₄', Moons: '27 confirmed' },
    desc: 'Uranus rotates on its side with an axial tilt of 97.8°, likely caused by an ancient collision. Its blue-green color comes from methane in the atmosphere.',
    moons: [
      { name: 'Titania', r: 0.19, dist: 14, orb: .018, rot: .007, tex: 'moon', col: '#aaa' },
      { name: 'Ariel', r: 0.14, dist: 10, orb: .025, rot: .009, tex: 'moon', col: '#bbb' },
      { name: 'Miranda', r: 0.06, dist: 18, orb: .012, rot: .005, tex: 'moon', col: '#999' }
    ]
  },
  {
    name: 'Neptune', type: 'Ice Giant', r: 5.8, dist: 536, orb: .001, rot: .029, tilt: deg(28.3),
    tex: 'neptune', col: '#3050e8',
    info: { Diameter: '49,244 km', Mass: '1.02 × 10²⁶ kg', 'Dist. from Sun': '4.50B km', 'Orbital Period': '164.8 years', 'Rotation': '16.11 hours', Temperature: '−200°C avg', Atmosphere: 'H₂, He, CH₄', Moons: '16 confirmed' },
    desc: 'Neptune has the strongest winds in the solar system, reaching speeds of 2,100 km/h. It was the first planet found using mathematical predictions rather than observation.',
    moons: [
      { name: 'Triton', r: 0.32, dist: 14, orb: -.015, rot: .005, tex: 'moon', col: '#a0b0c0' },
      { name: 'Proteus', r: 0.05, dist: 20, orb: .022, rot: .008, tex: 'moon', col: '#909090' }
    ]
  }
];

// ══ SOLAR SYSTEM STRUCTURE ══
export const SS = { sun: null, planets: [] };

// ── Create orbit line ──
function mkOrbit(dist) {
  const pts = [];
  for (let i = 0; i <= 130; i++) {
    const a = i / 130 * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * dist, 0, Math.sin(a) * dist));
  }
  const l = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({ color: 0x223355, transparent: true, opacity: .38 })
  );
  scene.add(l);
  orbLines.push(l);
  return l;
}

// ── Generate ring strip texture (linear gradient) ──
function makeRingTexture(colors) {
  const cv = document.createElement('canvas');
  cv.width = 512; cv.height = 64;
  const c = cv.getContext('2d');
  const g = c.createLinearGradient(0, 0, 512, 0);
  colors.forEach(([stop, col]) => g.addColorStop(stop, col));
  c.fillStyle = g;
  c.fillRect(0, 0, 512, 64);
  // Add grain noise for realism
  for (let i = 0; i < 2000; i++) {
    c.fillStyle = `rgba(${Math.random() > 0.5 ? 255 : 0},${Math.random() > 0.5 ? 200 : 100},50,${Math.random() * 0.06})`;
    c.fillRect(Math.random() * 512, Math.random() * 64, 1, 1);
  }
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.ClampToEdgeWrapping;
  return t;
}

// ── Create ring geometry ──
function mkRing(inner, outer, mat) {
  const g = new THREE.RingGeometry(inner, outer, 128, 6);
  const pos = g.attributes.position, uv = g.attributes.uv;
  const v3 = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v3.fromBufferAttribute(pos, i);
    const u = (v3.length() - inner) / (outer - inner);
    uv.setXY(i, u, 0.5);
  }
  const m = new THREE.Mesh(g, mat);
  m.rotation.x = -Math.PI / 2;
  return m;
}

// ── Build the Sun ──
function buildSun() {
  const m = new THREE.Mesh(
    new THREE.SphereGeometry(30, 64, 32),
    new THREE.MeshBasicMaterial({ map: TX.sun })
  );
  m.userData.texKey = 'sun';
  m.userData.baseColor = '#ff8800';
  scene.add(m);
  SS.sun = m;
  allMeshes.push(m);

  // Halo glow (scaled to new Sun size)
  [{ r: 42, a: .14, c: 0xff8800 }, { r: 55, a: .06, c: 0xff5500 }, { r: 72, a: .025, c: 0xff3300 }].forEach(({ r, a, c }) => {
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(r, 32, 32),
      new THREE.MeshBasicMaterial({
        color: c, transparent: true, opacity: a,
        blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false
      })
    );
    m.add(halo);
  });

  m.userData.xfGroup = new THREE.Group();
  scene.add(m.userData.xfGroup);
  m.userData.xfGroup.add(m);

  clickable.push({
    mesh: m,
    data: {
      name: 'Sun', type: 'Star (G2V Main Sequence)', col: '#ff8800',
      info: { Diameter: '1.39 million km', Mass: '1.99 × 10³⁰ kg', Temperature: '5,500°C surface', Age: '4.6 billion years', Composition: '73% H, 25% He', Luminosity: '3.83 × 10²⁶ W' },
      desc: 'The Sun is a G-type main-sequence star at the center of our solar system. It contains 99.86% of the total mass of the entire system and generates energy through hydrogen fusion in its core. (Note: Sun is shown at ~1/5 actual scale relative to planets for visual clarity.)',
      moons: []
    }
  });
}

// ── Build a single planet ──
function buildPlanet(d) {
  const orbitPivot = new THREE.Object3D();
  orbitPivot.rotation.y = rand(0, Math.PI * 2);
  scene.add(orbitPivot);

  const xfGroup = new THREE.Group();
  xfGroup.position.x = d.dist;
  orbitPivot.add(xfGroup);

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(d.r, 52, 26),
    new THREE.MeshStandardMaterial({
      map: TX[d.tex], roughness: 0.6, metalness: 0.1,
      emissive: new THREE.Color(0xffffff), emissiveMap: TX[d.tex], emissiveIntensity: 0.25
    })
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.rotation.z = d.tilt || 0;
  mesh.userData.texKey = d.tex;
  mesh.userData.baseColor = d.col;
  xfGroup.add(mesh);
  allMeshes.push(mesh);
  mesh.userData.xfGroup = xfGroup;
  mesh.userData.orbitPivot = orbitPivot;

  // Rings (Saturn, Uranus)
  if (d.rings) {
    let ringTex, innerMul, outerMul, ringOpacity;
    if (d.name === 'Saturn') {
      ringTex = makeRingTexture([
        [0, 'rgba(180,160,110,0)'],
        [0.05, 'rgba(200,180,130,0.5)'],
        [0.12, 'rgba(190,170,120,0.9)'],
        [0.22, 'rgba(170,150,100,0.3)'],
        [0.28, 'rgba(210,190,145,0.95)'],
        [0.45, 'rgba(195,175,130,0.85)'],
        [0.55, 'rgba(180,160,115,0.4)'],
        [0.62, 'rgba(200,185,140,0.8)'],
        [0.78, 'rgba(175,155,110,0.6)'],
        [0.9, 'rgba(160,140,100,0.3)'],
        [1, 'rgba(140,120,80,0)']
      ]);
      innerMul = 1.3; outerMul = 2.5; ringOpacity = 0.92;
    } else {
      ringTex = makeRingTexture([
        [0, 'rgba(120,200,210,0)'],
        [0.15, 'rgba(130,210,220,0.4)'],
        [0.5, 'rgba(100,180,190,0.3)'],
        [0.85, 'rgba(130,210,220,0.4)'],
        [1, 'rgba(120,200,210,0)']
      ]);
      innerMul = 1.4; outerMul = 2.0; ringOpacity = 0.65;
    }
    const ringMat = new THREE.MeshBasicMaterial({
      map: ringTex, side: THREE.DoubleSide, transparent: true, opacity: ringOpacity,
      depthWrite: false
    });
    const ring = mkRing(d.r * innerMul, d.r * outerMul, ringMat);
    mesh.add(ring);
  }

  // Moons
  const moonObjs = [];
  d.moons.forEach(md => {
    const mp = new THREE.Object3D();
    mp.rotation.y = rand(0, Math.PI * 2);
    mesh.add(mp);

    const mm = new THREE.Mesh(
      new THREE.SphereGeometry(md.r, 24, 16),
      new THREE.MeshStandardMaterial({
        map: TX[md.tex], emissive: new THREE.Color(0xffffff),
        emissiveMap: TX[md.tex], emissiveIntensity: 0.25
      })
    );
    mm.castShadow = true;
    mm.position.x = md.dist;
    mp.add(mm);
    allMeshes.push(mm);
    mm.userData.texKey = md.tex;
    mm.userData.baseColor = md.col;

    mm.userData.xfGroup = new THREE.Group();
    mm.position.set(0, 0, 0);
    mp.add(mm.userData.xfGroup);
    mm.userData.xfGroup.add(mm);
    mm.userData.xfGroup.position.x = md.dist;

    moonObjs.push({ pivot: mp, mesh: mm, data: md });
    clickable.push({
      mesh: mm,
      data: { name: md.name, type: 'Natural Satellite', col: md.col, info: {}, desc: `${md.name} is a natural satellite orbiting its parent planet.`, moons: [] }
    });
  });

  mkOrbit(d.dist);
  clickable.push({ mesh, data: d });
  return { orbitPivot, xfGroup, mesh, data: d, moons: moonObjs };
}

// ══ INITIALIZE SOLAR SYSTEM ══
export function initSolarSystem() {
  // Star background
  scene.add(new THREE.Mesh(
    new THREE.SphereGeometry(2200, 32, 32),
    new THREE.MeshBasicMaterial({ map: TX.stars, side: THREE.BackSide })
  ));

  buildSun();
  PD.forEach(d => SS.planets.push(buildPlanet(d)));
}
