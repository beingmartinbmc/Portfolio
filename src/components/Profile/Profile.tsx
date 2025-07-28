import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import Intro from '../Intro/Intro'
import About from '../About/About'
import Skills from '../Skills/Skills'
import Experience from '../Experience/Experience'
import Publications from '../Publications/Publications'
import Education from '../Education/Education'
import Contact from '../Contact/Contact'
import Footer from '../Footer/Footer'
import { ClipLoader } from 'react-spinners'

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'rgba(255,255,255,0.3)'
      }}>
        <ClipLoader color="#033d5b" size={50} />
      </div>
    )
  }

  return (
    <div className="profile-page">
      <Header />
      <div className="page-header page-header-small" filter-color="orange">
        <div className="page-header-image" data-parallax="true" style={{backgroundImage: "url('/src/assets/images/ankit.jpg')"}}></div>
        <div className="container">
          <div className="content-center">
            <Intro />
          </div>
        </div>
      </div>
      <div className="section">
        <div className="container">
          <About />
          <Skills />
          <Experience />
          <Publications />
          <Education />
          <Contact />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Profile 