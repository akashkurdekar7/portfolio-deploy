import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ipcs from "../assets/work/ipcs.webp";
import HighlightCircle from "./HighlightCircle";

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

const renderCompanyName = (company: string, highlightWord?: string, highlightColor?: string): ReactNode => {
  if (!highlightWord) return company;

  const start = company.toLowerCase().indexOf(highlightWord.toLowerCase());
  if (start === -1) return company;

  const before = company.slice(0, start);
  const match = company.slice(start, start + highlightWord.length);
  const after = company.slice(start + highlightWord.length);

  return (
    <>
      {before}
      <HighlightCircle color={highlightColor}>{match}</HighlightCircle>
      {after}
    </>
  );
};

const Work = () => {
  const parallaxImageRef = useRef<HTMLImageElement>(null);
  const lineRefs = useRef<(SVGPathElement | null)[]>([]);
  const experience: Experience[] = [
    {
      number: "01",
      type: "Full-time",
      company: "IngeniousPix Creative Studios",
      role: "Frontend Engineer",
      period: "Feb 2025 — Present",
      description:
        "Transitioned from an internship into a full-time engineering role, taking ownership of client projects across frontend development, backend integration, UI/UX, and production delivery.",
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
        "Built marketplace features using React.js, Node.js, Express.js, and MongoDB, developing reusable components and REST APIs while working with vendors to translate business workflows into product features.",
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
        "Developed frontend features across 10+ client projects using React.js, Angular, TypeScript, HTML, and CSS, including reusable components, dashboards, landing pages, and responsive interfaces.",
      highlightWord: "Varcons",
      highlightColor: "var(--blue)",
    },
  ];
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
  useEffect(() => {
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
      });
    });

    return () => ctx.revert();
  }, []);
  return (
    <section id="work" className="relative mx-5 min-h-screen py-5 lg:py-24 md:mx-20">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <h2 className="font-chunko size90 leading-[0.9]">
          Where I've
          <br />
          <span className="font-italic text-blue">worked.</span>
        </h2>

        <p className="text-justify font-space size28 leading-10 text-grey">
          A timeline of the places, teams, and products that have shaped the way I approach design and engineering.
        </p>
      </div>

      <div className="mt-15 lg:mt-24">
        <article className="border-t border-black/15 pt-8">
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-12 lg:gap-8 items-center">
            <div className="lg:col-span-2">
              <span className="font-space size12 text-grey">{experience[0].number}</span>
            </div>
            <div className="col-6 lg:col-span-3">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full border border-black" />
                <span className="font-space size12 uppercase text-grey">{experience[0].type}</span>
              </div>
            </div>
            <div className="lg:col-span-5">
              <h4 className="font-space size14 uppercase">{experience[0].role}</h4>
            </div>
            <div className="col-6 lg:col-span-2 lg:text-right">
              <span className="font-space size12 uppercase text-grey">{experience[0].period}</span>
            </div>
          </div>

          <div className="mt-5 lg:mt-10 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-7 overflow-hidden rounded-2xl border-4 shadow-md border-black">
              <img
                ref={parallaxImageRef}
                src={experience[0].image}
                alt={`${experience[0].company} — ${experience[0].role}`}
                className=" block h-auto w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="lg:col-span-5">
              <h3 className="font-instrument size56 leading-[0.9]">
                {renderCompanyName(experience[0].company, experience[0].highlightWord, experience[0].highlightColor)}
              </h3>
              <p className="mt-3 lg:mt-6 max-w-lg font-space size14 leading-6 text-grey">{experience[0].description}</p>
            </div>
          </div>
        </article>
      </div>
      <div className="mt-5 lg:mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:gap-20">
        {experience.slice(1).map((item, index) => (
          <article
            key={item.number}
            className="group border-4 rounded-3xl px-4 py-6 lg:px-6 lg:py-6 shadow-[0_4px_10px_0_rgba(0,0,0,.3)] bg-[#fff]"
          >
            <div className="flex items-center justify-between">
              <span className="font-space size12 text-grey">{item.number}</span>
              <div className="group/type flex items-center gap-3 border border-black rounded-md p-1 px-3 bg-white shadow-[0_4px_0_0_#fff,0_4px_0_1px_rgba(0,0,0,1)] transition-all duration-200 ease-out [transform-style:preserve-3d] hover:translate-y-1 hover:[transform:translateY(0.25rem)_translateZ(-4px)] hover:shadow-[0_1px_0_0_#fff,0_1px_0_1px_rgba(0,0,0,1)] active:[transform:translateY(0.25rem)_translateZ(-6px)] active:shadow-[0_1px_0_0_#fff,0_1px_0_1px_rgba(0,0,0,1)]">
                <span className="font-space size12 uppercase text-grey">{item.type}</span>
              </div>
            </div>

            <h3 className="mt-4 lg:mt-8 max-w-md font-instrument size44 leading-[1.2] h-[2.5em] transition-transform duration-500 group-hover:translate-x-2">
              {renderCompanyName(item.company, item.highlightWord, item.highlightColor)}
            </h3>

            <h4 className={`mt-1 font-space size14 uppercase ${index === 0 ? "text-orange" : "text-blue"}`}>{item.role}</h4>
            <p className="mt-4 max-w-lg font-space size14 leading-6 text-grey">{item.description}</p>

            <div className="mt-4">
              <span className="font-space size12 uppercase text-grey">{item.period}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Work;
