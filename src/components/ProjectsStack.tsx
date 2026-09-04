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

      gsap.set(cards[0], { yPercent: 0, rotateX: 0 });
      gsap.set(cards.slice(1), { yPercent: 130, rotateX: OFFSCREEN_ROTATE_X });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${(cards.length - 1) * window.innerHeight}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      cards.slice(1).forEach((card, i) => {
        const previousCard = cards[i];

        tl.to(
          card,
          {
            yPercent: 0,
            scale: 1,
            rotateX: 0,
            duration: 1,
            ease: "power2.out",
          },
          i,
        );

        tl.to(
          previousCard,
          {
            scale: 0.88,
            duration: 1,
            ease: "power2.out",
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
    <section ref={sectionRef} className="relative h-dvh overflow-hidden">
      <div className="relative mx-auto h-full w-[86vw] max-w-[380px] [perspective:1200px]">
        {projects.map((project, index) => (
          <div
            key={project.title}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="absolute inset-0 m-auto h-fit w-full origin-bottom rounded-[28px] border-2 border-black bg-[#ffffff] p-3 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.35)] will-change-transform"
            style={{ zIndex: index + 1 }}
          >
            <ProjectCard project={project} index={index} />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
        <span className="rounded-full border border-black/20 bg-[#ffffff] px-3 py-1 font-space size12 text-grey uppercase">scroll</span>
      </div>
    </section>
  );
};

export default ProjectsStack;
