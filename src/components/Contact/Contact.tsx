import React, { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'

interface FormData {
  name: string
  subject: string
  email: string
  message: string
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    subject: '',
    email: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await axios.post('https://formspree.io/f/mbjpqzgz', {
        name: formData.name,
        subject: formData.subject,
        replyto: formData.email,
        message: formData.message
      })
      
      if (response.status === 200) {
        toast.success('Message sent successfully!')
        setFormData({
          name: '',
          subject: '',
          email: '',
          message: ''
        })
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    }
  }

  return (
    <div className="section" id="contact">
      <div className="cc-contact-information">
        <div className="container">
          <div className="cc-contact">
            <div className="row">
              <div className="col-md-9">
                <div className="card mb-0" data-aos="zoom-in">
                  <div className="h4 text-center title">Contact Me</div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card-body">
                        <form onSubmit={handleSubmit}>
                          <div className="p pb-3">
                            <strong>Feel free to contact me </strong>
                          </div>
                          <div className="row mb-3">
                            <div className="col">
                              <div className="input-group">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="name"
                                  placeholder="Name"
                                  value={formData.name}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col">
                              <div className="input-container">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="subject"
                                  placeholder="Subject"
                                  value={formData.subject}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col">
                              <div className="input-group">
                                <input
                                  type="email"
                                  className="form-control"
                                  name="email"
                                  placeholder="E-mail"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col">
                              <div className="form-group">
                                <textarea
                                  className="form-control"
                                  name="message"
                                  placeholder="Your Message"
                                  value={formData.message}
                                  onChange={handleInputChange}
                                  required
                                ></textarea>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col">
                              <button
                                className="btn bg-primary"
                                style={{fontWeight: 'bold', color: 'blanchedalmond'}}
                                type="submit"
                              >
                                Send
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card-body">
                        <p className="mb-0">
                          <strong>Email</strong>
                        </p>
                        <p>ankit.sharma199803@gmail.com</p>
                        <p style={{marginTop: '40px'}}>
                          <a href="https://info.flagcounter.com/hZ3l">
                            <img
                              src="https://s04.flagcounter.com/count2/hZ3l/bg_FFFFFF/txt_000000/border_CCCCCC/columns_2/maxflags_10/viewers_0/labels_1/pageviews_1/flags_0/percent_0/"
                              alt="Flag Counter"
                              border="0"
                            />
                          </a>
                        </p>
                      </div>
                    </div>
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

export default Contact 