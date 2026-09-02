const About = () => {
  return (
    <section id="about" className="relative mx-5 min-h-screen py-24 md:mx-20">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        {/* LABEL */}
        <div className="lg:col-span-2">
          <span className="font-space size12 uppercase text-grey">01 / About</span>
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-8 lg:col-start-4">
          <h2 className="font-instrument size64 leading-[0.95]">
            I turn ideas into
            <span className="font-italic text-blue"> digital experiences.</span>
          </h2>

          <div className="mt-10 max-w-2xl">
            <p className="font-space size16 leading-6 text-grey">
              I'm a software engineer who enjoys working where technology, design, and interaction meet. I build digital products with a
              focus on thoughtful interfaces, clean implementation, and the details that make an experience feel intentional.
            </p>

            <p className="mt-6 font-space size16 leading-6 text-grey">
              From websites and dashboards to larger web applications, I like taking an idea from its first visual direction all the way to
              a polished, functional experience.
            </p>
          </div>
        </div>

        {/* SIDE DETAILS */}
        <div className="lg:col-span-2 lg:col-start-11 lg:flex lg:flex-col lg:justify-end">
          <div className="font-space size12 uppercase text-grey">
            <p>Software Engineer</p>
            <p className="mt-1">Frontend / Full Stack</p>
            <p className="mt-1">Design & Development</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
