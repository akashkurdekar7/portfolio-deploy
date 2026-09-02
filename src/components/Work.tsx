import { useRef } from "react";
import gsap from "gsap";

const Work = () => {
  const imageRef = useRef<HTMLDivElement>(null);

  const experience = [
    {
      number: "01",
      type: "Internship",
      company: "Company Name",
      role: "Frontend Developer Intern",
      period: "2023 — 2024",
      description:
        "Worked on frontend development and translated product requirements and designs into responsive, production-ready interfaces.",
      image: "https://picsum.photos/seed/internship-one/500/650",
    },
    {
      number: "02",
      type: "Internship",
      company: "Company Name",
      role: "Software Engineer Intern",
      period: "2024",
      description:
        "Contributed to real-world web projects, developing reusable interfaces and improving existing products across design and frontend implementation.",
      image: "https://picsum.photos/seed/internship-two/500/650",
    },
    {
      number: "03",
      type: "Full-time",
      company: "Present Company",
      role: "Software Engineer",
      period: "2024 — Present",
      description:
        "Building and shipping websites and web applications across client and internal products, working across frontend engineering, UI implementation, dashboards, and interactive experiences.",
      image: "https://picsum.photos/seed/fulltime/500/650",
    },
  ];

  const moveImage = (x: number, y: number) => {
    if (!imageRef.current) return;

    gsap.to(imageRef.current, {
      x,
      y,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  const showImage = (image: string) => {
    if (!imageRef.current) return;

    const img = imageRef.current.querySelector("img");

    if (img) {
      img.src = image;
    }

    gsap.to(imageRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.45,
      ease: "power3.out",
    });
  };

  const hideImage = () => {
    if (!imageRef.current) return;

    gsap.to(imageRef.current, {
      opacity: 0,
      scale: 0.85,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <section id="work" className="relative mx-5 min-h-screen py-24 md:mx-20">
      {/* FLOATING IMAGE */}
      <div
        ref={imageRef}
        className="pointer-events-none fixed left-0 top-0 z-50 hidden w-48 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[14px] border-2 border-black opacity-0 md:block"
      >
        <img src="" alt="" className="aspect-[4/5] h-auto w-full object-cover" />
      </div>

      {/* HEADER */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-2">
          <span className="font-space size12 uppercase text-grey">02 / Experience</span>
        </div>

        <div className="lg:col-span-8 lg:col-start-4">
          <h2 className="font-instrument size64 leading-[0.9]">
            Where I've
            <br />
            <span className="font-italic text-blue">worked.</span>
          </h2>

          <p className="mt-8 max-w-xl font-space size16 leading-6 text-grey">
            A timeline of the places, teams, and products that have shaped the way I approach design and engineering.
          </p>
        </div>
      </div>

      {/* EXPERIENCE */}
      <div className="mt-24 border-t border-black/15">
        {experience.map((item) => (
          <article
            key={item.number}
            onMouseEnter={() => showImage(item.image)}
            onMouseMove={(e) => {
              moveImage(e.clientX, e.clientY);
            }}
            onMouseLeave={hideImage}
            className="group grid cursor-none grid-cols-1 gap-6 border-b border-black/15 py-10 transition-all duration-500 lg:grid-cols-12 lg:gap-8"
          >
            {/* NUMBER */}
            <div className="lg:col-span-1">
              <span className="font-space size12 text-grey">{item.number}</span>
            </div>

            {/* COMPANY */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full border border-black transition-colors duration-300 group-hover:border-orange group-hover:bg-[#ff5a1f]" />

                <span className="font-space size12 uppercase text-grey">{item.type}</span>
              </div>

              <h3 className="mt-3 font-instrument size44 leading-none transition-transform duration-500 group-hover:translate-x-2">
                {item.company}
              </h3>
            </div>

            {/* ROLE + DESCRIPTION */}
            <div className="lg:col-span-5">
              <h4 className="font-space size14 uppercase">{item.role}</h4>

              <p className="mt-4 max-w-lg font-space size14 leading-5 text-grey">{item.description}</p>
            </div>

            {/* DATE */}
            <div className="lg:col-span-3 lg:text-right">
              <span className="font-space size12 uppercase text-grey">{item.period}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Work;
