import { useEffect, useRef } from "react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import hero from "../assets/hero.webp";
import clouds from "../assets/clouds.png";
import gsap from "gsap";
const Hero = () => {
  const cloudRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const strengths = [20, 12, 16, 10, 25];

    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;

      cloudRefs.current.forEach((cloud, index) => {
        if (!cloud) return;

        gsap.to(cloud, {
          x: x * strengths[index],
          y: y * strengths[index],
          duration: 1.2,
          ease: "power3.out",
          overwrite: true,
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section className="relative flex h-dvh items-center justify-center lg:mx-20 mx-6">
      <div className="flex flex-col items-center gap-10 relative z-30">
        <div className="hero-image overflow-hidden relative h-80 w-full md:w-170 rounded-[20px] border-6">
          <img src={hero} alt="Akash Kurdekar" className="h-full w-full object-cover" />
        </div>

        {/* HERO CONTENT */}
        <div className="hero-content flex flex-col items-center justify-center transition-all duration-700">
          <h1 className="size44 font-instrument leading-none capitalize">
            akash <span className="text-blue font-italic">kurdekar</span>
          </h1>

          <div className="lg:my-5 my-2">
            <ul className="flex flex-wrap gap-x-2 font-space size12 uppercase">
              <li>software engineer</li>
              <li>•</li>
              <li>project lead</li>
              <li>•</li>
              <li>designer</li>
            </ul>
          </div>

          <p className="w-full lg:max-w-2xl text-center size16 lg:leading-6 font-space text-grey">
            I build thoughtful digital experiences by combining engineering, design, and a little bit of obsession over the details.
          </p>
        </div>
      </div>

      {/* SOCIALS */}
      <div className={`group absolute bottom-4 left-0 flex items-start gap-1 flex-col hero-side-content transition-all duration-700 `}>
        <h3 className="font-space font-space-bold size14 uppercase mb-0">let's connect</h3>

        <div className="h-px w-[22%] group-hover:w-full transition-all duration-1000 bg-orange" />

        <ul className="flex items-center gap-4 w-full justify-between">
          <li className="cursor-pointer transition hover:-translate-y-[.5px]">
            <FaInstagram size={18} />
          </li>

          <li className="cursor-pointer transition hover:-translate-y-[.5px]">
            <FaLinkedin size={18} />
          </li>

          <li className="cursor-pointer transition hover:-translate-y-[.5px]">
            <IoMailOutline size={18} />
          </li>

          <li className="cursor-pointer transition hover:-translate-y-[.5px]">
            <FaGithub size={18} />
          </li>
        </ul>
      </div>

      {/* SCROLL LINE */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 hero-side-content transition-opacity duration-700`}
      >
        <div className="relative h-6 w-px overflow-hidden text-grey">
          <div className="absolute top-0 left-0 w-full h-full bg-orange origin-top animate-[scrollLine_2s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* TOP RIGHT */}
      <div
        ref={(el) => {
          cloudRefs.current[0] = el;
        }}
        className="absolute -top-12 -right-8 z-20 cloud-parallax"
      >
        <img src={clouds} alt="" aria-hidden="true" className=" h-auto w-full object-cover" loading="lazy" title="Cloud" />
      </div>

      {/* MIDDLE LEFT */}
      <div
        ref={(el) => {
          cloudRefs.current[1] = el;
        }}
        className="absolute top-[60%] -left-[1%] z-20 -translate-x-1/2 cloud-parallax -translate-y-1/2"
      >
        <img src={clouds} alt="" aria-hidden="true" className=" h-auto w-full object-cover" loading="lazy" title="Cloud" />
      </div>

      {/* MIDDLE RIGHT */}
      <div
        ref={(el) => {
          cloudRefs.current[2] = el;
        }}
        className="absolute top-[60%] right-[30%] z-20 -translate-y-1/2 cloud-parallax"
      >
        <img src={clouds} alt="" aria-hidden="true" className=" h-auto w-30 object-cover" loading="lazy" title="Cloud" />
      </div>

      {/* PROFILE */}
      <div
        ref={(el) => {
          cloudRefs.current[3] = el;
        }}
        className="absolute top-[20%] left-[15%] z-20 -translate-y-1/2 cloud-parallax"
      >
        <img src={clouds} alt="" aria-hidden="true" className=" h-auto w-full object-cover" loading="lazy" title="Cloud" />
      </div>

      {/* BOTTOM RIGHT */}
      <div
        ref={(el) => {
          cloudRefs.current[4] = el;
        }}
        className="absolute -right-20 -bottom-40 z-20 w-[25%] cloud-parallax "
      >
        <img src={clouds} alt="" aria-hidden="true" className=" h-auto w-full object-cover" loading="lazy" title="Cloud" />

        <div
          className={`absolute z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-space-bold size12 uppercase hero-side-content transition-opacity duration-700 `}
        >
          DOWN YOU GO
        </div>
      </div>
    </section>
  );
};

export default Hero;
