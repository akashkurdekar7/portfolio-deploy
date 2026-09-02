import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import ReelsField from "./ReelsField";
import ReelCard, { type Reel } from "./ReelCard";
import welcome from "../assets/reels/glp.gif";
const reels: Reel[] = [
  {
    id: 1,
    title: "Creative Reel",
    category: "Video / Motion",
    year: "2026",
    image: "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg",
    instagram: "https://www.instagram.com/reel/DYhoTT-vtzj/",
  },
  {
    id: 2,
    title: "Design Process",
    category: "Design",
    year: "2026",
    image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
    instagram: "https://www.instagram.com/reel/DcBweV1yihE/",
  },
  {
    id: 3,
    title: "Development",
    category: "Frontend",
    year: "2026",
    image: welcome,
    instagram: "https://www.instagram.com/reel/DbYR1vJN9V8/",
  },
  {
    id: 4,
    title: "Development",
    category: "Frontend",
    year: "2026",
    image: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg",
    instagram: "https://www.instagram.com/reel/DZR7sG8S1Za/",
  },
  {
    id: 5,
    title: "Motion Experiment",
    category: "Motion",
    year: "2026",
    image: "https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg",
    instagram: "https://www.instagram.com/reel/C7S-XkoSJBh/",
  },
  {
    id: 6,
    title: "Behind the Scenes",
    category: "Process",
    year: "2026",
    image: "https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg",
    instagram: "https://www.instagram.com/reel/DCpKq1syHAJ/",
  },
  {
    id: 7,
    title: "Creative Direction",
    category: "Creative",
    year: "2026",
    image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
    instagram: "https://www.instagram.com/reel/DYe4wF2o5Wc/",
  },
  {
    id: 8,
    title: "Visual Experiment",
    category: "Motion",
    year: "2026",
    image: "https://images.pexels.com/photos/713312/pexels-photo-713312.jpeg",
    instagram: "https://www.instagram.com/reel/DVkaxM8Eqkj/",
  },
  {
    id: 9,
    title: "Digital Experience",
    category: "Creative Development",
    year: "2026",
    image: "https://images.pexels.com/photos/3861963/pexels-photo-3861963.jpeg",
    instagram: "https://www.instagram.com/reel/DBOtvtUo_MG/",
  },
  {
    id: 10,
    title: "Creative Work",
    category: "Video / Motion",
    year: "2026",
    image: "https://images.pexels.com/photos/242236/pexels-photo-242236.jpeg",
    instagram: "https://www.instagram.com/reel/C8ffta0yF__/",
  },
];

const GRID_PLACEMENT = [
  "lg:col-start-1 lg:col-end-9 lg:row-start-1",
  "lg:col-start-9 lg:col-end-13 lg:row-start-1",
  "lg:col-start-1 lg:col-end-5 lg:row-start-2",
  "lg:col-start-5 lg:col-end-13 lg:row-start-2",
  "lg:col-start-1 lg:col-end-9 lg:row-start-3",
  "lg:col-start-9 lg:col-end-13 lg:row-start-3",
];

const Reels = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const reducedMotion = useMemo(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
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

      <div className="relative z-10">
        {/* HEADING */}
        <div className="reel-reveal max-w-xl">
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

        {/* GRID — brick layout with connecting hairline borders */}
        <div className="reel-reveal mt-14 md:mt-16">
          <div className="grid grid-cols-1 gap-40 overflow-hidden  p-px lg:grid-cols-12 lg:auto-rows-[minmax(14rem,22vw)]">
            {reels.map((reel, index) => (
              <ReelCard
                key={reel.id}
                reel={reel}
                isFinePointer={isFinePointer}
                reducedMotion={reducedMotion}
                className={`aspect-video lg:aspect-auto ${GRID_PLACEMENT[index] ?? ""}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reels;
