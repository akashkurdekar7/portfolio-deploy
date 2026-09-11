import { useEffect, useRef, useState } from "react";
import type * as THREE from "three";
import gsap from "gsap";

interface AnimeGreeterProps {
  className?: string;
  style?: React.CSSProperties;
  /** When given, the character anchors below this element instead of the top-right default. */
  belowRef?: React.RefObject<HTMLElement | null>;
}

const GREETINGS = [
  "Yooo! 👋",
  "Namaskar! 🙏",
  "Kem Cho? 👀",
  "Namaste! ✨",
  "Yo yo! 😏",
  "Kya scene? 👀",
  "Aye yooo! 🚀",
  "Kaise ho? ✨",
  "Arre hello! 👋",
  "Chalo, let's go 🚀",
  "Namaskara! 🙏",
  "Oho, you're here 👀",
  "Ayo! What's up? 😏",
  "Kya bolta? 👀",
  "Chalo shuru karein 🚀",
];
const HEAD_R = 46;
const TORSO_R = 42;
const TORSO_LEN = 70;
const ARM_R = 15;
const ARM_LEN = 65;
const CHAR_HEIGHT = TORSO_LEN + TORSO_R * 2 + HEAD_R + 40;
const CENTER_X_FRACTION = 0.76;
const MARGIN_TOP = 70;
const GAP_BELOW = 28;

const canUseWebGL = () => {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
};

const shouldUseFallback = () =>
  typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !canUseWebGL();

