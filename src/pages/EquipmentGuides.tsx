import React from 'react';
import GuideGrid from '../components/GuideGrid';

const guides = [
    {
        id: 'mic1',
        title: 'How To use a Microphone',
        description: 'Learn the basics of microphone usage and proper technique',
        image: 'guide-images/sureSM58.png',
        details: 'This comprehensive guide covers everything from microphone placement to proper handling techniques. Learn about different types of microphones, their applications, and how to get the best sound quality in various situations.',
        manualUrl: 'https://docs.google.com/document/d/11tbgTuPSa9pvSVhvUmHxB_ExPH34xONR5haw2bY5Tvg/edit?usp=sharing',
    },
    {
        id: 'mixer1',
        title: 'How To use a Mixer',
        description: 'This guide will walk you through how to use the mixer in the Jam Room',
        image: 'guide-images/mixWizard-WZ3-16-2.webp',
        details: 'This guide will walk you through the essential features of the mixer, including channel controls, effects, and proper gain staging. Perfect for both beginners and those looking to refresh their knowledge.',
        manualUrl: 'https://docs.google.com/document/d/your-doc-id-2',
        videoUrl: 'https://youtu.be/3nhk0CD_NKg?feature=shared',
        extraVideoUrl: 'https://www.youtube.com/watch?v=d__3qrr3USI'
    },
    {
        id: 'drum-kit-etiquette',
        title: 'Drum Kit Etiquette and Setup',
        description: 'Learn proper drum kit handling, setup procedures, and etiquette to ensure a great experience for everyone.',
        image: 'guide-images/drum-kit.jpeg',
        details: 'Essential guide for drummers of all levels',
        manualUrl: '/manuals/drum-kit-setup.pdf'
    },
    {
        id: 'amp-setup',
        title: 'How to Set Up and Use an Amp',
        description: 'Master the basics of amplifier setup, operation, and proper usage for the best sound quality.',
        image: 'guide-images/amp-setup.jpg',
        details: 'Complete guide to amplifier operation',
        manualUrl: '/manuals/amp-setup.pdf'
    },
    {
        id: 'speaker-usage',
        title: 'Playing Music on the Speakers',
        description: 'Learn how to properly connect and play music through the studio speakers.',
        image: 'guide-images/speakers.jpg',
        details: 'Guide to studio speaker operation',
        manualUrl: '/manuals/speaker-usage.pdf'
    },
    {
        id: 'audio-interface',
        title: 'Connecting to the Audio Interface or Mixer',
        description: 'Step-by-step guide to connecting instruments and microphones to the audio interface or mixer.',
        image: 'guide-images/audio-interface.jpg',
        details: 'Complete guide to audio interface setup',
        manualUrl: '/manuals/audio-interface.pdf'
    },
    {
        id: 'jam-room-reservation',
        title: 'Reserving the Jam Room',
        description: 'Learn how to properly reserve and use the jam room facilities.',
        image: 'guide-images/jam-room.jpg',
        details: 'Guide to jam room reservation and usage',
        manualUrl: '/manuals/jam-room.pdf'
    },
    {
        id: 'jam-room-etiquette',
        title: 'Jam Room Do\'s and Don\'ts',
        description: 'Essential guidelines for maintaining a positive and productive jam room environment.',
        image: 'guide-images/jam-room-etiquette.jpg',
        details: 'Essential guidelines for jam room usage',
        manualUrl: '/manuals/jam-room-etiquette.pdf'
    },
    {
        id: 'audio-effects',
        title: 'Basic Audio Effects for Beginners',
        description: 'Introduction to common audio effects and how to use them effectively.',
        image: 'guide-images/audio-effects.jpg',
        details: 'Guide to basic audio effects',
        manualUrl: '/manuals/audio-effects.pdf'
    },
    {
        id: 'jam-ideas',
        title: 'Quick Jam Ideas to Try With Friends',
        description: 'Fun and easy jam session ideas to get started with your band or friends.',
        image: 'guide-images/jam-ideas.jpg',
        details: 'Creative ideas for jam sessions',
        manualUrl: '/manuals/jam-ideas.pdf'
    }
];

const EquipmentGuides: React.FC = () => {
    return (
        <div className="min-h-screen font-roboto">
            {/* Hero Section */}
            <section
                style={{
                    width: '100vw',
                    height: '400px',
                    backgroundImage: 'url(/Guides.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
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
                    <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center px-2">
                        Equipment Guides
                    </h1>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-8xl mx-auto px-4">
                <div className="bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <p className="font-roboto font-light text-gray-700 mt-8 mb-8">
                            This page is filled with resources to teach you how to use equipment in the Jam Room. Each guide includes detailed instructions, video tutorials, and links to official manuals.
                        </p>
                    </div>
                </div>

                <div className="mt-8">
                    <GuideGrid guides={guides} />
                </div>
            </div>
        </div>
    );
};

export default EquipmentGuides; 