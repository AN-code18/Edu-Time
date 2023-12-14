import React from 'react';
import ContactForm from '../components/ContactPage/ContactForm'
import Footer from '../components/common/Footer'
import ContactDetails from '../components/ContactPage/ContactDetails';

const Contact = () => {
  return (
    <div>
      <div className='mx-auto mt-20 w-11/12 max-w-maxContent flex flex-col justify-between gap-10 lg:flex-row'>
        {/**contact details */}
        <div className="lg:w-[40%]">
           <ContactDetails />
        </div>

        {/**contact form */}
        <div className="lg:w-[60%]">
            <ContactForm />
        </div>
      </div>
      <div className='relative mx-auto my-20 flex flex-col w-11/12 max-w-maxContent items-center justify-between bg-richblack-900 text-white gap-8 '>
        {/**Review from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">Reviews from other learners</h1>
        {/**<ReviewSlider /> */}
      </div>
      <Footer />
    </div>
  )
}

export default Contact

