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
    type: "B2B Web Application",
    year: "2025",
    images: [saas, saas2, saas3, saas4],

    description:
      "A full-stack B2B wholesale platform built to manage products, inventory, customers, orders, payments, and business operations through a centralized system.",

    role: "Designed and developed the frontend architecture and user experience, while integrating REST APIs and independently organized backend services.",

    company: "Independent Project",
    contribution: "Full Stack · UI/UX · Architecture",
    tools: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
  },

  {
    title: "Ghost Rental",
    type: "Website & Management Dashboard",
    year: "2025",
    images: [ghostrentals, ghostrentals2, ghostrentals3, ghostrentals4, ghostrentals5],

    description:
      "A rental platform combining a customer-facing website with a management dashboard for handling products, rental operations, and day-to-day business workflows.",

    role: "Developed the website and dashboard, building reusable interfaces, connecting application workflows, and creating responsive experiences across customer and administrative views.",

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
      "A single-page brand website created to communicate Greenminds' offerings through a focused visual direction, structured content, and an engaging browsing experience.",

    role: "Designed and developed the frontend, translating the visual direction into responsive layouts, interactive sections, and motion-driven experiences.",

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
      "A complete redesign and rebuild of the Pixtar website, replacing the existing experience with a modern visual direction and a more refined frontend architecture.",

    role: "Reworked the website from the ground up across UI implementation, frontend development, responsive behavior, animations, and interactive experiences.",

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
      "A product-focused web application and management dashboard designed to simplify the creation, organization, and management of digital products.",

    role: "Developed the product interface and dashboard, creating reusable components, structured workflows, and consistent experiences across the application.",

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
      "A visually driven client website built around a strong creative identity, combining editorial-style layouts with interactive elements and a polished digital experience.",

    role: "Developed the frontend experience, translating the visual direction into responsive layouts, typography systems, animations, and interactive details.",

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
      "A modern client website focused on presenting the brand through a clean visual system, structured content, and an engaging interactive experience.",

    role: "Developed the frontend with a focus on visual hierarchy, responsive layouts, reusable components, and polished interactions.",

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
        <h2 className="size56 font-bricolage-semibold leading-none capitalize ">
          Projects
          <sup className="size12 align-super  font-bricolage ml-1 text-white bg-blue rounded-full border border-[#fff] px-1 ">
            0{projects.length}
          </sup>
        </h2>

        <p className="max-w-lg text-center font-bricolage size14 leading-4 text-grey">
          Selected work demonstrating my approach to design, development, and building meaningful digital experiences.
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
