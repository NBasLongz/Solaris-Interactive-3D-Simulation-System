// ══════════════════════════════════════════
// LOADER (FILE LOADING)
// Upload texture + Upload model 3D
// + Auto-load multiple GLB models from CDN
// ══════════════════════════════════════════

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene } from './scene.js';
import { state, clickable, allMeshes, demoLabels, demoItemsData } from './state.js';
import { selectObj, rpFocus, buildPlanetListUI } from './ui.js';
import { demoGroup } from './demoObjects.js';
import { rand } from './utils.js';

const gltfLoader = new GLTFLoader();
const KHRONOS_BASE = 'https://raw.GithubUserContent.com/KhronosGroup/glTF-Sample-Assets/main/./Models';

// ══ GLB MODELS TO AUTO-LOAD ══
const AUTO_MODELS = [
  {
    name: 'Flight Helmet', url: `${KHRONOS_BASE}/DamagedHelmet/glTF-Binary/DamagedHelmet.glb`,
    scale: 0.8, dist: 80, angle: 0.5, yOff: 12,
    info: { Format: 'glTF Binary (.glb)', Source: 'KhronosGroup', License: 'CC BY 4.0', Polygons: '~15k' },
    desc: 'A damaged sci-fi flight helmet with PBR materials including normal maps, emissive, and occlusion textures. Standard test model for physically-based rendering pipelines.'
  },
  {
    name: 'Antique Camera', url: `${KHRONOS_BASE}/AntiqueCamera/glTF-Binary/AntiqueCamera.glb`,
    scale: 2.2, dist: 150, angle: 1.8, yOff: -15,
    info: { Format: 'glTF Binary (.glb)', Source: 'KhronosGroup', License: 'CC0 1.0', Polygons: '~8k' },
    desc: 'A detailed antique camera on a wooden tripod. Showcases multi-material rendering with different roughness and metalness values across components.'
  },
  {
    name: 'Water Bottle', url: `${KHRONOS_BASE}/WaterBottle/glTF-Binary/WaterBottle.glb`,
    scale: 6.5, dist: 250, angle: 2.8, yOff: 20,
    info: { Format: 'glTF Binary (.glb)', Source: 'KhronosGroup (Microsoft)', License: 'CC0 1.0', Polygons: '~13k' },
    desc: 'A metal water bottle with detailed PBR textures demonstrating metallic-roughness workflow. Features base color, normal, occlusion, and emissive maps.'
  },
  {
    name: 'Classic Duck', url: `${KHRONOS_BASE}/Duck/glTF-Binary/Duck.glb`,
    scale: 0.008, dist: 110, angle: 3.6, yOff: -8,
    info: { Format: 'glTF Binary (.glb)', Source: 'KhronosGroup (Sony)', License: 'SCEA', Polygons: '~4.8k' },
    desc: 'The iconic COLLADA duck — one of the most recognizable test models in computer graphics history, originally created by Sony for testing 3D pipelines.'
  },
  {
    name: 'Sci-Fi Helmet', url: `${KHRONOS_BASE}/SciFiHelmet/glTF/SciFiHelmet.gltf`,
    scale: 0.8, dist: 350, angle: 4.2, yOff: 10,
    info: { Format: 'glTF (.gltf)', Source: 'KhronosGroup', License: 'CC0 1.0', Polygons: '~11k' },
    desc: 'A futuristic sci-fi helmet featuring multiple texture layers. Demonstrates advanced PBR material techniques with detailed normal mapping and ambient occlusion.'
  },
  {
    name: 'Boom Box', url: `${KHRONOS_BASE}/BoomBox/glTF-Binary/BoomBox.glb`,
    scale: 22, dist: 200, angle: 5.0, yOff: -20,
    info: { Format: 'glTF Binary (.glb)', Source: 'KhronosGroup (Microsoft)', License: 'CC0 1.0', Polygons: '~5k' },
    desc: 'A retro boom box radio with a glowing front panel. Features emissive materials to simulate the illuminated display, combined with metallic and roughness textures.'
  },
  {
    name: 'Lantern', url: `${KHRONOS_BASE}/Lantern/glTF-Binary/Lantern.glb`,
    scale: 0.024, dist: 400, angle: 5.8, yOff: 15,
    info: { Format: 'glTF Binary (.glb)', Source: 'KhronosGroup (Microsoft)', License: 'CC0 1.0', Polygons: '~6k' },
    desc: 'An old wooden street lantern with metal fittings. Demonstrates multi-material objects with different metalness values for wood vs. metal components.'
  }
];

