import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CONTACT_EMAIL = 'jamsociety-leadership-l@g.hmc.edu';
const CHECKOUT_FORM_URL = 'https://forms.gle/VabtTosoY881NGt26';
const MEMBER_FORM_URL = 'https://forms.gle/dziWupCVz6AqfL5t8';
const INCIDENT_FORM_URL = 'https://forms.gle/YWJ5KRMVFjiJ4C1j9';
const BROKEN_FORM_URL = 'https://forms.gle/xRhg6yEiptmP9zi46';
const REQUEST_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScsAlJUFNOsY5gnYLt2TG6a_0abUnA7fTdzbPztlWBgsl_hQA/viewform?usp=sf_link';

const linkClass = 'underline text-jam-blue hover:text-jam-blue-hover';

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
    question: 'How do I check out equipment?',
    answer: (
      <span>
        Checkout is for events only — if you just want to play, the gear is free to use right there in the Jam Spaces. For an event, fill out the <a href={CHECKOUT_FORM_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>Equipment Checkout Form</a> before anything leaves the room. Checkouts are limited to 48 hours, and it&apos;s your responsibility to make sure the equipment is treated respectfully. Contact us if you need a longer-term checkout.
      </span>
    )
  },
  {
    question: 'How can I request a new piece of equipment?',
    answer: (
      <span>
        We love getting equipment requests! Please email us at <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>{CONTACT_EMAIL}</a> or fill out the <a href={REQUEST_FORM_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>New Equipment Request Form</a> on the <Link to="/equipment" className={linkClass}>Equipment</Link> page.
      </span>
    )
  },
  {
    question: 'Can I get swipe/card access to the Jam Room?',
    answer: (
      <span>
        Yes. If you are a Harvey Mudd student, fill out the <a href={MEMBER_FORM_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>new member form</a> on the <Link to="/join" className={linkClass}>Join</Link> page — that form is the room-entry quiz — and we will add you to the swipe access list.
      </span>
    )
  },
  {
    question: 'Something went wrong—how do I report it?',
    answer: (
      <span>
        If you noticed broken gear, missing items, rule violations, or anything that needs attention in the Jam Room, fill out our <a href={INCIDENT_FORM_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>Incident Report Form</a>. Google may ask you to sign in with your HMC account. If you can&apos;t open it, email <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>{CONTACT_EMAIL}</a> instead. For damaged gear, the <a href={BROKEN_FORM_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>Broken Equipment Form</a> on the <Link to="/equipment" className={linkClass}>Equipment</Link> page does not require a special login.
      </span>
    )
  },
  {
    question: 'How do I report missing or unlabeled equipment?',
    answer: (
      <span>
        We do our best to label all equipment, but sometimes things get lost. If something is missing, please let us know at <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>{CONTACT_EMAIL}</a> and we will do our best to replace it. If something is unlabeled, please do not take it out of the room.
      </span>
    )
  },
  {
    question: 'Is [instrument] available for a performance or event?',
    answer: (
      <span>
        Fill out the <a href={CHECKOUT_FORM_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>Equipment Checkout Form</a> with the dates you need it. One exception: the downstairs Jam Room drum kit can&apos;t be checked out — only the upstairs Jam Lounge kit is available. If you&apos;re taking that kit or many items from a Jam Space, also reserve that room on the <Link to="/reserve" className={linkClass}>Reserve</Link> page for the times the equipment will be gone.
      </span>
    )
  },
  {
    question: 'Can Jam Society provide sound equipment for our event (fashion shows, KSPC, ASP, etc.)?',
    answer: (
      <span>
        Yes! Please email <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>{CONTACT_EMAIL}</a> with your event details and we will do our best to help. Equipment can only be checked out directly by Mudders, but if your 5C organization doesn&apos;t have a Mudder to coordinate, contact us and we&apos;ll make special arrangements.
      </span>
    )
  },
  {
    question: 'Does Jam Society have any custom-printed merchandise or apparel?',
    answer: (
      <span>
        Yes! Come to our events to get some cool Jam Society merch!
      </span>
    )
  },
  {
    question: 'Can we host a musical event or workshop in the Jam Room?',
    answer: (
      <span>
        We are happy to host workshops and musical events in the Jam Room. Please email us at <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>{CONTACT_EMAIL}</a> to discuss your needs. We can advertise it on our social media.
      </span>
    )
  },
  {
    question: 'What if there is a room usage conflict?',
    answer: (
      <span>
        We operate on a first-come, first-served basis. If you have a conflict, please email the person who is scheduled to use the room and ask whether they&apos;re willing to change times.
      </span>
    )
  },
  {
    question: 'I left an item in the room and now it is missing. What should I do?',
    answer: (
      <span>
        Email us at <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>{CONTACT_EMAIL}</a> and we will do our best to help you track it down.
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
    <section className="w-full bg-white py-16">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-navy text-[clamp(1.75rem,8vw,3.75rem)] leading-none mb-8">
          Q&amp;A
        </h2>
        <div className="border-t border-hairline">
          {faqs.map((faq, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <div key={faq.question} className="border-b border-hairline">
                <button
                  className="w-full flex justify-between items-center gap-4 py-4 min-h-11 text-left jam-focus-ring group"
                  onClick={() => toggleIndex(idx)}
                  aria-expanded={isOpen}
                >
                  <span className="min-w-0 text-base md:text-xl font-roboto text-ink group-hover:text-jam-blue transition-colors">
                    {faq.question}
                  </span>
                  <span
                    className="font-display text-2xl text-jam-blue shrink-0 transition-transform duration-200"
                    style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-4 pr-8 text-copy text-base font-roboto max-w-3xl">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
