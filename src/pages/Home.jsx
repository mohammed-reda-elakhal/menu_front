import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import About from '../components/About'
import Features from '../components/Features'
import Pricing from '../components/Pricing'
import FAQ from '../components/FAQ'
import Testimonials from '../components/Testimonials'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

function Home() {
  return (
    <div className="bg-secondary1">
        <Header/>  
        <Hero/> 
        <About/>
        <Features/>
        <Pricing/>
        <FAQ/>
        <Testimonials/>
        <Contact/>
        <Footer/>
    </div>
  )
}

export default Home