import React from 'react';
import { Link } from 'react-router-dom';
import { AmpIcon, DrumsIcon, GuitarIcon, KeysIcon, NoteIcon, SharpIcon } from '../components/Icons';
import PageHero from '../components/PageHero';

const CHECKOUT_FORM_URL = 'https://forms.gle/VabtTosoY881NGt26';
const BROKEN_FORM_URL = 'https://forms.gle/xRhg6yEiptmP9zi46';
const REQUEST_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScsAlJUFNOsY5gnYLt2TG6a_0abUnA7fTdzbPztlWBgsl_hQA/viewform?usp=sf_link';
const CONTACT_EMAIL = 'jamsociety-leadership-l@g.hmc.edu';

const guidelines = [
  <>
    <span className="font-semibold">Fill out the form first.</span> Do not take equipment out of the
    Jam Spaces without filling it out. If it isn&apos;t on the form, it shouldn&apos;t leave the room.
  </>,
  <>
    <span className="font-semibold">48 hours, max.</span> You may not check out equipment for longer
    than 48 hours. Contact us if you&apos;d like to arrange a longer-term checkout.
  </>,
  <>
    <span className="font-semibold">It&apos;s on you.</span> It is your responsibility, as the person
    checking out the equipment, to make sure the equipment is treated respectfully and comes back the
    way it left.
  </>,
  <>
    <span className="font-semibold">Reserve the room too.</span> If you are checking out the upstairs
    drum set and/or many items from a Jam Space, you must also{' '}
    <Link to="/reserve" className="text-jam-blue hover:text-jam-blue-hover underline">
      reserve that room
    </Link>{' '}
    for the times the equipment will be gone.
  </>,
];

const itemCodes = [
  { code: 'AMP', label: 'amps and speakers' },
  { code: 'AUD', label: 'mixers, effect pedals' },
  { code: 'CBL', label: 'microphone cables, instrument cables, speakon cables, etc.' },
  { code: 'DRM', label: 'drums, drum stands, kick pedals, cowbells, drum accessories' },
  { code: 'INS', label: 'instruments besides drums' },
  { code: 'MIC', label: 'microphones' },
  { code: 'PWR', label: 'power cords, power strips, extension cords' },
  { code: 'STN', label: 'microphone stands, keyboard stands, etc.' },
];

