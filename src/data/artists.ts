interface Artist {
  id: string;
  name: string;
  bio: string;
  image: string;
  contact: string;
}

const artists: Artist[] = [
  {
    id: 'artist1',
    name: 'Artist One',
    bio: 'Bio of artist one.',
    image: '/images/artist1.jpg',
    contact: 'artist1@example.com'
  },
  // add more artists here
];

export default artists;