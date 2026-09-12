import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ipcs from "../assets/work/ipcs.webp";
import HighlightCircle from "./HighlightCircle";
import { renderEmphasisText } from "../utils/emphasisText";
import { useScrambleReveal } from "../utils/useScrambleReveal";

gsap.registerPlugin(ScrollTrigger);

interface Experience {
  number: string;
  type: string;
  company: string;
  role: string;
  period: string;
  description: string;
  image?: string;
  // Word (or phrase) inside `company` to circle, e.g. "IngeniousPix". Leave undefined for no highlight.
  highlightWord?: string;
  // CSS color for that circle, e.g. "var(--orange)". Defaults to yellow when omitted.
  highlightColor?: string;
}

const renderDescription = (description: string): ReactNode => renderEmphasisText(description, "work-desc-word");

// Splits on the highlighted word so HighlightCircle can wrap just that word
// in its own SVG overlay, with the rest of the company name rendered as
// plain text around it.
const splitCompanyName = (company: string, highlightWord?: string) => {
  if (!highlightWord) return { before: "", match: "", after: company };

  const start = company.toLowerCase().indexOf(highlightWord.toLowerCase());
  if (start === -1) return { before: "", match: "", after: company };

  return {
    before: company.slice(0, start),
    match: company.slice(start, start + highlightWord.length),
    after: company.slice(start + highlightWord.length).replace(/^\s+/, ""),
  };
};

const renderCompanyName = (company: string, highlightWord?: string, highlightColor?: string): ReactNode => {
  const { before, match, after } = splitCompanyName(company, highlightWord);
  if (!match) return company;

  return (
    <>
      {before}
      <HighlightCircle color={highlightColor}>{match}</HighlightCircle>
      {after && ` ${after}`}
    </>
  );
};

