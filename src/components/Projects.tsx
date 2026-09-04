import React from "react";
import ProjectCard from "./ProjectCard";
import ProjectsStack from "./ProjectsStack";
import saas from "../assets/projects/saas.webp";
import ghostrentals from "../assets/projects/ghostrental.webp";
import greenminds from "../assets/projects/greenminds.webp";
import pixtar from "../assets/projects/pixtar.webp";
import phdesignme from "../assets/projects/phdesignme.webp";
import makemycard from "../assets/projects/makemycard.webp";
import Arovan from "../assets/projects/arovan.webp";

const Projects = () => {
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

      {/* TABLET / DESKTOP: existing layout */}
      <div className="lg:pt-25 hidden pt-8 md:block">
        {/* FIRST TWO */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:gap-x-16 lg:gap-y-16 xl:grid-cols-2 xl:gap-x-24 xl:gap-y-20">
          {projects.slice(0, 2).map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>

        {/* CENTER PROJECT */}
        <div className="grid grid-cols-1 items-center xl:grid-cols-3 md:py-25 py-8">
          {projects.slice(2, 3).map((project, index) => (
            <React.Fragment key={project.title}>
              {/* LEFT */}
              <div className="hidden xl:flex flex-col items-end justify-end mr-8 gap-1">
                <span className="size18 font-space-bold capitalize">action</span>
                <p className="max-w-xs font-space size12 text-grey text-start">{project.description}</p>
              </div>

              {/* PROJECT */}
              <ProjectCard project={project} index={index + 2} variant="center" />

              {/* RIGHT */}
              <div className="hidden xl:flex flex-col items-start justify-start ms-8 gap-1">
                <span className="size18 font-space-bold capitalize">result</span>

                <p className="max-w-xs font-space size12 text-grey text-end">{project.role}</p>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* LAST PROJECT */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-20 xl:grid-cols-2">
          {projects.slice(3).map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index + 3} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
