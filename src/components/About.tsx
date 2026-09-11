import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_EMOJI = "👋";

// Floating photo bubbles scattered around the bio text. Swap `src` for real
// photos (drop files into src/assets/about/ and import them) — these picsum
// placeholders exist only to preview the layout. `position` is Tailwind's
// absolute placement per bubble; `curve` is a hand-drawn connector path in
// its own local 0..80 x 0..80 viewBox, mirroring the scribble arrows already
// used in Resume.tsx / Loader.tsx.
const floatingPhotos = [
  {
    src: "https://picsum.photos/300/300?random=201",
    emoji: "✈️",
    position: "top-[2%] left-[4%] w-24 lg:w-28",
    rotate: -8,
    curve: { d: "M4,4 C20,20 34,34 50,46", box: "top-[calc(100%-6px)] left-[70%] w-16 h-16" },
  },
  {
    src: "https://picsum.photos/300/300?random=202",
    emoji: "😂",
    position: "top-[6%] right-[6%] w-20 lg:w-24",
    rotate: 6,
    curve: { d: "M64,6 C46,18 34,30 20,46", box: "top-[calc(100%-4px)] right-[75%] w-16 h-16" },
  },
  {
    src: "https://picsum.photos/300/300?random=203",
    emoji: "📸",
    position: "top-[42%] right-[2%] w-24 lg:w-28",
    rotate: 5,
    curve: { d: "M60,10 C40,20 24,34 8,44", box: "top-1/2 right-[calc(100%-6px)] w-14 h-14 -translate-y-1/2" },
  },
  {
    src: "https://picsum.photos/300/300?random=204",
    emoji: "🏔️",
    position: "bottom-[8%] left-[6%] w-20 lg:w-24",
    rotate: -5,
    curve: { d: "M6,60 C22,44 36,30 52,16", box: "bottom-[calc(100%-6px)] left-[65%] w-16 h-16" },
  },
  {
    src: "https://picsum.photos/300/300?random=205",
    emoji: "🎉",
    position: "bottom-[4%] right-[8%] w-24 lg:w-28",
    rotate: 7,
    curve: { d: "M58,58 C42,42 28,28 12,14", box: "bottom-[calc(100%-4px)] right-[70%] w-16 h-16" },
  },
] as const;

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const emojiInnerRef = useRef<HTMLSpanElement>(null);
  const quickX = useRef<gsap.QuickToFunc | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeEmoji, setActiveEmoji] = useState(DEFAULT_EMOJI);
  const [isHovering, setIsHovering] = useState(false);

  // MOUSE-TRAILING EMOJI
  useEffect(() => {
    if (!emojiRef.current || window.matchMedia("(hover: none)").matches) return;

    quickX.current = gsap.quickTo(emojiRef.current, "x", { duration: 0.5, ease: "power3.out" });
    quickY.current = gsap.quickTo(emojiRef.current, "y", { duration: 0.5, ease: "power3.out" });

    const idleFloat = gsap.to(emojiInnerRef.current, {
      y: -12,
      rotate: 10,
      duration: 1.3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    const section = sectionRef.current;
    if (!section) return;

    let lastX = 0;

    const handleMove = (event: MouseEvent) => {
      const dx = event.clientX - lastX;
      lastX = event.clientX;

      quickX.current?.(event.clientX);
      quickY.current?.(event.clientY);

      gsap.to(emojiInnerRef.current, {
        rotate: gsap.utils.clamp(-30, 30, dx * 2),
        duration: 0.4,
        ease: "power3.out",
      });

      if (watermarkRef.current) {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;

        gsap.to(watermarkRef.current, {
          x: x * 30,
          y: y * 30,
          duration: 1.4,
          ease: "power3.out",
          overwrite: true,
        });
      }
    };

    const handleEnter = () => setIsHovering(true);
    const handleLeave = () => {
      setIsHovering(false);
      setActiveEmoji(DEFAULT_EMOJI);
    };

    section.addEventListener("mousemove", handleMove);
    section.addEventListener("mouseenter", handleEnter);
    section.addEventListener("mouseleave", handleLeave);

    return () => {
      section.removeEventListener("mousemove", handleMove);
      section.removeEventListener("mouseenter", handleEnter);
      section.removeEventListener("mouseleave", handleLeave);
      idleFloat.kill();
    };
  }, []);

  // SCROLL REVEAL
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-line", {
        yPercent: 110,
        opacity: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      gsap.from(".about-fade", {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 55%",
        },
      });

      gsap.from(".about-photo", {
        scale: 0.6,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.6)",
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
        },
      });

      gsap.utils.toArray<SVGPathElement>(".about-photo-curve").forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // FLOATING PHOTOS — gentle idle bob, offset per bubble
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const tweens = photoRefs.current.map((el, index) =>
      el
        ? gsap.to(el, {
            y: index % 2 === 0 ? -10 : 10,
            duration: 2.4 + index * 0.3,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          })
        : null,
    );

    return () => tweens.forEach((tween) => tween?.kill());
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative overflow-hidden bg-black text-white md:cursor-none">
      {/* TOP WAVE */}
      <svg className="absolute -top-px left-0 z-10 h-10 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path
          d="M0,40 C120,5 220,75 360,38 C500,0 590,70 720,35 C850,0 950,75 1080,38 C1200,5 1320,65 1440,30 L1440,0 L0,0 Z"
          fill="#f7f6f2"
        />
      </svg>

      {/* MOUSE-FOLLOW EMOJI */}
      <div
        ref={emojiRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-50 -translate-x-1/2 -translate-y-1/2 text-5xl transition-opacity duration-300 lg:text-6xl ${
          isHovering ? "opacity-100" : "opacity-0"
        }`}
      >
        <span ref={emojiInnerRef} className="block">
          {activeEmoji}
        </span>
      </div>

      {/* WATERMARK */}
      <div
        ref={watermarkRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 select-none font-bricolage-semibold text-orange opacity-[0.07] leading-none text-[42vw] lg:text-[26vw]"
      >
        01
      </div>

      {/* FLOATING PHOTOS */}
      <div className="pointer-events-none absolute inset-0 z-[8] hidden lg:block">
        {floatingPhotos.map((photo, index) => (
          <div
            key={photo.src}
            ref={(el) => {
              photoRefs.current[index] = el;
            }}
            className={`about-photo pointer-events-auto absolute ${photo.position}`}
            style={{ transform: `rotate(${photo.rotate}deg)` }}
            onMouseEnter={() => setActiveEmoji(photo.emoji)}
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl border-4 border-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:scale-105 hover:rotate-0">
              <img src={photo.src} alt="" className="h-full w-full object-cover" loading="lazy" />
            </div>

            <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-white text-sm shadow-md">
              {photo.emoji}
            </span>

            <svg className={`pointer-events-none absolute ${photo.curve.box}`} viewBox="0 0 80 80" aria-hidden="true">
              <path
                className="about-photo-curve"
                d={photo.curve.d}
                fill="none"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="2"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        ))}
      </div>

      <div className="relative z-10 mx-5 flex min-h-dvh flex-col justify-center py-28 md:mx-20 md:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* LABEL */}
          <div className="about-fade lg:col-span-2">
            <span className="font-bricolage size12 uppercase text-grey">01 / About</span>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-8 lg:col-start-4">
            <h2 className="flex flex-col font-instrument size90 leading-[0.92]">
              <span className="overflow-hidden">
                <span className="about-line inline-block">I turn</span>
              </span>

              <span className="overflow-hidden">
                <span className="about-line inline-block">
                  <span className="font-italic text-blue md:cursor-none" onMouseEnter={() => setActiveEmoji("💡")}>
                    ideas
                  </span>{" "}
                  into
                </span>
              </span>

              <span className="overflow-hidden">
                <span className="about-line inline-block">
                  <span className="md:cursor-none" onMouseEnter={() => setActiveEmoji("💻")}>
                    digital
                  </span>{" "}
                  <span className="font-italic text-orange md:cursor-none" onMouseEnter={() => setActiveEmoji("✨")}>
                    experiences.
                  </span>
                </span>
              </span>
            </h2>

            <div className="about-fade mt-10 max-w-2xl">
              <p className="font-bricolage size16 leading-6 text-grey">
                I'm a software engineer who enjoys working where technology, design, and interaction meet. I build digital products with a
                focus on thoughtful interfaces, clean implementation, and the details that make an experience feel intentional.
              </p>

              <p className="mt-6 font-bricolage size16 leading-6 text-grey">
                From websites and dashboards to larger web applications, I like taking an idea from its first visual direction all the way
                to a polished, functional experience.
              </p>
            </div>

            {/* TAGS */}
            <div className="about-fade mt-10 flex flex-wrap gap-3">
              <span className="rounded-full bg-orange px-4 py-1.5 font-bricolage size12 uppercase text-black">Software Engineer</span>
              <span className="rounded-full bg-blue px-4 py-1.5 font-bricolage size12 uppercase text-white">Frontend / Full Stack</span>
              <span className="rounded-full border border-white px-4 py-1.5 font-bricolage size12 uppercase text-white">
                Design &amp; Development
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM WAVE */}
      <svg className="absolute -bottom-px left-0 z-10 h-10 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path
          d="M0,45 C130,75 220,5 360,42 C500,78 590,10 720,45 C850,80 950,5 1080,42 C1200,75 1320,15 1440,48 L1440,80 L0,80 Z"
          fill="#f7f6f2"
        />
      </svg>
    </section>
  );
};

export default About;
