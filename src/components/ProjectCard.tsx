import { FaArrowRight } from "react-icons/fa";

type Project = {
  image?: string;
  title: string;
  type: string;
  year: string | number;
  description: string;
  role: string;
};

type ProjectCardProps = {
  project: Project;
  index: number;
  variant?: "default" | "center";
};

const ProjectCard = ({ project, index, variant = "default" }: ProjectCardProps) => {
  const clipId = `imageClip-${variant}-${index}`;

  const fallbackImage = `https://picsum.photos/900/700?random=${index + 1}`;

  const projectImage = project.image || fallbackImage;

  const defaultPath = `
    M 0 0
    H 450
    V 292
    C 450 294 448 295 446 294
    C 440 289 432 286 423 286
    C 402 286 385 303 385 324
    C 385 332 388 340 392 346
    C 393 348 392 350 390 350
    H 0
    Z
  `;

  const centerPath = `
    M 0 0
    H 450
    V 285
    H 384
    V 350
    H 0
    Z
  `;

  const path = variant === "center" ? centerPath : defaultPath;

  return (
    <div className="group mx-auto h-auto w-full lg:w-[420px] cursor-pointer ">
      <div className="relative mx-auto aspect-[450/350] w-full">
        <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 450 350" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id={clipId}>
              <path d={path} />
            </clipPath>
          </defs>

          {/* IMAGE */}
          <image href={projectImage} width="450" height="350" preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clipId})`} />

          {/* BORDER */}
          <path d={path} stroke="black" strokeWidth="3" fill="none" />
        </svg>

        {/* ARROW */}
        <div
          className={` absolute right-0 bottom-0 link-circle flex items-center justify-center  border-[3px] border-black   transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]  group-hover:scale-[0.88]
    ${variant === "center" ? "rounded-none" : "rounded-full"}
  `}
        >
          <FaArrowRight
            size={20}
            className="
      -rotate-45
      text-orange
      transition-all duration-500
      ease-[cubic-bezier(0.22,1,0.36,1)]
      group-hover:rotate-0
    "
          />
        </div>
      </div>

      {/* INFO */}
      <div className="mt-2 flex flex-col items-start  justify-between lg:mt-4">
        <div className="flex justify-between items-center w-full">
          <h3 className="font-instrument size28 capitalize">{project.title}</h3>

          <span className="rounded-full border bg-white px-3 py-1 font-space size12 text-grey">{project.year}</span>
        </div>
        <p className="mt-1 font-space size12 uppercase text-grey">{project.type}</p>

        {variant !== "center" ? (
          <p className="mt-1 font-space size16 leading-5 text-grey text-justify">{project.description}</p>
        ) : (
          <p className="mt-1 font-space size16 leading-5 text-grey text-justify xl:hidden">{project.description}</p>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