const Work = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxImageRef = useRef<HTMLImageElement>(null);
  const lineRefs = useRef<(SVGPathElement | null)[]>([]);
  const headingLine1Ref = useRef<HTMLSpanElement>(null);
  const headingLine2Ref = useRef<HTMLSpanElement>(null);

  const experience: Experience[] = [
    {
      number: "01",
      type: "Full-time",
      company: "IngeniousPix Creative Studios",
      role: "Frontend Engineer",
      period: "Feb 2025 — Present",
      description:
        "Transitioned from an internship into a **full-time Frontend Engineer role**, taking on increasing responsibility across **production client projects**. Adapted to new technologies and project requirements as needed, including learning **Angular** after joining the team and applying it to live client work. Took ownership of **frontend development, UI/UX implementation, integrations, performance, accessibility, SEO, and testing** while also working directly with clients, **coordinating tasks across teams**, and helping drive projects from requirements through **production delivery**.",
      image: ipcs,
      highlightWord: "IngeniousPix",
    },
    {
      number: "02",
      type: "Internship",
      company: "Deshpande Startups Infinity Studio",
      role: "Full Stack Developer Intern",
      period: "Aug 2023 — Oct 2023",
      description:
        "Worked as a **Full Stack Developer Intern** on a **marketplace platform** using **React.js, Node.js, Express.js, and MongoDB**. Developed **reusable frontend components**, integrated **REST APIs**, and contributed to **product listing, inventory, and order-management workflows**. Worked with **local vendors** to understand their business processes and translate requirements into **practical product features** while collaborating with the development team.",

      highlightWord: "Deshpande",
      highlightColor: "var(--orange)",
    },
    {
      number: "03",
      type: "Internship",
      company: "Varcons Technologies Pvt. Ltd",
      role: "Full Stack Web Development Intern",
      period: "May 2023 — Jul 2023",

      description:
        "Developed and delivered a **wildlife-focused website** during the internship, building the **frontend experience** with **responsive layouts, reusable components, structured content, and interactive sections**. Worked on the website from implementation through completion and handed over the **finished project** to the team.",

      highlightWord: "Varcons",
      highlightColor: "var(--blue)",
    },
  ];

  // HEADING SCRAMBLE — "Where I've worked." scrambles in from random
  // characters once the section scrolls into view.
  useScrambleReveal([
    {
      trigger: sectionRef,
      start: "top 80%",
      targets: [
        { ref: headingLine1Ref, text: "Where I've" },
        { ref: headingLine2Ref, text: "worked." },
      ],
    },
  ]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!parallaxImageRef.current) return;

      gsap.fromTo(
        parallaxImageRef.current,
        { scale: 1.15 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: parallaxImageRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".work-reveal-featured",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".work-reveal-featured",
            start: "top 80%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".work-reveal-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".work-reveal-cards",
            start: "top 80%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // DESCRIPTION WORD REVEAL — each description's words ramp from grey/black
  // at 0 opacity up to full opacity in sequence, scrubbed to scroll position
  // as that card's paragraph passes by (same technique as About's tagline).
  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".work-desc").forEach((desc) => {
        const words = desc.querySelectorAll(".work-desc-word");
        gsap.set(words, { opacity: 0 });
        gsap.to(words, {
          opacity: 1,
          ease: "none",
          stagger: 0.03,
          scrollTrigger: {
            trigger: desc,
            start: "top 85%",
            end: "bottom 60%",
            scrub: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // NUMBER / DURATION OPACITY REVEAL — same scroll-scrubbed opacity ramp
  // technique as the description word reveal above, applied to each card's
  // number and period labels so they fade in as the card scrolls past.
  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".work-fade").forEach((el) => {
        const card = el.closest("article") ?? el;
        gsap.set(el, { opacity: 0 });
        gsap.to(el, {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 45%",
            scrub: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const listenerCleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      lineRefs.current.forEach((line) => {
        if (!line) return;

        const length = line.getTotalLength();

        gsap.set(line, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        const card = line.closest(".group");

        if (!card) return;

        const enter = () => {
          gsap.to(line, {
            strokeDashoffset: 0,
            duration: 0.9,
            ease: "power3.out",
          });
        };

        const leave = () => {
          gsap.to(line, {
            strokeDashoffset: length,
            duration: 0.5,
            ease: "power2.in",
          });
        };

        card.addEventListener("mouseenter", enter);
        card.addEventListener("mouseleave", leave);
        listenerCleanups.push(() => {
          card.removeEventListener("mouseenter", enter);
          card.removeEventListener("mouseleave", leave);
        });
      });
    });

    return () => {
      ctx.revert();
      listenerCleanups.forEach((cleanup) => cleanup());
    };
  }, []);
  return (
    <section id="work" ref={sectionRef} className="relative mx-5 min-h-screen py-5 lg:py-24 md:mx-20">
      <div className="relative grid grid-cols-1 lg:gap-8 gap-4 lg:grid-cols-2">
        <h2 className="font-bricolage-semibold size90 leading-[0.9]">
          <span ref={headingLine1Ref}>Where I've</span>
          <br />
          <span ref={headingLine2Ref} className="font-italic text-blue">
            worked.
          </span>
        </h2>

        <p className="work-desc text-justify font-bricolage size18 leading-6">
          {renderDescription(
            "A timeline of the **places, teams, and products** that have shaped the way I approach **design and engineering**.",
          )}
        </p>
      </div>

      <div className="mt-4 lg:mt-24">
        <article className="work-reveal-featured border-t border-black/15 pt-3 lg:pt-8">
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-12 lg:gap-8 items-center">
            <div className="lg:col-span-2">
              <span className="work-fade font-bricolage-sembold size12 text-grey">{experience[0].number}</span>
            </div>
            <div className="col-6 lg:col-span-3">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full border border-black" />
                <span className="font-bricolage size12 uppercase text-grey">{experience[0].type}</span>
              </div>
            </div>
            <div className="lg:col-span-5">
              {/* Not a heading: it visually reads like a label, but a real <h4>
                  here would land before this card's <h3> (the company name,
                  below) in document order — skipping a level and reading out
                  of sequence for screen-reader users navigating by heading. */}
              <p className="role-cube-lift font-bricolage-semibold size16 uppercase">{experience[0].role}</p>
            </div>
            <div className="col-6 lg:col-span-2 lg:text-right">
              <span className="work-fade font-bricolage size12 uppercase text-grey">{experience[0].period}</span>
            </div>
          </div>

          <div className="mt-5 lg:mt-10 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-7 overflow-hidden rounded-2xl border-4 shadow-md border-black">
              <img
                ref={parallaxImageRef}
                src={experience[0].image}
                alt={`${experience[0].company} — ${experience[0].role}`}
                className=" block h-auto w-full object-cover will-change-transform"
                style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                loading="lazy"
                width={1400}
                height={1050}
              />
            </div>
            <div className="lg:col-span-5">
              <h3 className="font-instrument size56 leading-[0.9]">
                {renderCompanyName(experience[0].company, experience[0].highlightWord, experience[0].highlightColor)}
              </h3>
              <p className="work-desc mt-3 lg:mt-6 max-w-lg font-bricolage size14 leading-6">{renderDescription(experience[0].description)}</p>
            </div>
          </div>
        </article>
      </div>
      <div className="work-reveal-cards mt-5 lg:mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:gap-20">
        {experience.slice(1).map((item, index) => (
          <article
            key={item.number}
            className="work-reveal-card group border-4 rounded-3xl px-4 py-6 lg:px-6 lg:py-6 shadow-[0_4px_10px_0_rgba(0,0,0,.3)] bg-[#fff]"
          >
            <div className="flex items-center justify-between">
              <span className="work-fade font-bricolage size12 text-grey">{item.number}</span>
              <div className="work-type-badge group/type flex items-center gap-3 border border-black rounded-md p-1 px-3 bg-white shadow-[0_4px_0_0_#fff,0_4px_0_1px_rgba(0,0,0,1)] transition-all duration-200 ease-out [transform-style:preserve-3d] hover:translate-y-1 hover:[transform:translateY(0.25rem)_translateZ(-4px)] hover:shadow-[0_1px_0_0_#fff,0_1px_0_1px_rgba(0,0,0,1)] active:[transform:translateY(0.25rem)_translateZ(-6px)] active:shadow-[0_1px_0_0_#fff,0_1px_0_1px_rgba(0,0,0,1)]">
                <span className="font-bricolage size12 uppercase text-grey">{item.type}</span>
              </div>
            </div>

            <h3 className="mt-4 lg:mt-8 max-w-md font-instrument size44 leading-[1.2] h-[2.5em] transition-transform duration-500 group-hover:translate-x-2">
              {renderCompanyName(item.company, item.highlightWord, item.highlightColor)}
            </h3>

            <h4 className={`role-cube-lift mt-1 font-bricolage size14 uppercase ${index === 0 ? "text-orange" : "text-blue"}`}>{item.role}</h4>
            <p className="work-desc mt-4 max-w-lg font-bricolage size14 leading-6">{renderDescription(item.description)}</p>

            <div className="mt-4">
              <span className="work-fade font-bricolage size12 uppercase text-grey">{item.period}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Work;
