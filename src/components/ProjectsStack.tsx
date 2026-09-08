import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard, { type Project } from "./ProjectCard";

gsap.registerPlugin(ScrollTrigger);

// Cards sit flat at rest (no permanent tilt). The 3D rotateX only exists
// mid-transition — forward = flips up flat into the stack, scrolling back
// (scrub reversed) retraces the same flip away, so "going back" reads as
// a card folding open again instead of just sliding down.
const OFFSCREEN_ROTATE_X = 55;

interface ProjectsStackProps {
  projects: Project[];
}

const ProjectsStack = ({ projects }: ProjectsStackProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(max-width: 767px)", () => {
      const cards = cardRefs.current.filter((el): el is HTMLDivElement => el !== null);
      if (cards.length < 2 || !sectionRef.current) return;

      // transformPerspective (applied per-element) instead of a `perspective`
      // CSS property on the shared ancestor: putting perspective on a parent
      // while its children get GPU-composited 3D transforms is a known
      // WebKit/iOS Safari trigger for whole-block flicker/tremor — the
      // browser's antialiasing of the 3D transform hierarchy recalculates
      // unstably every frame. Keeping the perspective on each card's own
      // transform avoids that separate stacking context entirely.
      gsap.set(cards, { transformPerspective: 1200 });
      gsap.set(cards[0], { yPercent: 0, rotateX: 0 });
      gsap.set(cards.slice(1), { yPercent: 130, rotateX: OFFSCREEN_ROTATE_X });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${(cards.length - 1) * window.innerHeight}`,
          // Lenis (see SmoothScroll.tsx) already smooths the raw scroll
          // input with its own lerp, and pushes every tick straight into
          // ScrollTrigger.update. Adding GSAP's own numeric scrub lag on
          // top chains a second, independent smoothing filter after the
          // first — on quick reversals (scrolling back up) the two lags
          // fall out of phase, so the timeline briefly keeps easing toward
          // the old target before snapping to the new one. That's what
          // reads as the cards vibrating/sticking on the way back. A
          // boolean scrub ties the timeline 1:1 to Lenis's already-smoothed
          // position instead of adding a second lag on top of it.
          scrub: true,
          pin: true,
          // App.tsx wraps everything in a div with Tailwind's scale-*
          // utility (a real `scale` value even at rest, never the literal
          // `none`), which per spec makes it a containing block for
          // position:fixed descendants. GSAP's default pinType:"fixed"
          // doesn't know about that ancestor, so the pin silently anchors
          // to it instead of the viewport and scrolls away with the page.
          pinType: "transform",
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      cards.slice(1).forEach((card, i) => {
        const previousCard = cards[i];

        // ease: "none" — with a scrubbed timeline, progress is already
        // driven directly by scroll position, so an eased curve (like the
        // power2.out this used to have) doesn't ease over *time*, it warps
        // the mapping between scroll delta and visual movement instead. On
        // reversal that warped curve traverses backwards too (fast becomes
        // slow, slow becomes fast), which is exactly what read as the
        // motion feeling "forced" going back up. Linear keeps scroll input
        // and visual output proportional in both directions.
        tl.to(
          card,
          {
            yPercent: 0,
            scale: 1,
            rotateX: 0,
            duration: 1,
            ease: "none",
          },
          i,
        );

        tl.to(
          previousCard,
          {
            scale: 0.88,
            duration: 1,
            ease: "none",
          },
          i,
        );
      });
      // cards.slice(1).forEach((card, i) => {
      //   tl.to(
      //     card,
      //     {
      //       yPercent: 0,
      //       rotateX: 0,
      //       scale: 1,
      //       duration: 1,
      //       ease: "power2.out",
      //     },
      //     i,
      //   );
      // });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, [projects]);

  return (
    <section ref={sectionRef} className="relative min-h-dvh overflow-hidden">
      <div className="relative mx-auto h-full w-full">
        {projects.map((project, index) => (
          <div
            key={project.title}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="absolute inset-0 m-auto h-fit w-full origin-bottom rounded-[28px] border-2 border-black bg-[#ffffff] px-3  py-4  will-change-transform"
            style={{
              zIndex: index + 1,
              // Cards are rotated in 3D (rotateX) inside a `perspective`
              // ancestor while animating scale via GSAP scrub. Without a
              // backface hint, Chrome/Safari re-rasterize the border/rounded
              // corners every frame, which reads as the card edge vibrating
              // instead of smoothly transforming. (Don't set `transform`
              // here — GSAP owns that property on this element.)
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <ProjectCard project={project} index={index} scrambleTitle={false} />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center" style={{ zIndex: projects.length + 3 }}>
        <span className="rounded-full border border-black/20 bg-[#ffffff] px-3 py-1 font-space size12 text-grey uppercase">scroll</span>
      </div>
    </section>
  );
};

export default ProjectsStack;
