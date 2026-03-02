import React from 'react';

const PeerTutoring: React.FC = () => {
  return (
    <div className="min-h-screen font-roboto">
      {/* Hero Section */}
      <section
        style={{
          width: '100vw',
          height: '400px',
          backgroundImage: 'url(/peer_tutoring_cover.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: '0% 30%',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          zIndex: 1,
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          marginTop: -32,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            zIndex: 2,
          }}
        >
          <h1
            className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center px-2"
          >
            Peer Tutoring
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Peer Instrument Tutoring Program</h2>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
              <p className="text-lg text-gray-800 mb-4">
                Hey Jammers!
              </p>
              <p className="text-lg text-gray-800 mb-4">
                We are starting a new program for peer instrument tutoring where we match Mudd volunteer music tutors to other Mudders looking to learn/develop skills in a particular instrument. We are currently looking to teach the drums, keyboard, guitar, and bass (open to others if there is demand!). Please fill out this form if you are interested in either being a tutor or learner as part of this program!</p>
            </div>

            {/* Embedded Sign Up Spreadsheet */}
            <div className="mb-10">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Current Peer Tutoring Sign Ups</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <iframe
                  src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQ0sx2d1VjHsqRNV3CFx71himL_fLMAh8Nv0aBpyW877Pt22ZK3fmrz8EP1q9xfVXvuc9eZIoCLYz2Z/pubhtml?widget=true&headers=false"
                  title="Peer Tutoring Sign Up Spreadsheet"
                  className="w-full"
                  style={{ height: '600px', border: '0' }}
                />
              </div>
            </div>

            {/* Tutor Application Form */}
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mb-10">
              <h3 className="text-2xl font-semibold mb-4 text-yellow-900">Interested in Being a Tutor?</h3>
              <p className="text-gray-800 mb-4">
                If you&apos;d like to volunteer as a peer tutor for the program, please fill out the tutor application form so we can learn more about your interests and experience.
              </p>
              <div className="text-center">
                <a
                  href="https://forms.gle/ECzhYHNghsgwZZnG6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                >
                  Tutor Application Form
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* For Tutors */}
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-xl font-semibold mb-4 text-green-800">For Potential Tutors</h3>
                <p className="text-gray-700 mb-4">
                  This is a great opportunity to give back to the Mudd community, spread your musical knowledge, and learn how to be a great mentor! Currently this is a volunteer position, but we may have funding to pay tutors in the near future.
                </p>
              </div>

              {/* For Learners */}
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-xl font-semibold mb-4 text-purple-800">For Music Learners</h3>
                <p className="text-gray-700 mb-4">
                  This is a great chance to learn an instrument or build on some skills you already have without any cost to you! Lessons will be flexibly scheduled around you and conveniently located in the Jam Room (Platt Basement) or upstairs in one of the practice rooms.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Questions or Feedback?</h3>
              <p className="text-gray-700 mb-4">
                Any feedback/questions? Email us and/or join the discord <a href="https://discord.gg/33ERv9rMmZ" target="_blank" rel="noopener noreferrer">(https://discord.gg/2Xy5XpHr9B)</a>!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="mailto:mabuchanan@g.hmc.edu" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  mabuchanan@g.hmc.edu
                </a>
                <a 
                  href="mailto:mconine@g.hmc.edu" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  mconine@g.hmc.edu
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeerTutoring;
