// src/pages/Reserve.tsx
import React from 'react';

export default function Reserve() {
  return (
    <div>
      <h1 className="font-black-ops-one text-[35px] mb-4">Reserve Room/Equipment</h1>
      <p className="mb-4">
        The Jam Room operates on a first-come, first-served basis unless reserved.<br />
        To reserve, fill out <a href="https://forms.gle/asdzjbisb" className="text-red-500 underline">this form</a> at least 3 days in advance.<br />
        Confirm availability below:
      </p>
      <div className="w-full aspect-video mb-8">
        <iframe
          src="https://calendar.google.com/calendar/embed?src=655fc91565210e11a6ba9a3d7e5d1136eff9745ddbf22ac88399be2effc1e516%40group.calendar.google.com&ctz=America%2FLos_Angeles"
          className="w-full h-full border-0 rounded"
          frameBorder="0"
          scrolling="no"
          title="Jam Society Reservation Calendar"
        ></iframe>
      </div>
      <p>
        After checking the calendar, ensure your desired slot is free before submitting the form.
      </p>
    </div>
  );
}
