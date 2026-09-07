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
import Quote from './components/Quote';
// import StackLoader from "./components/StackLoader";

const App = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-black">
      {/* <StackLoader /> */}
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

        <Quote />
      </main>

      <Footer />
    </div>
  );
};

export default App;
