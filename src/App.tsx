import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";
import Projects from "./components/Projects";
import Article from "./components/Article";
// import Reels from './components/Reels';
// import About from './components/About';
import Work from "./components/Work";
import ReelsField from "./components/ReelsField";
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

        <section className="h-screen flex items-center justify-center">
          <div className="mx-auto flex items-center justify-center flex-col">
            <blockquote className="mt-0">
              <h3 className="size56 font-italic   text-black ">“Fear cuts deeper than swords.”</h3>

              <footer className=" size12 font-space  text-black/50 text-end">
                — George R. R. Martin
                <span className="mx-2 text-neutral-300">/</span>
                <cite className="  not-italic">A Game of Thrones</cite>
              </footer>
            </blockquote>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default App;
