import { useEffect, useState } from 'react';
import { NoteIcon } from '../components/Icons';

const CALENDAR_EMAIL = 'jamsocky@gmail.com';
const CALENDAR_BASE =
  'https://calendar.google.com/calendar/embed?src=jamsocky%40gmail.com&ctz=America%2FLos_Angeles&showTitle=0&showNav=1&showPrint=0&showCalendars=0&showTz=0';

export default function Reserve() {
  const [isNarrow, setIsNarrow] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsNarrow(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const calendarSrc = `${CALENDAR_BASE}&mode=${isNarrow ? 'AGENDA' : 'WEEK'}&showTabs=${isNarrow ? '0' : '1'}`;

  const copyEmail = async () => {
    const markCopied = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    };

    try {
      await navigator.clipboard.writeText(CALENDAR_EMAIL);
      markCopied();
      return;
    } catch {
      // Fall through to execCommand for browsers that block clipboard.writeText.
    }

    const input = document.createElement('textarea');
    input.value = CALENDAR_EMAIL;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    document.body.appendChild(input);
    input.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(input);
    if (ok) markCopied();
  };

  return (
    <div className="bg-white min-h-screen px-4 py-8 font-roboto">
      <div className="max-w-[1120px] mx-auto">
        <div className="jam-staff pt-6 pb-10 mb-10">
          <div className="flex items-start gap-3 sm:gap-5">
            <NoteIcon className="w-9 h-9 sm:w-12 sm:h-12 shrink-0 text-jam-blue mt-2" />
            <h1 className="min-w-0 font-display text-navy text-[clamp(1.75rem,8vw,4.5rem)] leading-none">
              RESERVE THE ROOM
            </h1>
          </div>
        </div>

        <div className="max-w-3xl space-y-5 text-copy">
          <p>
            The Jam Room operates on a <span className="font-semibold">first-come, first-served basis</span>{' '}
            unless reserved.
          </p>
          <p>
            This feature was added to help organize the bands that want to practice, because we are all
            busy students and don&apos;t want to wait outside the room while another band is practicing.
            It&apos;s also helpful if there&apos;s a concert coming up and you are going to use Jam
            Society equipment, to mark when the equipment will be gone from the room on the calendar.
          </p>

          <div className="jam-callout">
            <p className="font-semibold mb-4">To reserve a room:</p>
            <ol className="list-decimal pl-5 space-y-3">
              <li>Create an event on your Google Calendar for the time you need.</li>
              <li>
                Name it with your band or band members&apos; names. If you&apos;re reserving the
                upstairs Jam Lounge, put &quot;Jam Lounge&quot; in the title too.
              </li>
              <li>
                Share the event with{' '}
                <span className="font-semibold break-all">{CALENDAR_EMAIL}</span>.
                <button
                  type="button"
                  onClick={copyEmail}
                  className="jam-btn jam-btn-secondary mt-2 sm:mt-0 sm:ml-3"
                >
                  {copied ? 'Copied' : 'Copy address'}
                </button>
              </li>
              <li>
                When the event appears on the calendar below, the room is reserved. That&apos;s your
                confirmation.
              </li>
            </ol>
          </div>

          <p>
            <span className="font-semibold">
              Note: Please only reserve the Jam Room for groups larger than 2.
            </span>{' '}
            If you&apos;d like to practice individually, you can use the Jam Room, but if a larger group
            comes, please move to the upstairs practice rooms.
          </p>
          <p>
            If you&apos;re checking out the upstairs drum set and/or many items from a Jam Space,
            reserve that room here for the times the equipment will be gone.
          </p>
        </div>

        <div className="w-full h-[70vh] md:h-[800px] lg:h-[900px] mx-auto my-10 border border-hairline overflow-hidden">
          <iframe
            src={calendarSrc}
            className="w-full h-full border-0"
            title="Jam Room Calendar"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
