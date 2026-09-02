import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import hero from "../assets/hero.webp";

gsap.registerPlugin(Flip);

interface LoaderProps {
  onComplete: () => void;
}

const Loader = ({ onComplete }: LoaderProps) => {
  const [growing, setGrowing] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();

    const unlockScroll = () => {
      document.body.style.overflow = "";
      window.__lenis?.start();
    };

    const finish = () => {
      unlockScroll();
      onComplete();
      setHidden(true);
    };

    // At the end of the intro, the loader's own image grows to fill the
    // screen — Hero's fullscreen image takes over only once both look
    // pixel-identical, so the handoff is invisible (no crossfade, no flash).
    const timer = window.setTimeout(() => {
      const el = imageRef.current;
      if (!el) {
        finish();
        return;
      }

      const state = Flip.getState(el, { props: "borderRadius,borderWidth" });

      flushSync(() => {
        setGrowing(true);
      });

      Flip.from(state, {
        duration: 0.9,
        ease: "power3.inOut",
        absolute: true,
        props: "borderRadius,borderWidth",
        onComplete: finish,
      });
    }, 3000);

    return () => {
      window.clearTimeout(timer);
      unlockScroll();
    };
  }, [onComplete]);

  if (hidden) return null;

  return (
    <div className="hero-loader fixed inset-0 z-50 flex items-center justify-center bg-white">
      {/* introPosition's translateY leaves a lingering transform (fill-mode
          forwards) that would create a containing block for the image's
          fixed positioning once it grows full screen — drop the class so
          it doesn't hijack `inset-0` into being relative to this box. */}
      <div className={`flex flex-col items-center ${growing ? "" : "hero-loader-content"}`}>
        {/* IMAGE */}

        <div
          ref={imageRef}
          className={`overflow-hidden ${growing ? "fixed inset-0 rounded-none border-0" : "hero-loader-image rounded-[20px] border-6"}`}
        >
          <img src={hero} alt="" className="h-full w-full object-cover" />
        </div>

        {/* WELCOME */}

        <div className="hero-loader-welcome flex flex-col items-center">
          <p className="mt-5 font-space size12 uppercase">welcome</p>

          <div className="hero-loader-line" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
