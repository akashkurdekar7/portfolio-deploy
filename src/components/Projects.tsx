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
    type: "B2B Full-Stack Web Application",
    year: "2025",
    images: [saas, saas2, saas3, saas4],
    description:
      "A full-stack B2B wholesale management platform with product and inventory management, customer accounts, order processing, payment tracking, and role-based business operations.",
    role: "Built the application end to end, from UI/UX and React architecture to Node.js/Express APIs, MongoDB data models, JWT authentication, RBAC, protected routes, and core business workflows.",
    company: "Independent Project",
    contribution: "Full Stack · UI/UX · Architecture · API Development",
    tools: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "JWT", "REST API", "RBAC"],
  },
  {
    title: "Ghost Rental",
    type: "Client Project · Rental Platform & Management Dashboard",
    year: "2025",
    images: [ghostrentals, ghostrentals2, ghostrentals3, ghostrentals4, ghostrentals5],
    description:
      "A client rental platform combining a customer-facing website with a management dashboard for managing products, rental operations, customer activity, and day-to-day business workflows.",
    role: "Onboarded to the client project as the frontend engineer and handled frontend development alongside project coordination, including client meetings, requirement discussions, task tracking, follow-ups, and cross-functional delivery.",
    company: "IngeniousPix Creative Studios · Client Project",
    contribution: "Frontend · Project Coordination · Dashboard · UI/UX",
    tools: ["Angular", "TypeScript", "Tailwind CSS", "Node.js", "REST APIs", "Git", "googlemeets", "documentation", "trello", "Slack"],
  },
  {
    title: "Greenminds",
    type: "Single Page Website",
    year: "2025",
    images: [greenminds, greenminds2, greenminds3, greenminds4],

    description:
      "A single-page brand website built to present Greenminds' offerings through a focused visual direction, structured content, and an engaging browsing experience.",

    role: "Developed the frontend as a single-page website, translating designs into responsive layouts, interactive sections, smooth animations, and reusable React components.",

    company: "IngeniousPix Creative Studios",
    contribution: "Frontend · UI · Interaction",

    tools: ["React", "TypeScript", "Tailwind CSS", "GSAP"],
  },
  {
    title: "Pixtar",
    type: "Company Website · Full Redesign & Rebuild",
    year: "2026",
    images: [pixtar, pixtar2],

    description:
      "A complete redesign and rebuild of the Pixtar company website, transforming the existing Angular experience into a modern, responsive platform focused on performance, accessibility, technical SEO, and user experience.",

    role: "Built the original Angular website and later rebuilt it with a complete visual and frontend overhaul, implementing responsive UI, animations, accessibility improvements, performance optimizations, and technical SEO. Improved Lighthouse scores to 90+ across key areas and contributed to a 30% increase in website users.",
    company: "IngeniousPix Creative Studios · Pixtar",
    contribution: "Frontend · Redesign · Performance · SEO",

    tools: ["Angular", "TypeScript", "Tailwind CSS", "GSAP", "Google Lighthouse", "Google Search Console", "Google Analytics"],
  },
  {
    title: "Make My Card",
    type: "Web Application & Management Dashboard",
    year: "2026",
    images: [makemycard, makemycard2, makemycard3],

    description:
      "A web application and management dashboard for creating, organizing, and managing digital card products, with dashboard-managed data powering the customer-facing website and Stripe integrated for payments.",

    role: "Developed the customer-facing website and management dashboard used to create and manage the data displayed on the website. Implemented reusable components, responsive interfaces, API integrations, and Stripe payment workflows while collaborating with senior engineers throughout development.",
    company: "IngeniousPix Creative Studios",
    contribution: "Frontend · Dashboard · Product UI",
    tools: ["Angular", "TypeScript", "Node.js", "Express", "Tailwind CSS", "REST APIs", "Stripe", "Git", "GitHub", "Playwright", "Postman"],
  },
  {
    title: "PhDesignMe",
    type: "Client Website & Management Dashboard",
    year: "2026",
    images: [phdesignme, phdesignme2, phdesignme3, phdesignme4, phdesignme5],
    description:
      "A client website and management dashboard combining a strong creative identity with responsive interfaces, custom animations, interactive experiences, and structured dashboard workflows.",
    role: "Developed the website frontend and contributed to the dashboard from UI/UX through implementation. Built responsive layouts, reusable interfaces, interactive sections, and custom GSAP animations while working across both customer-facing and administrative experiences.",
    company: "IngeniousPix Creative Studios · Client Project",
    contribution: "Frontend · UI/UX · Dashboard · Animation · Interaction",
    tools: ["Angular", "TypeScript", "Tailwind CSS", "GSAP"],
  },
  {
    title: "Arovan",
    type: "Client Website",
    year: "2026",
    images: [Arovan, Arovan2, Arovan3, Arovan4, Arovan5],

    description:
      "A modern client website built to present the brand through a clean visual system, structured content, and an engaging interactive experience.",

    role: "Contributed to the frontend development by building selected sections and reusable components, implementing responsive layouts, interactions, and UI details within the existing website architecture.",

    company: "IngeniousPix Creative Studios · Client Project",

    contribution: "Frontend · UI · Components",

    tools: ["Angular", "TypeScript", "Tailwind CSS", "AOS"],
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
          <sup className="size18 align-super  font-bricolage ml-1 text-white bg-blue rounded-full   px-2 ">0{projects.length}</sup>
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
