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
      <ReelsField />

      <div
        className={`transition-opacity duration-700 ease-out ${siteBlurred ? "pointer-events-none opacity-0" : "opacity-100"}`}
        aria-hidden={siteBlurred}
      >
        <Header />
      </div>

      <div
        className={`transition-[filter,scale] duration-700 ease-out ${siteBlurred ? "scale-[0.96] blur-md" : ""}`}
        aria-hidden={siteBlurred}
      >
        <SmoothScroll />

        <main className="relative z-10">
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
