// src/pages/Reserve.tsx
export default function Reserve() {
  return (
    <div className="bg-white min-h-screen px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4 font-roboto text-center">Reserve the Jam Room</h1>
      <p className="mb-4 font-roboto text-left max-w-3xl mx-auto space-y-4">
        The Jam Room operates on a <span className="font-bold">first-come, first-served basis</span> unless reserved. <br />
        <br />
        This feature was added to help organize the bands that want to practice because we are all busy students and don't want to wait outside the room while another band is practicing. It's also helpful if there's a concert coming up and you are going to use Jam Society equipment, to mark when the equipment will be gone from the room on the calendar.<br />
        <br />
        <span className="font-bold">To reserve the room, make a calendar event on your Google Calendar. Name it with your band or band member's names. Then share the event with the email <span className="underline">jamsocky@gmail.com</span>.</span> Your calendar invite will then show up on the calendar below and the room is <span className="underline">'reserved'</span> for your band.<br />
        <br />
        <span className="font-bold">Note: Please only reserve the room for groups larger than 2 in the Jam Room.</span>
        If you'd like to practice individually, you can use the Jam Room, but if a larger group comes, then please use the
        upstairs practice rooms.
      </p>
      <div className="w-full max-w-[800px] h-[600px] md:max-w-[1000px] md:h-[800px] lg:max-w-[1200px] lg:h-[900px] mx-auto mb-8">
        <iframe
          src="https://calendar.google.com/calendar/embed?src=jamsocky%40gmail.com&ctz=America%2FLos_Angeles&mode=WEEK&showTitle=0&showNav=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0"
          className="w-full h-full border-0 rounded shadow-lg"
          frameBorder="0"
          scrolling="no"
          title="Jam Room Calendar"
        ></iframe>
      </div>
      <p className="font-roboto text-center max-w-3xl mx-auto">
        I hope this feature gets used!
      </p>
    </div>
  );
}
