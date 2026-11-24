import Header from "../components/Header";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import PopularCourses from "../components/PopularCourses";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import AssistantCTA from "../components/AssistantCTA";
import CTA from "../components/CTA";
import About from "../components/About";

export default function Home() {
  return (
    <>
      <Header embedded />
      <Hero />
      <About />
      <Categories />
      {/* <PopularCourses /> */}
      <HowItWorks />
      <Features />
      <AssistantCTA />
      {/* <CTA /> */}
    </>
  );
}
