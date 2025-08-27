import React from 'react';

const Join: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 font-roboto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-roboto">Join the Jam Society!</h1>
          <p className="text-lg text-gray-600 font-roboto">
            To join the Jam Society <strong>fill out the <a href="https://forms.gle/dziWupCVz6AqfL5t8" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">new member form</a></strong>.
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 font-roboto">Rules</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 font-medium font-roboto">
                  1
                </span>
              </div>
              <p className="ml-4 text-gray-600 font-roboto">
                Please only practice outside of F&M Hours, which are 8:00 am to 5:00 pm Monday-Friday.
              </p>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 font-medium font-roboto">
                  2
                </span>
              </div>
              <p className="ml-4 text-gray-600 font-roboto">
                If you wish to take equipment out of the Jam Society room, <span className="font-bold">you must check it out through the equipment page</span>. If the equipment does not allow you to check it out then it is meant to be left in the room.
              </p>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 font-medium font-roboto">
                  3
                </span>
              </div>
              <p className="ml-4 text-gray-600 font-roboto">
                Please respect "Do Not Use" signs. Some members store their instruments in the room which are not open to public use.
              </p>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 font-medium font-roboto">
                  4
                </span>
              </div>
              <p className="ml-4 text-gray-600 font-roboto">
                Please leave food and drinks (besides water) <span className="font-bold">outside</span> the room.
              </p>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 font-medium font-roboto">
                  5
                </span>
              </div>
              <p className="ml-4 text-gray-600 font-roboto">
                Please <span className="font-bold">turn everything off</span> and <span className="font-bold">wrap up cables</span> you used before leaving the room. Leave the room cleaner than you found it.
              </p>
            </div>
          </div>
        </div>

        {/* Join Button Section */}
        <div className="text-center">
          <a 
            href="https://forms.gle/dziWupCVz6AqfL5t8" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-md shadow-md hover:shadow-lg transition-all duration-200"
          >
            Join Now - New Member Form
            <span className="ml-2">→</span>
          </a>
          <p className="text-sm text-gray-500 font-roboto mt-3">
            Opens in a new tab
          </p>
        </div>
      </div>
    </div>
  );
};

export default Join; 