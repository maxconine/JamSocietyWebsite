import { useState } from 'react';
import artistsData from '../data/artists';
export default function ArtistDropdown() {
  const [selected, setSelected] = useState<null | typeof artistsData[0]>(null);
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Bands:</h2>
      <ul className="list-disc pl-5 mb-4">
        {artistsData.map(a => (
          <li key={a.id} className="text-gray-200">{a.name}</li>
        ))}
      </ul>
      <label className="block mb-2">Select an artist:</label>
      <select
        className="p-2 bg-gray-800 text-gray-200 rounded mb-4 w-full max-w-sm"
        onChange={e => {
          const artist = artistsData.find(a => a.id === e.target.value) || null;
          setSelected(artist);
        }}
      >
        <option value="">-- Choose an artist --</option>
        {artistsData.map(a => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>
      {selected && (
        <div className="mt-4 p-4 bg-gray-800 rounded">
          <h3 className="text-2xl font-black-ops-one text-red-500">{selected.name}</h3>
          <img src={selected.image} alt={selected.name} className="w-full max-w-sm mt-2 rounded shadow-lg" />
          <p className="mt-2 text-gray-300">{selected.bio}</p>
        </div>
      )}
    </div>
  );
}