const AnimeGreeter = ({ className, style, belowRef }: AnimeGreeterProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(shouldUseFallback);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const bubble = bubbleRef.current;
    const fallback = fallbackRef.current;

    // Screen-space anchor shared by both the 3D character and the CSS fallback:
    // below the linked element (e.g. the footer nav) when given, else top-right-ish.
    const anchorScreen = () => {
      const anchorEl = belowRef?.current;
      const mountRect = mount.getBoundingClientRect();

      if (anchorEl) {
        const anchorRect = anchorEl.getBoundingClientRect();
        return {
          x: anchorRect.left + anchorRect.width / 2 - mountRect.left,
          yTop: anchorRect.bottom - mountRect.top + GAP_BELOW,
          width: mountRect.width,
          height: mountRect.height,
        };
      }

      return {
        x: mountRect.width * CENTER_X_FRACTION,
        yTop: MARGIN_TOP,
        width: mountRect.width,
        height: mountRect.height,
      };
    };

    // No WebGL, or the user prefers reduced motion: show a static CSS greeting
    // instead of rendering nothing at all.
    if (useFallback) {
      const positionFallback = () => {
        const { x, yTop } = anchorScreen();
        if (fallback) {
          fallback.style.left = `${x}px`;
          fallback.style.top = `${yTop}px`;
        }
        if (bubble) {
          bubble.style.left = `${x}px`;
          bubble.style.top = `${yTop - 8}px`;
          bubble.style.opacity = "1";
        }
      };

      positionFallback();

      const resizeObserver = new ResizeObserver(positionFallback);
      resizeObserver.observe(mount);
      const anchorEl = belowRef?.current;
      if (anchorEl) resizeObserver.observe(anchorEl);

      // Content-only swap (no added motion), so it stays safe under
      // prefers-reduced-motion while still feeling alive.
      let greetingIndex = 0;
      const rotateGreeting = () => {
        greetingIndex = (greetingIndex + 1) % GREETINGS.length;
        if (bubble) bubble.textContent = GREETINGS[greetingIndex];
      };
      const greetingInterval = window.setInterval(rotateGreeting, 2600);

      return () => {
        resizeObserver.disconnect();
        window.clearInterval(greetingInterval);
      };
    }

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    // Loaded lazily so three.js (only needed for this WebGL character, and
    // only on non-desktop where the footer uses this instead of Crowd) stays
    // out of the main bundle that has to be parsed/evaluated before render.
    import("three").then((ThreeLib) => {
      if (cancelled) return;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new ThreeLib.WebGLRenderer({ alpha: true, antialias: true });
      } catch (error) {
        // Already passed the canUseWebGL() precheck, so this is an unexpected
        // late failure (e.g. context lost between precheck and now) — bail
        // quietly rather than flipping state synchronously inside the effect.
        console.warn("AnimeGreeter: WebGL renderer creation failed unexpectedly.", error);
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.domElement.style.display = "block";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      mount.appendChild(renderer.domElement);

      const scene = new ThreeLib.Scene();
      const camera = new ThreeLib.OrthographicCamera(0, 0, 0, 0, 0.1, 2000);
      camera.position.z = 500;

      scene.add(new ThreeLib.AmbientLight(0xffffff, 0.95));
      const key = new ThreeLib.DirectionalLight(0xffffff, 0.9);
      key.position.set(120, 220, 260);
      scene.add(key);
      const rim = new ThreeLib.DirectionalLight(0xff8a4c, 0.55);
      rim.position.set(-200, 80, -140);
      scene.add(rim);

      const skinMat = new ThreeLib.MeshStandardMaterial({ color: 0xffd9b3, roughness: 0.6 });
      const hairMat = new ThreeLib.MeshStandardMaterial({ color: 0x1c1c1c, roughness: 0.4 });
      const outfitMat = new ThreeLib.MeshStandardMaterial({ color: 0xff5a1f, roughness: 0.55 });
      const eyeMat = new ThreeLib.MeshBasicMaterial({ color: 0x181818 });
      const shineMat = new ThreeLib.MeshBasicMaterial({ color: 0xffffff });
      const blushMat = new ThreeLib.MeshBasicMaterial({ color: 0xff9d9d, transparent: true, opacity: 0.55 });
      const shadowMat = new ThreeLib.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 });

      const character = new ThreeLib.Group();

      const shadow = new ThreeLib.Mesh(new ThreeLib.CircleGeometry(70, 24), shadowMat);
      shadow.position.y = -6;
      shadow.position.z = -10;
      character.add(shadow);

      const torso = new ThreeLib.Mesh(new ThreeLib.CapsuleGeometry(TORSO_R, TORSO_LEN, 6, 14), outfitMat);
      torso.position.y = TORSO_LEN / 2 + TORSO_R;
      character.add(torso);

      const headY = TORSO_LEN + TORSO_R * 2 + HEAD_R * 0.5 + 4;

      const head = new ThreeLib.Mesh(new ThreeLib.SphereGeometry(HEAD_R, 28, 28), skinMat);
      head.position.y = headY;
      character.add(head);

      const hair = new ThreeLib.Mesh(new ThreeLib.SphereGeometry(HEAD_R + 3, 28, 28, 0, Math.PI * 2, 0, Math.PI * 0.4), hairMat);
      hair.position.set(0, headY + 12, -4);
      character.add(hair);

      const eyeGeo = new ThreeLib.SphereGeometry(8, 14, 14);
      const leftEye = new ThreeLib.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(-18, headY - 2, HEAD_R * 0.88);
      const rightEye = leftEye.clone();
      rightEye.position.x = 18;
      character.add(leftEye, rightEye);

      const shineGeo = new ThreeLib.SphereGeometry(2.8, 8, 8);
      const leftShine = new ThreeLib.Mesh(shineGeo, shineMat);
      leftShine.position.set(-15, headY + 3, HEAD_R * 0.97);
      const rightShine = leftShine.clone();
      rightShine.position.x = 21;
      character.add(leftShine, rightShine);

      const blushGeo = new ThreeLib.CircleGeometry(6, 16);
      const leftBlush = new ThreeLib.Mesh(blushGeo, blushMat);
      leftBlush.position.set(-29, headY - 16, HEAD_R * 0.82);
      const rightBlush = leftBlush.clone();
      rightBlush.position.x = 29;
      character.add(leftBlush, rightBlush);

      const armGeo = new ThreeLib.CapsuleGeometry(ARM_R, ARM_LEN, 6, 10);
      const shoulderY = TORSO_LEN + TORSO_R * 1.1;
      // Pulled toward the camera so a raised/waving arm renders in front of the
      // head instead of behind it (both meshes otherwise sit at the same depth).
      const ARM_FORWARD_Z = HEAD_R;

      const leftArmPivot = new ThreeLib.Group();
      leftArmPivot.position.set(-(TORSO_R + ARM_R - 4), shoulderY, ARM_FORWARD_Z);
      const leftArm = new ThreeLib.Mesh(armGeo, outfitMat);
      leftArm.position.y = -(ARM_LEN / 2 + ARM_R - 6);
      leftArmPivot.add(leftArm);
      character.add(leftArmPivot);

      const rightArmPivot = new ThreeLib.Group();
      rightArmPivot.position.set(TORSO_R + ARM_R - 4, shoulderY, ARM_FORWARD_Z);
      const rightArm = new ThreeLib.Mesh(armGeo, outfitMat);
      rightArm.position.y = -(ARM_LEN / 2 + ARM_R - 6);
      rightArmPivot.add(rightArm);
      character.add(rightArmPivot);

      scene.add(character);

      const stage = { width: 0, height: 0 };
      const anchor = { x: 0, y: 0 };

      const layout = () => {
        const { x, yTop } = anchorScreen();

        anchor.x = x - stage.width / 2;
        anchor.y = stage.height / 2 - yTop - CHAR_HEIGHT;
        character.position.set(anchor.x, anchor.y, 0);

        if (bubble) {
          const screenX = stage.width / 2 + anchor.x;
          const screenY = stage.height / 2 - (anchor.y + CHAR_HEIGHT);
          bubble.style.left = `${screenX}px`;
          bubble.style.top = `${screenY}px`;
        }
      };

      const resize = () => {
        stage.width = mount.clientWidth;
        stage.height = mount.clientHeight;

        if (stage.width === 0 || stage.height === 0) return;

        renderer.setSize(stage.width, stage.height);

        camera.left = -stage.width / 2;
        camera.right = stage.width / 2;
        camera.top = stage.height / 2;
        camera.bottom = -stage.height / 2;
        camera.updateProjectionMatrix();

        layout();
      };

      const idle = gsap.to(character.position, {
        y: `+=14`,
        duration: 1.7,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      let waveTl: gsap.core.Timeline | null = null;
      let greetingIndex = 0;

      const playWave = () => {
        waveTl?.kill();
        waveTl = gsap.timeline();

        waveTl
          .to(rightArmPivot.rotation, { z: -2.3, duration: 0.4, ease: "back.out(2)" }, 0)
          .to(rightArmPivot.rotation, { z: -1.85, duration: 0.22, repeat: 5, yoyo: true, ease: "sine.inOut" }, 0.4)
          .to(rightArmPivot.rotation, { z: 0, duration: 0.4, ease: "power2.inOut" }, ">+0.05");

        if (bubble) {
          bubble.textContent = GREETINGS[greetingIndex];
          greetingIndex = (greetingIndex + 1) % GREETINGS.length;

          gsap.killTweensOf(bubble);
          gsap.fromTo(bubble, { opacity: 0, scale: 0.6, y: 10 }, { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "back.out(2)" });
          gsap.to(bubble, { opacity: 0, y: -6, duration: 0.35, delay: 1.9, ease: "power1.in" });
        }
      };

      let frameId: number;
      let isVisible = true;
      let contextLost = false;

      const handleContextLost = (event: Event) => {
        event.preventDefault();
        contextLost = true;
        setUseFallback(true);
      };

      renderer.domElement.addEventListener("webglcontextlost", handleContextLost);

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        if (!isVisible || document.hidden || contextLost) return;
        renderer.render(scene, camera);
      };

      const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
        },
        { threshold: 0.05 },
      );
      intersectionObserver.observe(mount);

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);

      const anchorEl = belowRef?.current;
      if (anchorEl) resizeObserver.observe(anchorEl);

      resize();
      animate();

      playWave();
      const waveInterval = setInterval(playWave, 4200);

      cleanup = () => {
        cancelAnimationFrame(frameId);
        clearInterval(waveInterval);
        idle.kill();
        waveTl?.kill();
        if (bubble) gsap.killTweensOf(bubble);
        intersectionObserver.disconnect();
        resizeObserver.disconnect();
        renderer.domElement.removeEventListener("webglcontextlost", handleContextLost);

        scene.traverse((obj) => {
          if (obj instanceof ThreeLib.Mesh) {
            obj.geometry.dispose();
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        });

        renderer.dispose();
        if (renderer.domElement.parentElement === mount) {
          mount.removeChild(renderer.domElement);
        }
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [belowRef, useFallback]);

  return (
    <div ref={mountRef} className={className} style={{ position: "relative", ...style }} aria-hidden="true">
      {useFallback && (
        <div ref={fallbackRef} className="absolute flex -translate-x-1/2 flex-col items-center">
          <div className="relative h-16 w-16 overflow-hidden rounded-full" style={{ background: "#ffd9b3" }}>
            <div className="absolute inset-x-0 top-0 h-7 rounded-b-[50%]" style={{ background: "#1c1c1c" }} />
            <div className="absolute left-[17px] top-[33px] h-[7px] w-[7px] rounded-full bg-black" />
            <div className="absolute right-[17px] top-[33px] h-[7px] w-[7px] rounded-full bg-black" />
            <div className="absolute left-[9px] top-[41px] h-[6px] w-[6px] rounded-full" style={{ background: "#ff9d9d", opacity: 0.6 }} />
            <div className="absolute right-[9px] top-[41px] h-[6px] w-[6px] rounded-full" style={{ background: "#ff9d9d", opacity: 0.6 }} />
          </div>
          <div className="relative -mt-1 h-14 w-12 rounded-3xl" style={{ background: "#ff5a1f" }}>
            <div className="absolute -left-3 top-2 h-9 w-5 rounded-full" style={{ background: "#ff5a1f" }} />
            <div className="absolute -right-3 top-2 h-9 w-5 rounded-full" style={{ background: "#ff5a1f" }} />
          </div>
        </div>
      )}
      <div
        ref={bubbleRef}
        className="font-bricolage-semibold size18 whitespace-nowrap rounded-full bg-white px-4 py-1.5 text-black shadow-lg"
        style={{
          position: "absolute",
          opacity: 0,
          transform: "translate(-50%, -100%)",
          pointerEvents: "none",
        }}
      >
        {GREETINGS[0]}
      </div>
    </div>
  );
};

export default AnimeGreeter;
