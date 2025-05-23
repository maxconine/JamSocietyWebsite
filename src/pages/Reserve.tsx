// src/pages/Reserve.tsx
export default function Reserve() {
  return (
    <div className="bg-white min-h-screen px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4 font-roboto text-center">Reserve the Jam Room</h1>
      <p className="mb-4 font-roboto text-left max-w-3xl mx-auto space-y-4">
        The Jam Room operates on a <span className="font-bold">first-come, first-served basis</span> unless reserved. <br />
        <br />
        This feature was added to help organize the bands that want to practice to minimize waiting outside the room while another band is practicing.<br />
        <br />
        <span className="font-bold">To reserve the room, go to</span> <a href="https://jamsoc.youcanbook.me" className="text-red-500 underline" target="_blank" rel="noopener noreferrer">https://jamsoc.youcanbook.me</a> to make a reservation.<br />
        <br />
        Please note: Reservations must be made at least 3 days in advance.
      </p>
      <div className="w-full max-w-[800px] h-[600px] md:max-w-[1000px] md:h-[800px] lg:max-w-[1200px] lg:h-[900px] mx-auto mb-8">
        <iframe
          src="https://calendar.google.com/calendar/embed?src=jamsocky%40gmail.com&ctz=America%2FNew_York&mode=WEEK&showTitle=0&showNav=1&showPrint=0&showTabs=1&showCalendars=0&showTz=0"
          className="w-full h-full border-0 rounded shadow-lg"
          frameBorder="0"
          scrolling="no"
          title="Jam Room Calendar"
        ></iframe>
      </div>
      <p className="font-roboto text-center max-w-3xl mx-auto">
        After booking, you'll receive a confirmation email with your reservation details.
      </p>
    </div>
  );
}
