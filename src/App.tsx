import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";
import Projects from "./components/Projects";
import Article from "./components/Article";
import ReelsField from "./components/ReelsField";
// import About from "./components/About";
import Resume from "./components/Resume";
import Quote from "./components/Quote";
import Loader from "./components/Loader";
import WhatsAppButton from "./components/WhatsAppButton";
import Work from "./components/Work";

const App = () => {
  const [siteBlurred, setSiteBlurred] = useState(true);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-black">
      <Loader onStuck={() => setSiteBlurred(true)} onDismiss={() => setSiteBlurred(false)} />

      {/* Placed after Loader, not before: when its "click me" button (the
          loader's only focusable content) is clicked and removed from the
          DOM, Chromium resumes the *next* Tab press from that former DOM
          position rather than resetting to document start — a skip link
          positioned earlier gets silently skipped for every user who just
          dismissed the loader, which is effectively everyone. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-md focus:bg-black focus:px-4 focus:py-2 focus:font-space focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <ReelsField />

      <div
        className={`transition-opacity duration-700 ease-out ${siteBlurred ? "pointer-events-none opacity-0" : "opacity-100"}`}
        aria-hidden={siteBlurred}
        inert={siteBlurred}
      >
        <Header />
      </div>

      <div
        className={`transition-[filter,scale] duration-700 ease-out ${siteBlurred ? "scale-[0.96] blur-md" : ""}`}
        aria-hidden={siteBlurred}
        inert={siteBlurred}
      >
        <SmoothScroll />

        <main id="main-content" tabIndex={-1} className="relative z-10 outline-none">
          <Hero />
          <Projects />
          <Article />
          <Work />
          {/* <About /> */}
          <Resume />

          <Quote />
        </main>

        <Footer />
      </div>

      <WhatsAppButton />
    </div>
  );
};

export default App;
