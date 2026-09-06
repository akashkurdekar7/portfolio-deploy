import { FaEnvelope, FaGithub, FaHandsHelping, FaInstagram, FaLinkedin } from 'react-icons/fa';

import Crowd from './Crowd';
import RollingText from './RollingText';
import sheet from '../assets/open-peeps-sheet.png';

const TILE_THEMES = [
  'bg-blue text-white',
  'bg-orange text-black',
  'bg-white text-black',
  'bg-black text-[#f5d949] border border-[#f5d949]/30',
];

const ROTATIONS = ['-rotate-3', 'rotate-3', 'rotate-2', '-rotate-2'];

const Footer = () => {
  const links = [
    {
      name: 'linkedin',
      icon: <FaLinkedin />,
      link: 'https://www.linkedin.com/in/akashkurdekar/',
    },
    {
      name: 'Instagram',
      icon: <FaInstagram />,
      link: 'https://www.instagram.com/unlikeakash_',
    },
    {
      name: 'G-mail',
      icon: <FaEnvelope />,
      link: 'mailto:akashkurdekar39@gmail.com',
    },
    {
      name: 'Github',
      icon: <FaGithub />,
      link: 'https://github.com/akashkurdekar7',
    },
  ];

  return (
    <footer className="bg-black relative z-60 h-dvh lg:min-h-screen px-6 md:px-20  pt-5 lg:pt-25 ">
      <svg className="absolute -top-[4%] left-0 z-10 h-10 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none">
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
          fill="#111111"
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Crowd src={sheet} rows={15} cols={7} className="h-full w-full" />
      </div>
      {/* Heading */}
      <div className="relative z-20 pt-8 md:pt-0">
        <span className="font-space-bold size12 uppercase tracking-[0.15em] text-white">thoughts • work • life</span>

        <h2 className="mt-4 font-chunko leading-9 lg:leading-18 size90 capitalize text-white  ">
          let's get to the
          <br />
          <span className="font-italic text-white/50  tracking-normal">awkward</span>
          <span className="font-chunko"> part.</span>
        </h2>
        {/* Social Links */}
        <div className="">
          {/* Mobile: pinned sticker grid */}
          <ul className="grid grid-cols-2 gap-3.5 md:hidden">
            {links.map((item, i) => (
              <li key={item.name} className={ROTATIONS[i % ROTATIONS.length]}>
                <a
                  href={item.link}
                  target={item.name === 'G-mail' ? undefined : '_blank'}
                  rel={item.name === 'G-mail' ? undefined : 'noreferrer'}
                  className={`
                  group/tile relative flex aspect-[6/5] w-full flex-col justify-between
                  overflow-hidden rounded-2xl p-4
                  transition-[transform,box-shadow] duration-200 ease-out
                  active:translate-y-1.5 active:rotate-0 active:scale-[0.97] active:shadow-[0_1px_0_rgba(0,0,0,0.35)]
                  ${TILE_THEMES[i % TILE_THEMES.length]}
                `}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-space size12 opacity-50">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-space size56 leading-none opacity-70 transition-transform duration-200 group-active/tile:rotate-45">
                      <FaHandsHelping />
                    </span>
                  </div>

                  <div>
                    <span className="block text-4xl leading-none">{item.icon}</span>
                    <span className="mt-3 block font-space size16 uppercase tracking-wide">{item.name}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>

          {/* Tablet / Desktop: liquid glass row */}
          <ul
            className=" hidden
            rounded-lg
            border border-white/30
            bg-white/8
            p-1
            backdrop-blur-[20px]
            backdrop-saturate-180
            shadow-[0_4px_8px_rgba(255,255,255,0.5)]
            md:grid md:grid-cols-4 md:items-stretch
          "
          >
            {links.map((item) => (
              <li key={item.name}>
                <a
                  href={item.link}
                  target={item.name === 'G-mail' ? undefined : '_blank'}
                  rel={item.name === 'G-mail' ? undefined : 'noreferrer'}
                  className="
    group/link
    relative isolate overflow-hidden
    flex items-center justify-between gap-3
    rounded-md
    px-5 py-4

    text-white
    md:justify-center md:px-8 md:py-4 md:size28
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

                  <span className=" relative z-10 text-3xl md:text-[50px]">{item.icon}</span>
                  <span className="relative z-10 w-max font-space size16 uppercase w-max">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
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
        <div
          className="
      rounded-full
      border border-white/15
      bg-black/10
      px-4 lg:py-2 py-1
      backdrop-blur-md
      backdrop-saturate-150
      shadow-[0_4px_20px_rgba(0,0,0,0.08)]
    "
        >
          <div className="group flex items-baseline gap-1 font-instrument size16 cursor-pointer">
            <span>Based in</span>

            <RollingText
              primary="Karnataka"
              primaryClassName="font-instrument"
              secondary="India"
              secondaryClassName="font-italic"
            />
          </div>
        </div>

        {/* NAME */}
        <div
          className="
      rounded-full
      border border-white/15
      bg-black/10
     px-4 lg:py-2 py-1
      backdrop-blur-md
      backdrop-saturate-150
      shadow-[0_4px_20px_rgba(0,0,0,0.08)]
    "
        >
          <div className="group flex items-baseline gap-1 font-instrument size16 capitalize cursor-pointer">
            <RollingText
              primary="Akash Kurdekar"
              primaryClassName="text-center font-instrument"
              secondary="Let's talk"
              secondaryClassName="text-center font-italic"
            />
          </div>
        </div>

        {/* OPPORTUNITIES */}
        <div
          className="
      rounded-full
      border border-white/15
      bg-black/10
      px-4 lg:py-2 py-1
      backdrop-blur-md
      backdrop-saturate-150
      shadow-[0_4px_20px_rgba(0,0,0,0.08)]
    "
        >
          <div className="group flex items-baseline gap-1 font-instrument size16 cursor-pointer">
            <span>Looking for</span>

            <RollingText
              primary="Opportunities"
              primaryClassName="font-instrument"
              secondary="Work"
              secondaryClassName="font-italic"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
