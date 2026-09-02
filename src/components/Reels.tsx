import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import ReelsField from "./ReelsField";
import ReelCard, { type Reel } from "./ReelCard";

const reels: Reel[] = [
  {
    id: 1,
    title: "Creative Reel",
    category: "Video / Motion",
    year: "2026",
    video: "/reels/reel-01.mp4",
    instagram: "#",
  },
  {
    id: 2,
    title: "Design Process",
    category: "Design",
    year: "2026",
    video: "/reels/reel-02.mp4",
    instagram: "#",
  },
  {
    id: 3,
    title: "Development",
    category: "Frontend",
    year: "2026",
    video: "/reels/reel-03.mp4",
    instagram: "#",
  },
  {
    id: 4,
    title: "Motion Experiment",
    category: "Motion",
    year: "2026",
    video: "/reels/reel-04.mp4",
    instagram: "#",
  },
];

const Reels = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const isFinePointer = useMemo(() => typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches, []);

  // SCROLL REVEAL
  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const targets = sectionRef.current.querySelectorAll(".reel-reveal");
    gsap.set(targets, { y: 32, opacity: 0 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        gsap.to(targets, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
        });

        observer.disconnect();
      },
      { threshold: 0.15 },
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <section id="reels" ref={sectionRef} className="relative mx-5 flex min-h-screen flex-col justify-center overflow-hidden py-20 md:mx-20">
      <ReelsField />

      <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
        {/* LEFT */}
        <div className="reel-reveal lg:col-span-4">
          <span className="font-space size12 uppercase text-grey">03 / Reels</span>

          <h2 className="mt-4 font-instrument size64 leading-[0.9]">
            Things that
            <br />
            <span className="font-italic text-orange">move.</span>
          </h2>

          <p className="mt-6 max-w-sm font-space size16 leading-6 text-grey">
            A collection of short-form videos, motion experiments, and visual ideas I've created outside of my development work.
          </p>
        </div>

        {/* RIGHT — GRID */}
        <div className="reel-reveal grid grid-cols-2 gap-4 sm:gap-5 lg:col-span-8 xl:grid-cols-4 xl:gap-6">
          {reels.map((reel) => (
            <ReelCard key={reel.id} reel={reel} isFinePointer={isFinePointer} reducedMotion={reducedMotion} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reels;
