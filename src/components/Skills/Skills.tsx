import React from 'react'

const Skills: React.FC = () => {
  return (
    <div className="section" id="skill">
      <div className="container">
        <div className="h4 text-center mb-4 title">Skills</div>
        <div className="card" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="progress-container progress-primary">
                  <span className="progress-badge">Java 11</span>
                  <div className="progress">
                    <div 
                      className="progress-bar bg-skills" 
                      data-aos="progress-full" 
                      data-aos-duration="2000" 
                      data-aos-offset="10"
                      role="progressbar"
                      style={{width: '90%'}}
                    ></div>
                    <span className="progress-value">90%</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="progress-container progress-primary">
                  <span className="progress-badge">Spring Framework</span>
                  <div className="progress">
                    <div 
                      className="progress-bar bg-skills" 
                      data-aos="progress-full" 
                      data-aos-duration="2000" 
                      data-aos-offset="10"
                      role="progressbar"
                      style={{width: '80%'}}
                    ></div>
                    <span className="progress-value">80%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="progress-container progress-primary">
                  <span className="progress-badge">Data Structure & Algorithms</span>
                  <div className="progress">
                    <div 
                      className="progress-bar bg-skills" 
                      data-aos="progress-full" 
                      data-aos-duration="2000" 
                      data-aos-offset="10"
                      role="progressbar"
                      style={{width: '85%'}}
                    ></div>
                    <span className="progress-value">90%</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="progress-container progress-primary">
                  <span className="progress-badge">Databases</span>
                  <div className="progress">
                    <div 
                      className="progress-bar bg-skills"
                      data-aos="progress-full" 
                      data-aos-duration="2000" 
                      data-aos-offset="10" 
                      role="progressbar"
                      style={{width: '80%'}}
                    ></div>
                    <span className="progress-value">85%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="progress-container progress-primary">
                  <span className="progress-badge">Backend Web Development</span>
                  <div className="progress">
                    <div 
                      className="progress-bar bg-skills" 
                      data-aos="progress-full" 
                      data-aos-duration="2000" 
                      data-aos-offset="10"
                      role="progressbar"
                      style={{width: '80%'}}
                    ></div>
                    <span className="progress-value">80%</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="progress-container progress-primary">
                  <span className="progress-badge">Concurrency</span>
                  <div className="progress">
                    <div 
                      className="progress-bar bg-skills" 
                      data-aos="progress-full" 
                      data-aos-duration="2000" 
                      data-aos-offset="10"
                      role="progressbar"
                      style={{width: '75%'}}
                    ></div>
                    <span className="progress-value">90%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="progress-container progress-primary">
                  <span className="progress-badge">Microservices</span>
                  <div className="progress">
                    <div 
                      className="progress-bar bg-skills" 
                      data-aos="progress-full" 
                      data-aos-duration="2000" 
                      data-aos-offset="10"
                      role="progressbar"
                      style={{width: '75%'}}
                    ></div>
                    <span className="progress-value">90%</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="progress-container progress-primary">
                  <span className="progress-badge">Messaging Queues</span>
                  <div className="progress">
                    <div 
                      className="progress-bar bg-skills" 
                      data-aos="progress-full" 
                      data-aos-duration="2000" 
                      data-aos-offset="10"
                      role="progressbar"
                      style={{width: '80%'}}
                    ></div>
                    <span className="progress-value">85%</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="progress-container progress-primary">
                  <span className="progress-badge">AWS</span>
                  <div className="progress">
                    <div 
                      className="progress-bar bg-skills" 
                      data-aos="progress-full" 
                      data-aos-duration="2000" 
                      data-aos-offset="10"
                      role="progressbar"
                      style={{width: '80%'}}
                    ></div>
                    <span className="progress-value">85%</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="progress-container progress-primary">
                  <span className="progress-badge">Redis</span>
                  <div className="progress">
                    <div 
                      className="progress-bar bg-skills" 
                      data-aos="progress-full" 
                      data-aos-duration="2000" 
                      data-aos-offset="10"
                      role="progressbar"
                      style={{width: '80%'}}
                    ></div>
                    <span className="progress-value">95%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Skills 