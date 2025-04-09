import React, { Suspense } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import LoadingSpinner from '../components/LoadingSpinner'
import SEO from '../components/SEO'
import StructuredData from '../components/StructuredData'

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
      <SEO
        title="Meniwi - Digital Menu Platform | Create Interactive Restaurant Menus"
        description="Transform your restaurant's menu into an interactive digital experience. Create, manage, and share your menu instantly with QR codes."
        url="https://meniwi.com"
      />
      <StructuredData
        type="WebSite"
        data={{
          name: "Meniwi - Digital Menu Platform",
          url: "https://meniwi.com"
        }}
      />
      <StructuredData
        type="Organization"
        data={{
          name: "Meniwi",
          url: "https://meniwi.com",
          logo: "https://meniwi.com/src/assets/menu.png"
        }}
      />
      <StructuredData
        type="SoftwareApplication"
        data={{
          name: "Meniwi - Digital Menu Platform",
          description: "Create, manage, and share your restaurant menu instantly with QR codes."
        }}
      />
      <Header />
      <div className="pt-20"> {/* Added padding-top */}
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