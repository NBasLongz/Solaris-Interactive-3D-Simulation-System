# 🌌 Solaris: Interactive 3D Simulation System
**CS105 · Computer Graphics Project · UIT**

---

## 📺 Project Preview
Looking at the simulation in action (Click to play):

<p align="center">
  <video src="https://github.com/NBasLongz/Solaris-Interactive-3D-Simulation-System/raw/main/Source/assets/models/video.mp4" width="100%" controls></video>
</p>

---

## 🚀 How to Run
1. **Quick Start**: Run `start_server.bat` in the `Source/` folder.
2. **Manual**: Open Terminal in `Source/` and run:
   ```bash
   python -m http.server 8000
   ```
3. **Access**: Open [http://localhost:8000](http://localhost:8000)

> **Note**: A local server is required for ES Modules and texture loading.

---

## 🛠 Features
- **Basic 3D Shapes**: Box, Sphere, Cone, Cylinder, Torus, Teapot, Icosahedron, Torus Knot.
- **Composite Object**: Modular Space Station.
- **3D Models**: Auto-loads 7 high-quality GLB models from CDN + User upload support.
- **Transformations**: Complete Affine transformations (Translate, Rotate, Scale) with UI sliders.
- **Camera**: Perspective projection with adjustable FOV, Near/Far planes, and position presets.
- **Lighting**: Ambient, Sun Point Light, and Directional light with real-time Shadow Mapping.
- **Shaders & Effects**: Bloom glow (Sun), Particle explosions, and textures mapping.
- **Easter Egg**: Special **J97 Cube** hidden in the floating debris.

---

## 🖱 Controls
- **Left Mouse Drag**: Rotate Camera
- **Right Mouse Drag**: Pan Camera
- **Scroll Wheel**: Zoom In/Out
- **Click Object**: Select to view details & Transform

---

## 🎨 Customization
Add your own planet textures to `Source/assets/textures/` (using `.jpg` format: `earth.jpg`, `mars.jpg`, etc.).
