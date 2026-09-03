import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const images = [
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1600",
  "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1600",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1600",
];

const Demo = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const images = gsap.utils.toArray(".img img");

      images.forEach((image) => {
        gsap.fromTo(
          image,
          {
            yPercent: -10,
          },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: image.closest(".img"),
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="demo" ref={sectionRef}>
      {images.map((image, index) => (
        <div className="img" key={index}>
          <img src={image} alt={`Project ${index + 1}`} />
        </div>
      ))}
    </section>
  );
};

export default Demo;
