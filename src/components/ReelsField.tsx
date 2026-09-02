import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Ambient WebGL dot-field for the Reels section — a grid of points that
 * breathes with a slow wave and ripples outward from the cursor. Pauses
 * off-screen/tab-hidden and skips entirely for prefers-reduced-motion.
 */
const ReelsField = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, 0, 0, 0, 0.1, 2000);
    camera.position.z = 400;

    const clock = new THREE.Clock();

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseActive: { value: 0 },
        uColorBase: { value: new THREE.Color("#111111") },
        uColorAccent: { value: new THREE.Color("#ff5a1f") },
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uMouseActive;
        attribute float aRandom;
        varying float vIntensity;

        void main() {
          vec3 pos = position;

          float wave = sin(pos.x * 0.012 + uTime * 0.6) * cos(pos.y * 0.014 + uTime * 0.45);
          pos.z += wave * 10.0;

          float dist = distance(pos.xy, uMouse);
          float ripple = smoothstep(160.0, 0.0, dist) * uMouseActive;
          pos.z += ripple * 46.0;

          vIntensity = clamp(wave * 0.5 + 0.5, 0.0, 1.0) * 0.5 + ripple;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = (1.4 + ripple * 3.6 + aRandom * 0.8) * (320.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vIntensity;
        uniform vec3 uColorBase;
        uniform vec3 uColorAccent;

        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;

          float alpha = smoothstep(0.5, 0.0, d);
          vec3 color = mix(uColorBase, uColorAccent, clamp(vIntensity, 0.0, 1.0));

          gl_FragColor = vec4(color, alpha * (0.12 + vIntensity * 0.55));
        }
      `,
    });

    const CELL = 42;
    const MAX_POINTS = 2600;

    let points: THREE.Points | null = null;
    let geometry: THREE.BufferGeometry | null = null;

    const buildGrid = (width: number, height: number) => {
      if (points) {
        scene.remove(points);
        geometry?.dispose();
      }

      let cols = Math.floor(width / CELL);
      let rows = Math.floor(height / CELL);

      while (cols * rows > MAX_POINTS) {
        cols = Math.floor(cols * 0.9);
        rows = Math.floor(rows * 0.9);
      }

      const count = Math.max(cols * rows, 0);
      const positions = new Float32Array(count * 3);
      const randoms = new Float32Array(count);

      const offsetX = -((cols - 1) * CELL) / 2;
      const offsetY = -((rows - 1) * CELL) / 2;

      let i = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          positions[i * 3] = offsetX + x * CELL;
          positions[i * 3 + 1] = offsetY + y * CELL;
          positions[i * 3 + 2] = 0;
          randoms[i] = Math.random();
          i++;
        }
      }

      geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

      points = new THREE.Points(geometry, material);
      scene.add(points);
    };

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      if (width === 0 || height === 0) return;

      renderer.setSize(width, height, false);

      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();

      buildGrid(width, height);
    };

    const mouseTarget = new THREE.Vector2(0, 0);
    let mouseActiveTarget = 0;
    let idleTimeout: ReturnType<typeof setTimeout>;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        mouseActiveTarget = 0;
        return;
      }

      mouseTarget.x = event.clientX - rect.left - rect.width / 2;
      mouseTarget.y = -(event.clientY - rect.top - rect.height / 2);
      mouseActiveTarget = 1;

      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        mouseActiveTarget = 0;
      }, 1400);
    };

    const handlePointerLeave = () => {
      mouseActiveTarget = 0;
    };

    let frameId: number;
    let isVisible = true;
    let mouseActive = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isVisible || document.hidden) return;

      const mouse = material.uniforms.uMouse.value as THREE.Vector2;
      mouse.x += (mouseTarget.x - mouse.x) * 0.08;
      mouse.y += (mouseTarget.y - mouse.y) * 0.08;
      mouseActive += (mouseActiveTarget - mouseActive) * 0.06;

      material.uniforms.uTime.value = clock.getElapsedTime();
      material.uniforms.uMouseActive.value = mouseActive;

      renderer.render(scene, camera);
    };

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    intersectionObserver.observe(mount);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    resize();
    window.addEventListener("pointermove", handlePointerMove);
    mount.addEventListener("pointerleave", handlePointerLeave);
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(idleTimeout);
      window.removeEventListener("pointermove", handlePointerMove);
      mount.removeEventListener("pointerleave", handlePointerLeave);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      geometry?.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="pointer-events-none absolute inset-0 z-0" aria-hidden="true" />;
};

export default ReelsField;
