export default function GoogleCalendar() {
    return (
      <div className="mt-4">
        <iframe
          src="your-google-calendar-embed-url"
          className="w-full h-[600px] border-0 rounded"
          allowFullScreen
        ></iframe>
      </div>
    );
  }