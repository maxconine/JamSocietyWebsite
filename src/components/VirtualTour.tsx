import { useState } from 'react';
interface VirtualTourProps { images: { src: string; alt: string }[]; }
export default function VirtualTour({ images }: VirtualTourProps) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div>
      <h2 className="font-semibold text-xl mb-4">Room Preview</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map(img => (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            className="cursor-pointer rounded shadow-lg"
            onClick={() => setSelected(img.src)}
          />
        ))}
      </div>
      {selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <img src={selected} alt="Full view" className="max-h-full max-w-full" loading="lazy" />
        </div>
      )}
    </div>
  );
}