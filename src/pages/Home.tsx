import Header from "../components/Header";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import About from "../components/About";
import Testimonials from "../components/Testimonials";
import FAQs from "../components/FAQs";
import Benefits from "../components/Benefits";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Benefits />
      {/* <HowItWorks /> */}
      <Categories />
      <Testimonials />
      <FAQs />
    </>
  );
}
