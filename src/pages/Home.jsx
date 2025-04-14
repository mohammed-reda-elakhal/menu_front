import React, { Suspense } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import LoadingSpinner from '../components/LoadingSpinner'

// Lazy load less important sections
const About = React.lazy(() => import('../components/About'))
const Features = React.lazy(() => import('../components/Features'))
const Pricing = React.lazy(() => import('../components/Pricing'))
const FAQ = React.lazy(() => import('../components/FAQ'))
const Testimonials = React.lazy(() => import('../components/Testimonials'))
const Contact = React.lazy(() => import('../components/Contact'))
const Footer = React.lazy(() => import('../components/Footer'))

function Home() {
  return (
    <div className="bg-secondary1">
      <Header />
      <div> {/* Added padding-top */}
        <Hero />
        <Suspense fallback={<LoadingSpinner />}>
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