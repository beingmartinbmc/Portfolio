import React from 'react'

const About: React.FC = () => {
  return (
    <div className="section" id="about">
      <div className="container">
        <div className="card" data-aos="fade-up" data-aos-offset="10">
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className="card-body">
                <div className="h4 mt-0 title">About Me</div>
                <p align="justify">
                  An Energetic and Ambitious Person who has developed a mature and responsible outlook to solve any task
                  I undertake
                </p>
                <p align="justify">
                  Being an Engineer graduate and a Software Developer, I'm excellent in working with
                  others to achieve an objective on time 
                </p>
                <p align="justify">
                  I try to learn as much as I can each day to become even a better coder, programmer, and a
                  human
                </p>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="card-body">
                <div className="h4 mt-0 title">Basic Information</div>
                <div className="row">
                  <div className="col-sm-4">
                    <strong className="text-uppercase">Date of Birth:</strong>
                  </div>
                  <div className="col-sm-8">March 19, 1998</div>
                </div>
                <div className="row mt-4">
                  <div className="col-sm-4">
                    <strong className="text-uppercase">Email:</strong>
                  </div>
                  <div className="col-sm-8">ankit.sharma199803@gmail.com</div>
                </div>
                <div className="row mt-4">
                  <div className="col-sm-4">
                    <strong className="text-uppercase">Location:</strong>
                  </div>
                  <div className="col-sm-8">Uttar Pradesh, India</div>
                </div>
                <div className="row mt-4">
                  <div className="col-sm-4">
                    <strong className="text-uppercase">Language:</strong>
                  </div>
                  <div className="col-sm-8">English, Hindi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About 