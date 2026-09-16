import { useLayoutEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProjectCard, { type Project } from "./ProjectCard";
import ProjectCursorLabel from "./ProjectCursorLabel";

interface ProjectsDesktopProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

// Pinterest-style masonry: projects alternate into 2 hand-built columns
// (rather than CSS `columns-2`, whose auto-balancing can empty one column
// early and leave a lopsided gap beside the other) and sized to fill each
// column instead of the old fixed 420px card width. The right column starts
// lower for the classic staggered brick look.
const ProjectsDesktop = ({ projects, onSelectProject }: ProjectsDesktopProps) => {
  const leftColumn = projects.filter((_, index) => index % 2 === 0);
  const rightColumn = projects.filter((_, index) => index % 2 === 1);

  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false, label: "View Details" });

  const handleEnter = () => {
    setCursor((c) => ({ ...c, visible: true, label: "View Details" }));
  };

  const handleLeave = () => {
    setCursor((c) => ({ ...c, visible: false }));
  };

  const handleMove = (event: React.MouseEvent) => {
    setCursor((c) => ({ ...c, x: event.clientX, y: event.clientY }));
  };

  // This grid mounts behind a lazy() + Suspense boundary, so other sections'
  // ScrollTriggers may have already measured the page at its pre-grid,
  // heading-only height. Refresh once real content lands so those triggers'
  // start/end reflect the grid's actual height.
  useLayoutEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  const renderCard = (project: Project) => {
    const index = projects.indexOf(project);
    return (
      <div key={project.title} className="mb-12 block lg:mb-16 xl:mb-20">
        <ProjectCard
          project={project}
          index={index}
          className="mx-auto h-auto w-full"
          onImageMouseEnter={handleEnter}
          onImageMouseLeave={handleLeave}
          onImageMouseMove={handleMove}
          onSelect={() => onSelectProject(project)}
        />
      </div>
    );
  };

  return (
    <div className="lg:pt-25 relative pt-8">
      <div className="flex flex-col lg:flex-row gap-x-8 lg:gap-x-16 xl:gap-x-24">
        <div className="flex flex-1 flex-col">{leftColumn.map(renderCard)}</div>
        <div className="flex flex-1 flex-col lg:mt-24 xl:mt-32">{rightColumn.map(renderCard)}</div>
      </div>

      <ProjectCursorLabel visible={cursor.visible} x={cursor.x} y={cursor.y} label={cursor.label} />
    </div>
  );
};

export default ProjectsDesktop;
