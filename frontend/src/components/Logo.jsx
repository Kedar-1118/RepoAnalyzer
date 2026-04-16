import React from 'react';

const Logo = ({ className = "", size = 40, textClass = "text-2xl" }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <svg 
                width={size} 
                height={size} 
                viewBox="0 0 48 48" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg" 
                className="drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
            >
                <defs>
                    <linearGradient id="pulseGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00f2fe" />
                        <stop offset="50%" stopColor="#4facfe" />
                        <stop offset="100%" stopColor="#e0c3fc" />
                    </linearGradient>
                </defs>
                <circle cx="24" cy="24" r="21" stroke="url(#pulseGradient)" strokeWidth="2.5" />
                <path 
                    d="M2.5 24 L14 24 L17 18 L22 34 L27 12 L31 28 L34 24 L45.5 24" 
                    stroke="url(#pulseGradient)" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                />
            </svg>
            <span className={`font-headline font-semibold tracking-tight text-white flex items-center ${textClass}`}>
                Open<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-[#e0c3fc]">Pulse</span>
            </span>
        </div>
    );
};

export default Logo;