const Equipment: React.FC = () => {
  return (
    <div className="min-h-screen font-roboto">
      <PageHero image="/Equipment.jpeg" title="EQUIPMENT" />

      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* What's in the rooms, and the fact that you don't need to check it out to play */}
          <section className="pt-12 md:pt-16">
            <div className="border-l-4 border-jam-blue pl-4 sm:pl-6 mb-8">
              <div className="flex items-start gap-3 sm:gap-5">
                <GuitarIcon className="w-9 h-9 sm:w-12 sm:h-12 shrink-0 text-jam-blue mt-1" />
                <p className="text-base sm:text-lg text-copy max-w-3xl min-w-0">
                  Our Jam Spaces are stocked with drum sets, electric and acoustic guitars, bass
                  guitars, keyboards, microphones, speakers, mixers, and more — all free for members to
                  play in the rooms. Just show up and use it. You only need to check something out if
                  you&apos;re taking it somewhere else.
                </p>
              </div>
            </div>
            <p className="text-copy max-w-3xl">
              New to a piece of gear? The{' '}
              <Link to="/equipment-guides" className="text-jam-blue hover:text-jam-blue-hover underline">
                Guides
              </Link>{' '}
              page walks you through the mics, mixers, amps, and drum kit before you touch anything
              expensive.
            </p>
          </section>

          {/* Checkout: guidelines first, then the form */}
          <section className="mt-14 md:mt-20">
            <h2 className="font-display text-navy text-[clamp(1.75rem,8vw,3.75rem)] leading-none mb-6">
              CHECKOUT
            </h2>

            <div className="jam-callout mb-10">
              <p className="text-base md:text-lg">
                <span className="font-semibold">Checkout is for events only.</span> Jam Society members
                can check equipment out of the Jam Spaces for performances, shows, and other events
                involving Mudders. If you just want to play, come use the gear in the rooms instead —
                that&apos;s what it&apos;s there for.
              </p>
            </div>

            <h3 className="font-display text-navy text-2xl sm:text-3xl leading-none mb-4">
              GUIDELINES
            </h3>
            <ol className="border-t border-hairline mb-10">
              {guidelines.map((rule, index) => (
                <li
                  key={index}
                  className="grid grid-cols-[40px_1fr] sm:grid-cols-[56px_1fr] md:grid-cols-[72px_1fr] gap-3 sm:gap-4 items-start py-5 border-b border-hairline"
                >
                  <span className="font-display text-jam-blue text-4xl md:text-5xl leading-none">
                    {index + 1}
                  </span>
                  <p className="text-copy pt-1">{rule}</p>
                </li>
              ))}
            </ol>

            {/* The drum kit rule people get wrong */}
            <div className="jam-callout mb-10">
              <div className="flex items-start gap-3 sm:gap-4">
                <DrumsIcon className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 text-jam-blue mt-1" />
                <div className="min-w-0">
                  <h3 className="font-display text-xl md:text-2xl text-navy mb-2">DRUM KITS</h3>
                  <p className="text-base md:text-lg">
                    The drum kit downstairs in the <span className="font-semibold">Jam Room</span>{' '}
                    (Platt Basement) <span className="font-semibold">cannot be checked out</span> — it
                    stays where it is. Only the upstairs kit in the{' '}
                    <span className="font-semibold">Jam Lounge</span> is available for checkout.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-base md:text-lg text-copy max-w-3xl mb-10">
              Although we support the use of our equipment for events around the 5Cs, equipment can only
              be checked out directly by Mudders through this form. If you are a 5C organization looking
              to reserve equipment but do not have a Mudder to coordinate, we still want to help! Please
              contact us to make special arrangements for your checkout.
            </p>

            {/* The form, after the guidelines */}
            <div className="border-t border-hairline pt-8">
              <a
                href={CHECKOUT_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="jam-btn jam-btn-primary jam-btn-lg"
              >
                Equipment Checkout Form
                <span aria-hidden="true">→</span>
              </a>
              <p className="text-sm text-muted mt-3">
                Opens in a new tab. Questions, or need a longer checkout? Email{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-jam-blue hover:text-jam-blue-hover underline break-all"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
          </section>

          {/* Reporting damage */}
          <section className="mt-14 md:mt-20">
            <h2 className="font-display text-navy text-[clamp(1.5rem,7vw,3rem)] leading-none mb-4">
              BROKEN GEAR
            </h2>
            <p className="text-copy max-w-3xl mb-5">
              If something breaks during normal use, it&apos;s okay — just tell us. You won&apos;t get in
              trouble for reporting it, and we can&apos;t fix what we don&apos;t know about. Report it
              with the form below and we&apos;ll take care of it.
            </p>
            <a
              href={BROKEN_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="jam-btn jam-btn-secondary"
            >
              Broken Equipment Form
            </a>
          </section>

          <section className="mt-14 md:mt-20">
            <h2 className="font-display text-navy text-[clamp(1.5rem,7vw,3rem)] leading-none mb-4">
              NEW REQUESTS
            </h2>
            <p className="text-copy max-w-3xl mb-5">
              If you think a Jam Space could use a specific new piece of equipment, tell us. Fill out
              the request form or email{' '}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-jam-blue hover:text-jam-blue-hover underline break-all"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
            <a
              href={REQUEST_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="jam-btn jam-btn-secondary"
            >
              New Equipment Request Form
            </a>
          </section>

          {/* Item code system */}
          <section className="mt-14 md:mt-20 pb-16 md:pb-24">
            <h2 className="font-display text-navy text-[clamp(1.5rem,7vw,3rem)] leading-none mb-4">
              ITEM CODES
            </h2>
            <p className="text-copy max-w-3xl mb-8">
              Everything we own has an item code: a 3-letter category plus a 2-digit number, on a
              laminated tag or a sticker. You&apos;ll need it on the checkout form. If a piece of gear
              doesn&apos;t have a Jam Society label on it, it isn&apos;t ours — please leave it alone.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-t border-hairline">
              {itemCodes.map(item => (
                <div key={item.code} className="border-r border-b border-hairline bg-mist p-5">
                  <p className="font-display text-2xl text-jam-blue leading-none mb-2">{item.code}</p>
                  <p className="text-sm text-copy">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-6 text-navy">
              <NoteIcon className="w-8 h-8" />
              <DrumsIcon className="w-8 h-8" />
              <AmpIcon className="w-8 h-8" />
              <KeysIcon className="w-8 h-8" />
              <SharpIcon className="w-8 h-8" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Equipment;
