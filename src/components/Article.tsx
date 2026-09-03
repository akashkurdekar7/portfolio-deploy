import React, { useMemo } from "react";
import Star1 from "../assets/article/Star1.svg";
import Star2 from "../assets/article/Star2.svg";
import Star3 from "../assets/article/Star3.svg";

const Article = () => {
  const categories = [
    {
      name: "SOFTWARE ENGINEER",
      color: "text-white",
    },
    {
      name: "FRONTEND DEVELOPER",
      color: "text-blue",
    },
    {
      name: "UI / UX DESIGNER",
      color: "text-yellow-300",
    },
    {
      name: "PROJECT LEAD",
      color: "text-orange",
    },
    {
      name: "REACT DEVELOPER",
      color: "text-violet-500",
    },
    {
      name: "TYPESCRIPT",
      color: "text-blue",
    },
    {
      name: "CREATIVE DEVELOPER",
      color: "text-orange",
    },
    {
      name: "INTERACTION DESIGN",
      color: "text-yellow-300",
    },
    {
      name: "GSAP / MOTION",
      color: "text-violet-500",
    },
    {
      name: "WEB APPLICATIONS",
      color: "text-white",
    },
    {
      name: "DESIGN → CODE",
      color: "text-orange",
    },
    {
      name: "DIGITAL EXPERIENCES",
      color: "text-blue",
    },
  ];

  const images = [Star1, Star2, Star3];

  const marqueeItems = Array(10).fill(categories).flat();

  const randomImages = useMemo(() => {
    let previous = -1;

    return marqueeItems.map(() => {
      let current;

      do {
        current = Math.floor(Math.random() * images.length);
      } while (current === previous);

      previous = current;

      return images[current];
    });
  }, [marqueeItems.length]);

  return (
    <section className="relative  py-12 lg:py-16">
      <div className="relative ">
        {/* TOP WAVE */}
        <svg className="article-wave absolute -top-[1px] left-0 z-10 h-10 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path
            d="
          M0,40
          C120,5 220,75 360,38
          C500,0 590,70 720,35
          C850,0 950,75 1080,38
          C1200,5 1320,65 1440,30
          L1440,0
          L0,0
          Z
        "
            fill="#f7f6f2"
          />
        </svg>

        {/* MARQUEE */}
        <div className="overflow-hidden bg-black py-8 lg:py-10">
          <div className="marquee flex w-max items-center gap-18">
            {marqueeItems.map((item, index) => (
              <React.Fragment key={`${item.name}-${index}`}>
                <span className={`font-chunko tracking-[2px] lg:tracking-[5px] size56 whitespace-nowrap ${item.color}`}>{item.name}</span>

                <img src={randomImages[index]} alt="" className="h-5  lg:h-10 w-auto shrink-0 object-cover" />
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* BOTTOM WAVE */}
        <svg className="absolute -bottom-[1px] left-0 z-10 h-10 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path
            d="
          M0,45
          C130,75 220,5 360,42
          C500,78 590,10 720,45
          C850,80 950,5 1080,42
          C1200,75 1320,15 1440,48
          L1440,80
          L0,80
          Z
        "
            fill="#f7f6f2"
          />
        </svg>
      </div>
    </section>
  );
};

export default Article;
