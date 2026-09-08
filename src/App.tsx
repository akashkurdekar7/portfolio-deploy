import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';
import Projects from './components/Projects';
import Article from './components/Article';
// import Reels from './components/Reels';
// import About from './components/About';
import Work from './components/Work';
import ReelsField from './components/ReelsField';
import Resume from './components/Resume';
import Quote from './components/Quote';
import Loader from './components/Loader';
import WhatsAppButton from './components/WhatsAppButton';
// import StackLoader from "./components/StackLoader";

const App = () => {
  const [siteBlurred, setSiteBlurred] = useState(true);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-black">
      <Loader onStuck={() => setSiteBlurred(true)} onDismiss={() => setSiteBlurred(false)} />

      <div
        className={`transition-[filter,scale] duration-700 ease-out ${
          siteBlurred ? 'scale-[0.96] blur-md' : 'scale-100 blur-none'
        }`}
        aria-hidden={siteBlurred}
      >
        <SmoothScroll />
        <ReelsField />

        <Header />

        <main className="relative z-10">
          <Hero />
          {/* <About /> */}
          <Projects />
          <Article />
          <Work />
          {/* <Reels /> */}
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
