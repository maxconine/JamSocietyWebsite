// src/pages/Reserve.tsx
export default function Reserve() {
  return (
    <div className="bg-white min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-4 font-roboto text-center">Reserve the Jam Room</h1>
      <p className="mb-4 font-roboto">
        The Jam Room operates on a first-come, first-served basis unless reserved. <br />
        This feature was added to help organize the bands that want to practice to minimize waiting outside the room while another band is practicing.<br />
        To reserve the room, go to <a href="https://jamsoc.youcanbook.me" className="text-red-500 underline" target="_blank" rel="noopener noreferrer">https://jamsoc.youcanbook.me</a> to make a reservation.<br />
        Please note: Reservations must be made at least 3 days in advance.
      </p>
      <div className="w-[800px] h-[600px] mx-auto mb-8">
        <iframe
          src="https://calendar.google.com/calendar/embed?src=jamsocky%40gmail.com&ctz=America%2FNew_York"
          className="w-full h-full border-0 rounded"
          frameBorder="0"
          scrolling="no"
          title="Jam Room Calendar"
        ></iframe>
      </div>
      <p className="font-roboto">
        After booking, you'll receive a confirmation email with your reservation details.
      </p>
    </div>
  );
}
