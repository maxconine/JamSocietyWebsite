import React, { useEffect, useState } from 'react';
import logo from '../assets/Jam-Soc-Logo.svg';

const LoadingScreen: React.FC = () => {
    const [showContent, setShowContent] = useState(false);
    const [key, setKey] = useState(0);

    useEffect(() => {
        // Reset the key on mount to force animation restart
        setKey(prev => prev + 1);

        // Show the content after 2 seconds
        const timer = setTimeout(() => {
            setShowContent(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (showContent) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
            <div className="relative" key={key}>
                {/* Logo container */}
                <div className="relative w-[min(90vw,50rem)] h-[min(90vw,50rem)]">
                    {/* Glowing effect */}
                    <div className="absolute inset-0 animate-pulse-smooth">
                        <div className="absolute inset-0 bg-red-500 opacity-10 blur-[100px]">
                            <img src={logo} alt="JamSociety Logo" className="w-full h-full" />
                        </div>
                    </div>

                    {/* Logo */}
                    <div className="relative z-10 flex items-center justify-center w-full h-full">
                        <img
                            src={logo}
                            alt="JamSociety Logo"
                            className="w-full h-full drop-shadow-[0_0_25px_rgba(239,68,68,0.3)]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen; 