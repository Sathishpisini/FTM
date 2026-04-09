import { Hero } from "./components/Hero";
import { Testimonials } from "./components/Testimonials";
import { Faq } from "./components/Faq";

import { useTitle } from "../../hooks/UseTitle";
import { use } from "react";
import { Carousel } from "../../components/Elements/Carousel";
import { HomeProductsSections } from "./components/HomeProductsSections";

export const HomePage = () => {
  useTitle("Home Page")
  
  return (
    <main>
        <Carousel />
        <Hero />
        <HomeProductsSections/>
        <Testimonials />
        <Faq />
    </main>
  )
}