import { lazy, Suspense, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectsStack from "./ProjectsStack";
import ProjectModal from "./ProjectModal";
import type { Project } from "./ProjectCard";

const ProjectsDesktop = lazy(() => import("./ProjectsDesktop"));

import saas from "../assets/projects/saas.webp";
import saas2 from "../assets/projects/saas2.webp";
import saas3 from "../assets/projects/saas3.webp";
import saas4 from "../assets/projects/saas4.webp";
import ghostrentals from "../assets/projects/ghostrental.webp";
import ghostrentals2 from "../assets/projects/ghostrental2.webp";
import ghostrentals3 from "../assets/projects/ghostrental3.webp";
import ghostrentals4 from "../assets/projects/ghostrental4.webp";
import ghostrentals5 from "../assets/projects/ghostrental5.webp";
import greenminds from "../assets/projects/greenminds.webp";
import greenminds2 from "../assets/projects/greenminds2.webp";
import greenminds3 from "../assets/projects/greenminds3.webp";
import greenminds4 from "../assets/projects/greenminds4.webp";
import pixtar from "../assets/projects/pixtar.webp";
import pixtar2 from "../assets/projects/pixtar2.webp";
import phdesignme from "../assets/projects/phdesignme.webp";
import phdesignme2 from "../assets/projects/phdesignme2.webp";
import phdesignme3 from "../assets/projects/phdesignme3.webp";
import phdesignme4 from "../assets/projects/phdesignme4.webp";
import phdesignme5 from "../assets/projects/phdesignme5.webp";
import makemycard from "../assets/projects/makemycard.webp";
import makemycard2 from "../assets/projects/makemycard2.webp";
import makemycard3 from "../assets/projects/makemycard3.webp";
import Arovan from "../assets/projects/arovan.webp";
import Arovan2 from "../assets/projects/arovan2.webp";
import Arovan3 from "../assets/projects/arovan3.webp";
import Arovan4 from "../assets/projects/arovan4.webp";
import Arovan5 from "../assets/projects/arovan5.webp";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Wholesale Management System",
    type: "Web Application",
    year: "2025",
    images: [saas, saas2, saas3, saas4],

    description:
      "A wholesale management platform built to streamline product, order, and business operations through a centralized web application.",

    role: "Designed and developed the application, focusing on intuitive workflows, reusable interfaces, and scalable frontend architecture.",

    company: "Independent Project",
    contribution: "Frontend · UI/UX · Architecture",
    tools: ["React", "TypeScript", "Tailwind CSS", "Vite"],
  },

  {
    title: "Ghost Rental",
    type: "Website & Dashboard",
    year: "2025",
    images: [ghostrentals, ghostrentals2, ghostrentals3, ghostrentals4, ghostrentals5],

    description: "A rental platform combining a customer-facing website with a management dashboard for handling rental operations.",

    role: "Developed the website and dashboard, building reusable interfaces, responsive layouts, and interactive frontend experiences.",

    company: "IngeniousPix Creative Studios",
    contribution: "Frontend · Dashboard · UI",
    tools: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
  },

  {
    title: "Greenminds",
    type: "Single Page Website",
    year: "2025",
    images: [greenminds, greenminds2, greenminds3, greenminds4],

    description:
      "A focused single-page website designed to present the brand, its offerings, and key information through a clear visual experience.",

    role: "Designed and developed the frontend with an emphasis on responsive layouts, visual hierarchy, and smooth interactions.",

    company: "IngeniousPix Creative Studios",
    contribution: "Design · Frontend · Interaction",
    tools: ["React", "TypeScript", "Tailwind CSS", "GSAP"],
  },

  {
    title: "Pixtar",
    type: "Company Website",
    year: "2026",
    images: [pixtar, pixtar2],

    description:
      "A complete transformation of the existing Pixtar website, rebuilding the experience from the ground up with a new visual direction and modern frontend architecture.",

    role: "Reworked the existing website into the current experience, contributing across frontend development, UI implementation, interactions, and responsive design.",

    company: "IngeniousPix Creative Studios",
    contribution: "Frontend · UI · Redesign",
    tools: ["React", "TypeScript", "Tailwind CSS", "GSAP"],
  },

  {
    title: "Make My Card",
    type: "Web Application & Dashboard",
    year: "2026",
    images: [makemycard, makemycard2, makemycard3],

    description:
      "A product web application and management dashboard built to provide users with a streamlined experience for creating and managing digital products.",

    role: "Developed the product interface and dashboard, focusing on reusable components, responsive layouts, and a consistent user experience.",

    company: "IngeniousPix Creative Studios",
    contribution: "Frontend · Dashboard · UI",
    tools: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
  },

  {
    title: "PhDesignMe",
    type: "Client Website",
    year: "2026",
    images: [phdesignme, phdesignme2, phdesignme3, phdesignme4, phdesignme5],

    description:
      "A client website built around a strong visual identity, combining editorial presentation with a responsive and engaging digital experience.",

    role: "Developed the frontend experience with attention to layout, typography, responsive behavior, and interactive details.",

    company: "IngeniousPix Creative Studios",
    contribution: "Frontend · UI · Interaction",
    tools: ["React", "TypeScript", "Tailwind CSS", "GSAP"],
  },
  {
    title: "Arovan",
    type: "Client Website",
    year: "2026",
    images: [Arovan, Arovan2, Arovan3, Arovan4, Arovan5],
    description:
      "A client website built around a strong visual identity, combining editorial presentation with a responsive and engaging digital experience.",

    role: "Developed the frontend experience with attention to layout, typography, responsive behavior, and interactive details.",

    company: "IngeniousPix Creative Studios",
    contribution: "Frontend · UI · Interaction",
    tools: ["React", "TypeScript", "Tailwind CSS", "GSAP"],
  },
];

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative mx-5 min-h-screen overflow-hidden py-16 lg:py-24 md:mx-20">
      {/* Heading */}
      <div className="flex flex-col items-center gap-3">
        <h2 className="size56 font-chunko leading-none capitalize ">
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
        <ProjectsStack projects={projects} onSelectProject={setSelectedProject} />
      </div>

      {/* TABLET / DESKTOP: static grid layout */}
      <div className="relative hidden md:block">
        <Suspense fallback={null}>
          <ProjectsDesktop projects={projects} onSelectProject={setSelectedProject} />
        </Suspense>
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
};

export default Projects;
