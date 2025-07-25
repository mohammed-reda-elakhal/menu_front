import React, { Suspense } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import LoadingSpinner from '../components/LoadingSpinner'
import { useTheme } from '../context/ThemeContext'

// Lazy load less important sections
const About = React.lazy(() => import('../components/About'))
const HowToUSe = React.lazy(() => import('../components/HowToUse'))
const Features = React.lazy(() => import('../components/Features'))
const Pricing = React.lazy(() => import('../components/Pricing'))
const FAQ = React.lazy(() => import('../components/FAQ'))
const Testimonials = React.lazy(() => import('../components/Testimonials'))
const Contact = React.lazy(() => import('../components/Contact'))
const Footer = React.lazy(() => import('../components/Footer'))

function Home() {
  const { darkMode } = useTheme();

  return (
    <div className={`${darkMode ? 'dark bg-secondary1' : 'bg-gray-50'} transition-colors duration-300`}>
      <Header />
      <div className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
        <Hero />
        <Suspense fallback={<LoadingSpinner />}>
          <HowToUSe/>
          <About />
          <Features />
          <Pricing />
          <FAQ />
          <Testimonials />
          <Contact />
          <Footer />
        </Suspense>
      </div>
    </div>
  )
}

export default Home