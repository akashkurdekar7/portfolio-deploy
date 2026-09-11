type ProjectCursorLabelProps = {
  visible: boolean;
  x: number;
  y: number;
  label: string;
};

// Desktop-only cursor-follow badge telling the viewer whether a project
// card links out to a live site, a GitHub repo, or opens the details modal.
const ProjectCursorLabel = ({ visible, x, y, label }: ProjectCursorLabelProps) => {
  return (
    <div
      className={`pointer-events-none fixed z-50 flex h-10 min-w-20 items-center justify-center whitespace-nowrap rounded-md border border-white/40 bg-white/10 px-3 font-space size12 uppercase text-black shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-md backdrop-saturate-150 transition-opacity duration-200 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
      aria-hidden="true"
    >
      {label}
    </div>
  );
};

export default ProjectCursorLabel;
