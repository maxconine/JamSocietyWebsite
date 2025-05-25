import React from 'react';
import GuideGrid from '../components/GuideGrid';

const guides = [
    {
        id: 'mic1',
        title: 'How To use a Microphone',
        description: 'Guide to using a dynamic mic. Manuals for the SM57 and SM58 are included in the dropdown.',
        image: '/equipment-images/processed/shureSM58_P.webp',
        details: 'Here are the manuals for the SM57 and SM58. The SM57 is the better mic for singing and the SM58 is better for instruments.',
        manualUrl: 'https://docs.google.com/document/d/138RKmVXsEuQjblL9vGtHngH64iduepRtpboIVa57uX8/edit?usp=sharing',
        extraManualUrl: '/SM57-user-guide.pdf',
        extraManualLabel: 'SM57 Manual',
        additionalButtons: [
            {
                label: 'SM58 Manual',
                url: '/SM58-user-guide.pdf'
            }
        ]
    },
    {
        id: 'mixer1',
        title: 'How To use a Mixer',
        description: 'Guide to using a mixer. Please just watch those videos, they are very helpful.',
        image: 'guide-images/mixWizard-WZ3-16-2.webp',
        details: 'This guide will walk you through the essential features of the mixer, including channel controls, effects, and proper gain staging. Perfect for both beginners and those looking to refresh their knowledge.',
        manualUrl: 'https://docs.google.com/document/d/1FfQD29hu4TG-uWih7Vyt5K9HdT0H8H4igcFrYIv40L4/edit?usp=sharing',
        videoUrl: 'https://youtu.be/3nhk0CD_NKg?feature=shared',
        extraVideoUrl: 'https://www.youtube.com/watch?v=d__3qrr3USI'
    },
    {
        id: 'drum-kit-etiquette',
        title: 'Drum Kit Etiquette and Setup',
        description: 'Guide to drum kit etiquette and setup. If you just want to know how to set up a drum kit, there is a wikihow guide in the dropdown.',
        image: '/equipment-images/processed/drum-kit_P.webp',
        details: 'If you just want to know how to set up a drum kit, here is a wikihow guide.',
        manualUrl: 'https://docs.google.com/document/d/12ooI-9FL_kujaxe_3paOUbXdJUO0EdY3qjX6hyCS-sM/edit?usp=sharing',
        additionalButtons: [
            {
                label: 'wikiHow Guide',
                url: 'https://www.wikihow.com/Set-Up-a-Drum-Kit'
            }
        ]
    },
    {
        id: 'amp-setup',
        title: 'How to Set Up and Use an Amp',
        description: 'Master the basics of amplifier setup, operation, and proper usage for the best sound quality.',
        image: 'guide-images/spiderV240.jpg',
        details: 'Complete guide to amplifier operation',
        manualUrl: 'https://docs.google.com/document/d/1fmGQyQ8WJtdFmPpoohm7zYA6Sf9qDTqKaRujj4QISc4/edit?usp=sharing'
    },
    {
        id: 'speaker-usage',
        title: 'Playing Music on the Speakers',
        description: 'Learn how to properly connect and play music from the iMac or another device to the PA speakers.',
        image: 'guide-images/speakers.jpg',
        details: '',
        manualUrl: 'https://docs.google.com/document/d/1gomFywUZpqV8PxLsCOt4DBn1JrZXA8YN27o3XVKh82k/edit?usp=sharing'
    },
    {
        id: 'pedal-effects',
        title: 'Basic Pedal Effects for Beginners',
        description: 'Learn how to setup and use a pedal. Also learn what each pedal is used for',
        image: 'equipment-images/processed/superChorusPedal_P.webp',
        details: 'Guide to basic audio effects',
        manualUrl: 'https://docs.google.com/document/d/1bEWHerT1ALDXNbxRy-1SAmsgzpF5P5HVQMFmuN7C1qY/edit?usp=sharing'
    },
    {
        id: 'jam-ideas',
        title: 'Quick Jam Ideas to Try With Friends',
        description: 'Jam session ideas to get started with your band or friends. Guide contains 3 and 4 cord progressions and a list of songs to play.',
        image: 'equipment-images/processed/jamIdeas_P.webp',
        details: 'You are so cool for reading this. Thanks for checking out the Jam Room!',
        manualUrl: 'https://docs.google.com/document/d/12qJ0BzxhnwvPhEvXamj3sS8H4B25PMqE82nAk_Hy8TI/edit?usp=sharing'
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
                    backgroundImage: 'url(/equipment-images/processed/Guides_P.webp)',
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
                            This page is filled with resources to teach you how to use equipment in the Jam Room. Each guide has instructions, video tutorials, and links to equipment manuals. This page is a work in progress. If you want to <span className="font-bold">help build this page</span> email me at <a href="mailto:mconine@g.hmc.edu">mconine@g.hmc.edu</a> and I can help you get you started. I'll also make it so anyone can edit these documents so feel free to fill them in.
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