import React from 'react'

const Intro: React.FC = () => {
  return (
    <>
      <div className="profile-image">
        <a href="#">
          <img alt="Profile Image" src="/src/assets/images/ankit.jpg"/>
        </a>
      </div>
      <div className="h2 title">Ankit Sharma</div>
      <p className="category text-white">Software Developer</p>
      <a 
        className="btn bg-primary smooth-scroll mr-2" 
        data-aos="zoom-in" 
        data-aos-anchor="data-aos-anchor"
        href="#contact"
      >
        Hire Me
      </a>
      <a 
        className="btn bg-primary smooth-scroll mr-2"
        data-aos="zoom-in" 
        data-aos-anchor="data-aos-anchor"
        href="https://drive.google.com/file/d/1QkKUwjBXfw8MGR2V8z8ryOqA5q6pEfjw/view?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
      >
        Download CV
      </a>
      <div className="button-container">
        <a 
          className="btn btn-default btn-round btn-lg btn-icon"
          href="https://www.linkedin.com/in/ankit-sharma-5b1b35158/" 
          rel="tooltip" 
          target="_blank"
          title="Follow me on Linkedin"
        >
          <img alt="LinkedIn" src="/src/assets/images/linked.png" />
        </a>

        <a 
          className="btn btn-default btn-round btn-lg btn-icon" 
          href="https://github.com/beingmartinbmc"
          rel="tooltip" 
          style={{backgroundColor: 'white'}} 
          target="_blank" 
          title="Fork me on Github"
        >
          <img alt="Github" src="/src/assets/images/github.png" />
        </a>

        <a 
          className="btn btn-default btn-round btn-lg btn-icon"
          href="https://stackoverflow.com/users/7972621/ankit-sharma" 
          rel="tooltip" 
          target="_blank"
          title="Check my answers on Stackoverflow"
        >
          <img alt="Stackoverflow" src="/src/assets/images/stackoverflow.png" />
        </a>
      </div>
    </>
  )
}

export default Intro 