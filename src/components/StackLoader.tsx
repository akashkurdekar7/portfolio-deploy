import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import pixtar from "../assets/projects/pixtar.webp";
import greenminds from "../assets/projects/greenminds.webp";
import phdesignme from "../assets/projects/phdesignme.webp";
import arovan from "../assets/projects/arovan.webp";

interface StackLoaderProps {
  images?: string[];
  words?: string[];
  duration?: number;
  onComplete?: () => void;
}

const DEFAULT_IMAGES = [pixtar, greenminds, phdesignme, arovan];

// Placeholder pool — swap via the `words` prop once real copy is ready.
// Four are picked at random (no repeats) so reloads don't feel identical.
const DEFAULT_WORD_POOL = ["Crafting", "Designing", "Building", "Shaping", "Creating", "Coding", "Polishing", "Launching"];

const pickRandomWords = (pool: string[], count: number) => {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const LETTER_STAGGER = { each: 0.035, from: "center" as const };

const StackLoader = ({ images = DEFAULT_IMAGES, words, duration = 3.2, onComplete }: StackLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const progressState = useRef({ val: 0 });
  const [displayWords] = useState(() => (words && words.length > 0 ? words : pickRandomWords(DEFAULT_WORD_POOL, images.length)));

  // The word currently rendered in the DOM. It only advances to `activeIndex`
  // once the previous word has finished animating out, so exit and enter
  // never fight over the same letters.
  const [renderedIndex, setRenderedIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();

    const unlockScroll = () => {
      document.body.style.overflow = "";
      window.__lenis?.start();
    };

    const tween = gsap.to(progressState.current, {
      val: 100,
      duration,
      ease: "power2.inOut",
      onUpdate: () => setProgress(Math.round(progressState.current.val)),
      onComplete: () => {
        gsap.to(rootRef.current, {
          opacity: 0,
          duration: 0.6,
          delay: 0.3,
          ease: "power3.inOut",
          onComplete: () => {
            unlockScroll();
            setHidden(true);
            onComplete?.();
          },
        });
      },
    });

    return () => {
      tween.kill();
      unlockScroll();
    };
  }, [duration, onComplete]);

  const segment = 100 / images.length;
  const activeIndex = Math.min(images.length - 1, Math.floor(progress / segment));

  // Exit: letters drop downward, center letter leading, left/right following.
  useEffect(() => {
    if (activeIndex === renderedIndex) return;
    const letters = wordRef.current?.querySelectorAll<HTMLElement>(".stack-loader-letter-inner");
    if (!letters || letters.length === 0) {
      setRenderedIndex(activeIndex);
      return;
    }

    let cancelled = false;
    gsap.to(letters, {
      yPercent: 120,
      opacity: 0,
      duration: 0.3,
      ease: "power3.in",
      stagger: LETTER_STAGGER,
      onComplete: () => {
        if (!cancelled) setRenderedIndex(activeIndex);
      },
    });

    return () => {
      cancelled = true;
    };
  }, [activeIndex, renderedIndex]);

  // Enter: letters rise up into place, center letter leading, left/right following.
  useLayoutEffect(() => {
    const letters = wordRef.current?.querySelectorAll<HTMLElement>(".stack-loader-letter-inner");
    if (!letters || letters.length === 0) return;

    gsap.fromTo(
      letters,
      { yPercent: 120, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: LETTER_STAGGER },
    );
  }, [renderedIndex]);

  if (hidden) return null;

  return (
    <div ref={rootRef} className="stack-loader fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
      <div className="stack-loader-images">
        {images.map((src, i) => (
          <div key={src} className={`stack-loader-image ${i === activeIndex ? "is-active" : ""}`}>
            <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>

      <div className="stack-loader-count-wrap">
        <div ref={wordRef} className="stack-loader-word font-chunko">
          {displayWords[renderedIndex].split("").map((ch, i) => (
            <span key={i} className="stack-loader-letter">
              <span className="stack-loader-letter-inner">{ch}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StackLoader;
