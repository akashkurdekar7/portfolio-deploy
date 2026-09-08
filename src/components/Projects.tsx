import { lazy, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectsStack from "./ProjectsStack";

// Pulls in lottie-react/lottie-web (a heavy chunk) — split out of the main bundle.
const ProjectsDesktop = lazy(() => import("./ProjectsDesktop"));

import saas from "../assets/projects/saas.webp";
import ghostrentals from "../assets/projects/ghostrental.webp";
import greenminds from "../assets/projects/greenminds.webp";
import pixtar from "../assets/projects/pixtar.webp";
import phdesignme from "../assets/projects/phdesignme.webp";
import makemycard from "../assets/projects/makemycard.webp";
import Arovan from "../assets/projects/arovan.webp";

gsap.registerPlugin(ScrollTrigger);

// Hoisted to module scope so the array keeps one stable reference across
// re-renders — ProjectsStack's pin ScrollTrigger depends on it by identity
// and tearing down/rebuilding a live pin mid-scroll corrupts it.
const projects = [
  {
    title: "Wholesale Management System",
    type: "Web Application",
    year: "2025",
    image: saas,

    description:
      "A wholesale management platform built to streamline product, order, and business operations through a centralized web application.",

    role: "Designed and developed the application, focusing on intuitive workflows, reusable interfaces, and scalable frontend architecture.",

    company: "Independent Project",
    contribution: "Frontend · UI/UX · Architecture",
  },

  {
    title: "Ghost Rental",
    type: "Website & Dashboard",
    year: "2025",
    image: ghostrentals,

    description: "A rental platform combining a customer-facing website with a management dashboard for handling rental operations.",

    role: "Developed the website and dashboard, building reusable interfaces, responsive layouts, and interactive frontend experiences.",

    company: "IngeniousPix Creative Studios",
    contribution: "Frontend · Dashboard · UI",
  },

  {
    title: "Greenminds",
    type: "Single Page Website",
    year: "2025",
    image: greenminds,

    description:
      "A focused single-page website designed to present the brand, its offerings, and key information through a clear visual experience.",

    role: "Designed and developed the frontend with an emphasis on responsive layouts, visual hierarchy, and smooth interactions.",

    company: "IngeniousPix Creative Studios",
    contribution: "Design · Frontend · Interaction",
  },

  {
    title: "Pixtar",
    type: "Company Website",
    year: "2026",
    image: pixtar,

    description:
      "A complete transformation of the existing Pixtar website, rebuilding the experience from the ground up with a new visual direction and modern frontend architecture.",

    role: "Reworked the existing website into the current experience, contributing across frontend development, UI implementation, interactions, and responsive design.",

    company: "IngeniousPix Creative Studios",
    contribution: "Frontend · UI · Redesign",
  },

  {
    title: "Make My Card",
    type: "Web Application & Dashboard",
    year: "2026",
    image: makemycard,

    description:
      "A product web application and management dashboard built to provide users with a streamlined experience for creating and managing digital products.",

    role: "Developed the product interface and dashboard, focusing on reusable components, responsive layouts, and a consistent user experience.",

    company: "IngeniousPix Creative Studios",
    contribution: "Frontend · Dashboard · UI",
  },

  {
    title: "PhDesignMe",
    type: "Client Website",
    year: "2026",
    image: phdesignme,

    description:
      "A client website built around a strong visual identity, combining editorial presentation with a responsive and engaging digital experience.",

    role: "Developed the frontend experience with attention to layout, typography, responsive behavior, and interactive details.",

    company: "IngeniousPix Creative Studios",
    contribution: "Frontend · UI · Interaction",
  },
  {
    title: "Arovan",
    type: "Client Website",
    year: "2026",
    image: Arovan,
    description:
      "A client website built around a strong visual identity, combining editorial presentation with a responsive and engaging digital experience.",

    role: "Developed the frontend experience with attention to layout, typography, responsive behavior, and interactive details.",

    company: "IngeniousPix Creative Studios",
    contribution: "Frontend · UI · Interaction",
  },
];

const Projects = () => {
  // const catRef = useRef<HTMLElement>(null);

  // useLayoutEffect(() => {
  //   if (!catRef.current) return;

  //   const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  //   if (reducedMotion) return;

  //   const ctx = gsap.context(() => {
  //     const tl = gsap.timeline({
  //       scrollTrigger: {
  //         trigger: catRef.current,
  //         start: "top 85%",
  //         once: true,
  //       },
  //     });

  //     tl.fromTo(
  //       catRef.current,
  //       { scale: 0, rotate: -25, opacity: 0 },
  //       { scale: 1, rotate: 0, opacity: 1, duration: 1, ease: "elastic.out(1, 0.55)" },
  //     ).to(catRef.current, { y: -10, duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut" }, ">-0.1");
  //   });

  //   return () => ctx.revert();
  // }, []);

  return (
    <section id="projects" className="relative mx-5 min-h-screen overflow-hidden py-16 lg:py-24 md:mx-20">
      {/* Heading */}
      <div className="flex flex-col items-center gap-3">
        <h2 className="size56 font-instrument leading-none capitalize">
          Projects
          <sup className="size12 align-super  font-space ml-1 text-white bg-blue rounded-full border border-[#fff] px-1 ">
            0{projects.length}
          </sup>
        </h2>

        <p className="max-w-xs text-center font-space size14 leading-4 text-grey">
          A collection of projects where design, code and purpose come together.
        </p>
      </div>

      {/* MOBILE: stacked cards, one screen, scroll-driven */}
      <div className="pt-8 md:hidden">
        <ProjectsStack projects={projects} />
      </div>

      {/* TABLET / DESKTOP: static grid layout */}
      <div className="hidden md:block">
        <Suspense fallback={null}>
          <ProjectsDesktop projects={projects} />
        </Suspense>
      </div>
    </section>
  );
};

export default Projects;
