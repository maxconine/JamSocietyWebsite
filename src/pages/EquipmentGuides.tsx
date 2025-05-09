import React, { useState } from 'react';
import howToUseAMicImage from '../assets/images/equipment/HowToUseAMic.png';

interface EquipmentItem {
    id: string;
    name: string;
    coverImage: string;
    detailImage: string;
    manualUrl: string;
    description: string;
    videoUrl?: string;
}

const equipmentItems: EquipmentItem[] = [
    {
        id: 'mic1',
        name: 'How To use a Microphone',
        coverImage: howToUseAMicImage,
        detailImage: howToUseAMicImage,
        manualUrl: 'https://docs.google.com/document/d/11tbgTuPSa9pvSVhvUmHxB_ExPH34xONR5haw2bY5Tvg/edit?usp=sharing',
        description: 'This guide will teach you how to use a microphone in the Jam Room'
    },
    {
        id: 'mixer1',
        name: 'How To use a Mixer',
        coverImage: '/images/equipment/mg10xu.jpg',
        detailImage: '/images/equipment/mg10xu.jpg',
        manualUrl: 'https://docs.google.com/document/d/your-doc-id-2',
        description: '10-channel mixer with USB interface and effects',
        videoUrl: 'https://youtu.be/3nhk0CD_NKg?feature=shared'
    },
    // Add more equipment items here
];

const EquipmentGuides: React.FC = () => {
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

    const handleCardClick = (item: EquipmentItem) => {
        if (item.videoUrl) {
            setSelectedVideo(item.videoUrl);
        }
    };

    return (
        <div className="min-h-screen bg-white-100 p-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black-ops-one mb-4">Equipment Guides</h1>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    This page is filled with resources to teach you how to use equipment in the Jam Room
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-8xl mx-auto">
                {equipmentItems.map((item) => (
                    <div
                        key={item.id}
                        className="bg-gray-800 rounded-xl overflow-hidden shadow-lg cursor-pointer"
                        onClick={() => handleCardClick(item)}
                    >
                        <div className="flex flex-col md:flex-row">
                            {/* Image Section */}
                            <div className="md:w-1/3">
                                <img
                                    src={item.coverImage}
                                    alt={item.name}
                                    className="w-full h-48 md:h-full object-cover"
                                />
                            </div>

                            {/* Content Section */}
                            <div className="p-6 md:w-2/3 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                                    <p className="text-gray-300 mb-4">{item.description}</p>
                                </div>
                                <a
                                    href={item.manualUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    Open Manual
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Video Modal */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedVideo(null)}
                >
                    <div
                        className="bg-gray-800 rounded-xl p-4 max-w-4xl w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative pb-[56.25%] h-0">
                            <iframe
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                src={selectedVideo.replace('youtu.be', 'youtube.com/embed')}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="mt-4 w-full bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Close Video
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EquipmentGuides; 