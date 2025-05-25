import React, { useState } from 'react';

const faqs = [
  {
    question: 'Can students from other 5Cs get swipe access to the room?',
    answer: (
      <span>
        No, students from other 5Cs cannot get swipe access to the room. Unfortunately, F&amp;M cannot give out swipe access to the room to students from outside Mudd.
      </span>
    )
  },
  {
    question: 'How can I request a new piece of equipment?',
    answer: (
      <span>
        We love getting equipment requests! Please email us at <a href="mailto:jamsociety-leadership-l@g.hmc.edu" className="underline text-blue-600 hover:text-blue-800">jamsociety-leadership-l@g.hmc.edu</a> or fill out our equipment request form linked here: <a href="https://docs.google.com/forms/d/e/1FAIpQLScsAlJUFNOsY5gnYLt2TG6a_0abUnA7fTdzbPztlWBgsl_hQA/viewform?usp=sf_link" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-blue-800">Equipment Request Form</a>.
      </span>
    )
  },
  {
    question: 'Can I get swipe/card access to the Jam Room?',
    answer: (
      <span>
        Yes, if you are a Harvey Mudd student, you can fill out the membership form: https://forms.gle/oy9483FkZGwEBc1u7 and we will add you to the swipe access list. In addition, you will be able to login to this website once registered as a member.
      </span>
    )
  },
  {
    question: 'Something went wrong—how do I report it?',
    answer: (
      <span>
        If you noticed broken gear, missing items, rule violations, or anything that needs attention in the Jam Room, please fill out our <a href="https://forms.gle/YWJ5KRMVFjiJ4C1j9" target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-blue-800">Incident Report Form</a>.
      </span>
    )
  },
  {
    question: 'How do I report missing or unlabeled equipment?',
    answer: (
      <span>
        We do our best to label all equipment, but sometimes things get lost. If something is missing, please let us know at <a href="mailto:jamsociety-leadership-l@g.hmc.edu" className="underline text-blue-600 hover:text-blue-800">jamsociety-leadership-l@g.hmc.edu</a> and we will do our best to replace it. If something is unlabeled please do not try to check it out of the room.
      </span>
    )
  },
  {
    question: 'Is [instrument] available for a performance or event?',
    answer: (
      <span>
        You can use the Reserve button on the equipment page to reserve the instrument for your event. If you need to cancel, you can do so by clicking the "Cancel Reservation" button.
      </span>
    )
  },
  {
    question: 'Can Jam Society provide sound equipment for our event (fashion shows, KSPC, ASP, etc.)?',
    answer: (
      <span>
        Yes! Please email <a href="mailto:jamsociety-leadership-l@g.hmc.edu" className="underline text-blue-600 hover:text-blue-800">jamsociety-leadership-l@g.hmc.edu</a> with your event details and we will do our best to help.
      </span>
    )
  },
  {
    question: 'Does Jam Society have any custom-printed merchandise or apparel?',
        answer: (
      <span>
'We are working on it! If you are interested in designing any merchandise, please email us at <a href="mailto:jamsociety-leadership-l@g.hmc.edu" className="underline text-blue-600 hover:text-blue-800">jamsociety-leadership-l@g.hmc.edu</a> and we will do our best to help you.
  </span>
        )
  },
  {
    question: 'Can we host a musical event or workshop in the Jam Room?',
    answer: (
        <span>
   'We are happy to host workshops and musical events in the Jam Room. Please email us at <a href="mailto:jamsociety-leadership-l@g.hmc.edu" className="underline text-blue-600 hover:text-blue-800">jamsociety-leadership-l@g.hmc.edu</a> to discuss your needs. We can advertise it on our social media.'
   </span>
        )
  },
  {
    question: 'What if there is a room usage conflict?',
    answer: (
        <span>We operate on a first-come, first-served basis. If you have a conflict, please email the person who is scheduled to use the room and let them know if they are willing to change times'
  </span>
    )
  },
  {
    question: 'I left an item in the room and now it is missing. What should I do?',
    answer: (
        <span>You can email all the members in the club at <a href="mailto:jamsociety-leadership-l@g.hmc.edu" className="underline text-blue-600 hover:text-blue-800">jamsociety-leadership-l@g.hmc.edu</a> or us at <a href="mailto:jamsociety-leadership-l@g.hmc.edu" className="underline text-blue-600 hover:text-blue-800">jamsociety-leadership-l@g.hmc.edu</a> and we will do our best to help you.
  </span>
    )
  },

];

const FAQSection: React.FC = () => {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section className="w-full bg-white py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-5xl font-roboto font-medium mb-6">Questions &amp; Answers</h2>
        <div className="divide-y divide-gray-200">
          {faqs.map((faq, idx) => (
            <div key={faq.question}>
              <button
                className="w-full flex justify-between items-center py-3 text-left focus:outline-none"
                onClick={() => toggleIndex(idx)}
                aria-expanded={openIndices.includes(idx)}
              >
                <span className="text-xl font-roboto font-normal">{faq.question}</span>
                <span className="text-2xl font-bold transition-transform duration-200" style={{ transform: openIndices.includes(idx) ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndices.includes(idx) ? 'max-h-40' : 'max-h-0'}`}
                style={{
                  transitionProperty: 'max-height',
                }}
              >
                <div className={`pl-1 pb-2 text-gray-500 text-base font-roboto font-normal ${openIndices.includes(idx) ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                  style={{
                    transitionProperty: 'opacity',
                  }}
                >
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection; 