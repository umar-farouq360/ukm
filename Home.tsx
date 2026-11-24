import Header from '../components/Header'
import HeroFrame from '../components/HeroFrame'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import Categories from '../components/Categories'
import PopularCourses from '../components/PopularCourses'
import HowItWorks from '../components/HowItWorks'
import Features from '../components/Features'
import AssistantCTA from '../components/AssistantCTA'
import CTA from '../components/CTA'

export default function Home() {
  return (
    <>
      <HeroFrame>
        <Header embedded />
        <Hero />
        <Stats />
      </HeroFrame>
      <Categories />
      <PopularCourses />
      <HowItWorks />
      <Features />
      <AssistantCTA />
      <CTA />
    </>
  )
}
