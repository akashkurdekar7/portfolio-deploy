import React from "react";
import { Lottie } from "lottie-react";
import ProjectCard, { type Project } from "./ProjectCard";
import catLove from "../assets/gifs/Cat feeling love emotionsexpression. Emojisticker animation/animations/12345.json?url";
import catPlaying from "../assets/gifs/Cat playing animation/animations/4c65d4b8-cda4-4975-8270-6e10c8c56173.json?url";

interface ProjectsDesktopProps {
  projects: Project[];
}

const ProjectsDesktop = ({ projects }: ProjectsDesktopProps) => {
  return (
    <div className="lg:pt-25 relative pt-8">
      <Lottie src={catLove} loop autoplay className="absolute top-[60%] left-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-38 h-max" />
      <Lottie src={catPlaying} loop autoplay className="absolute top-[85%] left-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-38 h-max" />

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
  );
};

export default ProjectsDesktop;