// ══ AUTO-LOAD MULTIPLE GLB MODELS FROM CDN ══
function autoLoadModels() {
  let loadedCount = 0;

  AUTO_MODELS.forEach((cfg, idx) => {
    gltfLoader.load(cfg.url, function (gltf) {
      const model = gltf.scene;

      const baseGroup = new THREE.Group();
      baseGroup.position.set(
        Math.cos(cfg.angle) * cfg.dist,
        cfg.yOff,
        Math.sin(cfg.angle) * cfg.dist
      );
      baseGroup.userData = {
        demo: true, isBase: true,
        dist: cfg.dist, angle: cfg.angle, yOffset: cfg.yOff,
        orbSpd: rand(0.003, 0.01) * (idx % 2 === 0 ? 1 : -1),
        rotSpd: new THREE.Vector3(rand(-0.005, 0.005), rand(0.005, 0.015), rand(-0.005, 0.005))
      };
      demoGroup.add(baseGroup);

      const xfGroup = new THREE.Group();
      baseGroup.add(xfGroup);

      model.scale.setScalar(cfg.scale);
      xfGroup.add(model);
      allMeshes.push(model);

      model.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      // Hitbox for raycasting
      const bbox = new THREE.Box3().setFromObject(model);
      const size = bbox.getSize(new THREE.Vector3());
      const hitbox = new THREE.Mesh(
        new THREE.BoxGeometry(size.x, size.y, size.z),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      const center = bbox.getCenter(new THREE.Vector3());
      hitbox.position.copy(center);
      hitbox.userData = {
        xfGroup, baseGroup,
        utx: 0, uty: 0, utz: 0,
        urx: 0, ury: 0, urz: 0,
        usc: 1
      };
      xfGroup.add(hitbox);

      const modelData = {
        name: cfg.name, type: '3D Model (File Load)',
        col: '#ffaa44', r: Math.max(size.x, size.y, size.z) / 2,
        info: cfg.info, desc: cfg.desc,
        moons: []
      };

      clickable.push({ mesh: hitbox, data: modelData });
      demoItemsData.push({ mesh: hitbox, vn: cfg.name });

      const lb = document.createElement('div');
      lb.className = 'plabel';
      lb.textContent = cfg.name;
      document.body.appendChild(lb);
      demoLabels.push({ el: lb, mesh: hitbox });

      loadedCount++;
      console.log(`✅ Loaded model ${loadedCount}/${AUTO_MODELS.length}: ${cfg.name}`);

      // Rebuild UI after all models loaded
      if (loadedCount === AUTO_MODELS.length) {
        buildPlanetListUI();
        console.log(`🎉 All ${AUTO_MODELS.length} GLB models loaded successfully!`);
      }
    }, undefined, function (error) {
      console.warn(`⚠ Failed to load model: ${cfg.name}`, error);
      loadedCount++;
    });
  });
}

// ══ INITIALIZE LOADERS (BIND EVENTS) ══
export function initLoaders() {
  // Upload Texture → apply to selected object
  document.getElementById('texUpload').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!state.selObj) {
      alert('Please click on an object first before loading a texture!');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (evt) {
      const img = new Image();
      img.onload = () => {
        const tex = new THREE.Texture(img);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
        if (state.selObj.mesh.material) {
          state.selObj.mesh.traverse(child => {
            if (child.isMesh && child.material) {
              child.material.map = tex;
              child.material.color.setHex(0xffffff);
              child.material.needsUpdate = true;
            }
          });
        }
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Upload 3D Model (.glb / .gltf)
  document.getElementById('modelUpload').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (evt) {
      gltfLoader.parse(evt.target.result, '', function (gltf) {
        const model = gltf.scene;
        const xfGroup = new THREE.Group();
        xfGroup.position.set(rand(-80, 80), rand(-20, 20), rand(-80, 80));
        scene.add(xfGroup);

        model.scale.setScalar(5);
        xfGroup.add(model);
        allMeshes.push(model);

        model.traverse(child => {
          if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; }
        });

        const modelData = {
          name: file.name, type: '3D Model (User Upload)',
          col: '#aaaaaa',
          info: { 'File Name': file.name, Format: 'glTF/GLB', Source: 'User Upload' },
          desc: `User-uploaded 3D model: ${file.name}. This model was imported via the file upload feature.`,
          moons: []
        };
        model.userData.xfGroup = xfGroup;
        clickable.push({ mesh: model, data: modelData });

        buildPlanetListUI();
        alert(`✅ Model "${file.name}" loaded successfully!`);
      }, (error) => {
        console.error(error);
        alert('Error loading model. Please try a standard .glb file.');
      });
    };
    reader.readAsArrayBuffer(file);
  });

  // Auto-load 7 GLB models from KhronosGroup CDN
  autoLoadModels();
}
