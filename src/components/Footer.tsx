import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";

import footerImage from "../assets/footer.webp";

const Footer = () => {
  const links = [
    {
      name: "linkedin",
      icon: <FaLinkedin />,
      link: "https://www.linkedin.com/in/akashkurdekar/",
    },
    {
      name: "Instagram",
      icon: <FaInstagram />,
      link: "https://www.instagram.com/unlikeakash_",
    },
    {
      name: "G-mail",
      icon: <IoMailOutline />,
      link: "mailto:akashkurdekar39@gmail.com",
    },
    {
      name: "Github",
      icon: <FaGithub />,
      link: "https://github.com/akashkurdekar7",
    },
  ];

  return (
    <footer className="relative z-60 h-dvh lg:min-h-screen px-6 md:px-20  pt-5 lg:pt-25">
      {/* Background */}
      <img src={footerImage} alt="" className="absolute inset-0 z-10 h-full w-full object-cover" />

      {/* Heading */}
      <div className="relative z-20 pt-8 md:pt-0">
        <span className="font-space-bold size12 uppercase tracking-[0.15em] text-white">thoughts • work • life</span>

        <h2 className="mt-4 font-space size56 leading-16 tracking-tighter text-white ">
          let's get to the
          <br />
          <span className="font-italic text-white/50  tracking-normal">awkward</span>
          <span className="font-space"> part.</span>
        </h2>
      </div>

      {/* Social Links */}
      <div className="absolute left-1/2 top-105 lg:top-1/2 z-20 w-[calc(100%-3rem)] -translate-x-1/2 -translate-y-1/2 md:w-auto md:translate-y-17.5">
        <ul
          className=" flex flex-col items-stretch gap-1
            rounded-lg
            border border-white/30
            bg-white/8
            p-1
            backdrop-blur-[20px]
            backdrop-saturate-180
            shadow-[0_4px_8px_rgba(255,255,255,0.5)]
            md:flex-row md:items-center
          "
        >
          {links.map((item) => (
            <li key={item.name}>
              <a
                href={item.link}
                target={item.name === "G-mail" ? undefined : "_blank"}
                rel={item.name === "G-mail" ? undefined : "noreferrer"}
                className="
    group/link
    relative isolate overflow-hidden
    flex items-center justify-between gap-3
    rounded-md
    px-5 py-4
    
    text-white
    md:px-8 md:py-4 md:size28
  "
              >
                {/* WATER */}
                <span
                  className="
      pointer-events-none
      absolute inset-x-0 bottom-0 -z-10
      h-full
      translate-y-full
      bg-white/15
      transition-transform
      duration-1000
      ease-[cubic-bezier(.22,1,.36,1)]
      group-hover/link:translate-y-0
    "
                >
                  {/* LIQUID SURFACE */}
                  <span
                    className="
        absolute -top-[8px] left-1/2
        h-4 w-[130%]
        -translate-x-1/2
        rounded-[50%]
        bg-white/15
        blur-[1px]
      "
                  />
                </span>

                {/* CONTENT */}
                <span className="relative z-10 text-3xl md:text-[50px]">{item.icon}</span>

                <span className="relative z-10 w-max font-space size16 uppercase">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Info */}
      <div
        className="
    absolute bottom-4 left-1/2 z-20
    flex w-full -translate-x-1/2
    flex-col items-center gap-2
    px-6
    text-white
    lg:flex-row lg:items-end lg:justify-between lg:px-20
  "
      >
        {/* LOCATION */}
        <div className="flex items-baseline gap-1 font-instrument size16 cursor-pointer group">
          <span>Based in</span>

          <div className="link-rollover  ">
            <div className="link-rollover-inner">
              <span className="link-rollover-text font-instrument">India</span>

              <span className="link-rollover-text font-italic">Karnataka</span>
            </div>
          </div>
        </div>

        {/* NAME */}
        <div className="group link-rollover font-instrument size16 capitalize cursor-pointer">
          <div className="link-rollover-inner">
            <span className="link-rollover-text text-center font-instrument">Akash Kurdekar</span>

            <span className="link-rollover-text text-center font-italic">Let's talk</span>
          </div>
        </div>

        {/* OPPORTUNITIES */}
        <div className="group flex items-baseline gap-1 font-instrument size16 cursor-pointer">
          <span>Looking for</span>

          <div className="link-rollover ">
            <div className="link-rollover-inner">
              <span className="link-rollover-text font-instrument">Opportunities</span>

              <span className="link-rollover-text font-italic">Work</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
