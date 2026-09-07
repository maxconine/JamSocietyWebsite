import React from 'react';
import { ClefIcon, NoteIcon } from '../components/Icons';

const MEMBER_FORM_URL = 'https://forms.gle/dziWupCVz6AqfL5t8';
const CHECKOUT_FORM_URL = 'https://forms.gle/VabtTosoY881NGt26';

const rules = [
  <>Please only practice outside of F&amp;M Hours, which are 8:00 am to 5:00 pm Monday–Friday.</>,
  <>
    Play the gear in the rooms as much as you like. If you need to take equipment out of a Jam Space
    for an event,{' '}
    <span className="font-semibold">you must fill out the{' '}
      <a
        href={CHECKOUT_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="text-jam-blue hover:text-jam-blue-hover underline"
      >
        equipment checkout form
      </a>{' '}
      first
    </span>
    . Checkouts are for events only and are limited to 48 hours.
  </>,
  <>Please respect &quot;Do Not Use&quot; signs. Some members store their instruments in the room which are not open to public use.</>,
  <>Please leave food and drinks (besides water) <span className="font-semibold">outside</span> the room.</>,
  <>
    Please <span className="font-semibold">turn everything off</span> and{' '}
    <span className="font-semibold">wrap up cables</span> you used before leaving the room. Leave the
    room cleaner than you found it.
  </>,
];

const Join: React.FC = () => {
  return (
    <div className="min-h-screen bg-white py-12 font-roboto">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative jam-staff pt-6 pb-10 mb-10">
          <ClefIcon className="hidden md:block absolute -left-2 top-4 w-16 h-16 text-jam-blue" />
          <div className="md:pl-20">
            <h1 className="font-display text-navy text-[clamp(2.25rem,12vw,6rem)] leading-none">
              JOIN
            </h1>
            <p className="mt-5 text-lg text-copy max-w-2xl">
              To join the Jam Society,{' '}
              <strong>
                fill out the{' '}
                <a
                  href={MEMBER_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-jam-blue hover:text-jam-blue-hover underline"
                >
                  new member form
                </a>
              </strong>
              .
            </p>
          </div>
        </div>

        {/* Join CTA */}
        <div className="mb-16">
          <a
            href={MEMBER_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="jam-btn jam-btn-primary jam-btn-lg"
          >
            Join Now — New Member Form
            <span aria-hidden="true">→</span>
          </a>
          <p className="text-sm text-muted mt-3">Opens in a new tab. Completing it is how you get swipe access.</p>
        </div>

        <section className="mb-16">
          <h2 className="font-display text-navy text-[clamp(1.75rem,8vw,3.75rem)] leading-none mb-6">
            SWIPE ACCESS
          </h2>
          <div className="jam-callout mb-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <NoteIcon className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 text-jam-blue mt-1" />
              <div className="min-w-0">
                <p className="text-base md:text-lg">
                  <span className="font-semibold">Harvey Mudd students</span> get 24/7 swipe access to
                  the Jam Room after filling out the new member form. That form is the room-entry
                  quiz — complete it and we&apos;ll add you to the swipe list. Students from other 5Cs
                  cannot get swipe access; F&amp;M cannot issue it outside Mudd.
                </p>
              </div>
            </div>
          </div>
          <a
            href={MEMBER_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="jam-btn jam-btn-secondary"
          >
            Room Entry Quiz — New Member Form
          </a>
        </section>

        {/* Rules */}
        <section className="mb-16">
            <h2 className="font-display text-navy text-[clamp(1.75rem,8vw,3.75rem)] leading-none mb-6">
              RULES
            </h2>
            <ol className="border-t border-hairline">
            {rules.map((rule, index) => (
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
        </section>

        {/* Stay in the loop */}
        <section className="jam-panel p-6 md:p-8">
          <h2 className="font-roboto font-semibold text-xl md:text-2xl text-ink mb-3">
            Don&apos;t forget the rest
          </h2>
          <p className="text-copy">
            Join the{' '}
            <a
              href="https://discord.gg/33ERv9rMmZ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-jam-blue hover:text-jam-blue-hover underline"
            >
              Discord
            </a>{' '}
            and the{' '}
            <a
              href="https://groups.google.com/a/g.hmc.edu/g/jamsociety-l"
              target="_blank"
              rel="noopener noreferrer"
              className="text-jam-blue hover:text-jam-blue-hover underline"
            >
              mailing list
            </a>
            . And follow us on Instagram{' '}
            <a
              href="https://www.instagram.com/hmcjamsoc/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-jam-blue hover:text-jam-blue-hover underline"
            >
              @hmcjamsoc
            </a>
            . Happy jamming!
          </p>
        </section>
      </div>
    </div>
  );
};

export default Join;
