"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { products } from "../data/products";

const N = products.length;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => t * t * (3 - 2 * t);

const BG = ["#e8e1d5", ...products.map((p) => p.bg), "#f6f2ec"].map((c) => new THREE.Color(c));
const R = 0.5; // radius
const B = 2.3; // label wala body ka height (slim can)

function loadTexture(p, renderer) {
  return new Promise((resolve) => {
    new THREE.TextureLoader().load(
      p.label,
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.wrapS = THREE.RepeatWrapping;
        t.offset.x = p.faceU; // brand ko front par laata hai
        t.anisotropy = renderer.capabilities.getMaxAnisotropy();
        resolve(t);
      },
      undefined,
      () => resolve(null)
    );
  });
}

function lathe(points, material) {
  const m = new THREE.Mesh(new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), 64), material);
  return m;
}

// Poora label 360 degree can par lipta hota hai (peeche nutrition table aur barcode bhi dikhta hai)
function makeCan(tex) {
  const g = new THREE.Group();
  const labelMat = new THREE.MeshPhysicalMaterial({
    map: tex,
    color: tex ? 0xffffff : 0x222226,
    metalness: 0.35,
    roughness: 0.5,
    clearcoat: 0.45,
    clearcoatRoughness: 0.3,
  });
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(R, R, B, 96, 1, true), labelMat));

  const silver = new THREE.MeshStandardMaterial({ color: 0xd4d7dc, metalness: 1, roughness: 0.22, side: THREE.DoubleSide });
  const dark = new THREE.MeshStandardMaterial({ color: 0x9a9da5, metalness: 1, roughness: 0.38, side: THREE.DoubleSide });
  const t = B / 2;
  const top = lathe(
    [[0, 0.17], [0.38, 0.17], [0.4, 0.2], [0.43, 0.2], [0.44, 0.17], [0.43, 0.12], [0.46, 0.07], [0.49, 0.025], [R, 0]],
    silver
  );
  top.position.y = t;
  const bottom = lathe(
    [[R, 0], [0.49, -0.03], [0.45, -0.08], [0.41, -0.11], [0.36, -0.09], [0.3, -0.12], [0, -0.12]],
    dark
  );
  bottom.position.y = -t;
  g.add(top, bottom);
  return g;
}

function metrics(w, h, hw) {
  const mobile = w / h < 0.85;
  return mobile
    ? { mobile, focX: 0, focY: 1.0, focS: 0.85, fanX: hw * 0.62, fanY: 1.0, fanS: 0.45 }
    : { mobile, focX: Math.min(2.6, hw * 0.42), focY: 0, focS: 1.2, fanX: Math.min(2.2, hw * 0.38), fanY: 0.1, fanS: 0.85 };
}

function keyframes(k, m) {
  const a = k + 1;
  const side = k % 2 === 0 ? 1 : -1;
  const mid = (N - 1) / 2;
  const fan = { x: (k - mid) * m.fanX, y: m.fanY, sc: m.fanS, rz: (mid - k) * 0.18, z: k === Math.round(mid) ? 0.6 : 0 };
  const foc = { x: m.mobile ? 0 : side * m.focX, y: m.focY, sc: m.focS, rz: -side * 0.1, z: 0 };
  const below = { ...foc, y: -7 };
  const above = { ...foc, y: 7 };
  if (k === 0) return [{ s: 0, st: fan }, { s: 1, st: foc }, { s: 2, st: above }];
  return [{ s: 0, st: fan }, { s: 0.45, st: fan }, { s: 1, st: below }, { s: a - 1, st: below }, { s: a, st: foc }, { s: a + 1, st: above }];
}

function sample(frames, s) {
  if (s <= frames[0].s) return frames[0].st;
  for (let i = 0; i < frames.length - 1; i++) {
    const A = frames[i], Bf = frames[i + 1];
    if (Bf.s === A.s) continue;
    if (s <= Bf.s) {
      const t = ease(clamp((s - A.s) / (Bf.s - A.s)));
      const o = {};
      for (const key of ["x", "y", "z", "sc", "rz"]) o[key] = lerp(A.st[key], Bf.st[key], t);
      return o;
    }
  }
  return frames[frames.length - 1].st;
}

export default function CanScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    let raf = 0;
    let disposed = false;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      console.error("WebGL not available", e);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.9;
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 1.2);
    rim.position.set(-4, 2, -3);
    scene.add(rim);
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));

    const FOV = 35, CAMZ = 9;
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);
    camera.position.set(0, 0, CAMZ);

    let m = metrics(1, 1, 1);
    const resize = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const hw = Math.tan((FOV * Math.PI) / 360) * CAMZ * camera.aspect;
      m = metrics(w, h, hw);
    };
    resize();
    window.addEventListener("resize", resize);

    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const story = document.getElementById("story");
    const holders = [];

    Promise.all(products.map((p) => loadTexture(p, renderer))).then((texs) => {
      if (disposed) return;
      texs.forEach((tex) => {
        const holder = new THREE.Group();
        const can = makeCan(tex);
        holder.add(can);
        holder.userData.can = can;
        scene.add(holder);
        holders.push(holder);
      });
      frame();
    });

    const col = new THREE.Color();
    let cur = 0;
    function frame() {
      raf = requestAnimationFrame(frame);
      const unit = story ? story.offsetHeight / (N + 1) : window.innerHeight;
      const target = clamp(window.scrollY / unit, 0, N + 1.2);
      cur += (target - cur) * (reduce ? 1 : 0.1);

      holders.forEach((h, k) => {
        const st = sample(keyframes(k, m), cur);
        h.position.set(st.x, st.y, st.z);
        h.scale.setScalar(st.sc);
        h.rotation.set(0.12, 0, st.rz);
        h.userData.can.rotation.y = (cur * Math.PI * 2) / (k + 1);
      });

      if (story) {
        const i = Math.min(N, Math.floor(cur));
        col.copy(BG[i]).lerp(BG[i + 1], ease(clamp(cur - i)));
        story.style.backgroundColor = "#" + col.getHexString();
      }
      renderer.domElement.style.visibility = cur >= N + 1 ? "hidden" : "visible";
      renderer.render(scene, camera);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          if (o.material.map) o.material.map.dispose();
          o.material.dispose();
        }
      });
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="scene" ref={mountRef} aria-hidden="true" />;
}
