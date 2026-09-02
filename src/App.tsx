import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";
import Projects from "./components/Projects";
import Article from "./components/Article";
import About from "./components/About";
import Work from "./components/Work";

const App = () => {
  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      <SmoothScroll />

      <Header />

      <main>
        <Hero />
        <About />
        <Projects />
        <Article />
        <Work />
      </main>

      <Footer />
    </div>
  );
};

export default App;
