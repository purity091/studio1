import React from 'react';
import { PosterConfig } from '../types';
import { LogoShape } from './Icons';

interface PosterCanvasProps {
  config: PosterConfig;
  canvasRef?: React.RefObject<HTMLDivElement>;
}

const PosterCanvas: React.FC<PosterCanvasProps> = ({ config, canvasRef }) => {
  const { 
    accentColor, 
    secondaryColor,
    headline, 
    subHeadline, 
    imageUrl, 
    generatedImageBase64,
    topLeftText,
    topRightText,
    website,
    pageNumber,
    customCSS,
    logoUrl
  } = config;

  // Determine which image source to use
  const activeImage = generatedImageBase64 || imageUrl;

  return (
    <div className="flex-1 h-full bg-slate-950 flex items-center justify-center p-8 overflow-auto relative">
      {/* Dynamic Style Tag for Custom CSS */}
      <style dangerouslySetInnerHTML={{ __html: customCSS }} />
      
      {/* Editor Background Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, #334155 1px, transparent 0)',
            backgroundSize: '24px 24px' 
        }}>
      </div>

      <div 
        ref={canvasRef}
        dir="rtl" 
        lang="ar"
        className="poster-root relative w-[450px] h-[600px] shadow-[0_0_60px_-15px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden shrink-0 transition-all duration-300"
        style={{
          backgroundColor: secondaryColor || '#0a1128',
          boxShadow: `0 20px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)`
        }}
      >
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none z-0 mix-blend-overlay">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <filter id="noise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noise)" />
            </svg>
        </div>

        {/* Ambient Glow */}
        <div 
            className="absolute top-[-10%] right-[-10%] w-[60%] h-[40%] rounded-full blur-[80px] opacity-20 pointer-events-none"
            style={{ backgroundColor: accentColor }}
        ></div>

        {/* Background Waves Pattern */}
        <div className="poster-bg absolute inset-0 opacity-10 pointer-events-none z-0">
             <svg width="100%" height="100%">
                <defs>
                    <pattern id="waves" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
                         <path d="M0 10 Q 25 20 50 10 T 100 10" fill="none" stroke="white" strokeWidth="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#waves)" />
             </svg>
        </div>
        
        {/* Top Header Section */}
        <div className="poster-header relative z-10 flex justify-between items-center p-8 shrink-0">
            {/* Right Side: Logo + Brand Name */}
            <div className="flex items-center gap-4">
                <div className="poster-logo-icon bg-white/5 p-1 rounded-lg backdrop-blur-sm border border-white/10 w-[48px] h-[48px] flex items-center justify-center overflow-hidden shrink-0">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <LogoShape color={accentColor} />
                  )}
                </div>
                <div className="flex flex-col items-start gap-1">
                    <span className={`poster-brand-main text-lg font-bold leading-snug`} style={{ color: accentColor }}>
                    {topLeftText.split(' ')[0]} {topLeftText.split(' ')[1]}
                    </span>
                    <span className="poster-brand-sub text-[10px] text-gray-300 border-b border-gray-600 pb-1 pr-6 opacity-80">
                    {topLeftText.split(' ').slice(2).join(' ')}
                    </span>
                </div>
            </div>

            {/* Left Side: Investor Name */}
            <div className="text-left">
                <div className="poster-logo-text text-xl font-bold text-white font-sans leading-none">{topRightText}</div>
                <div className="poster-logo-sub text-[9px] tracking-[0.2em] text-gray-400 font-sans uppercase mt-1">AI-INVESTOR</div>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="poster-body relative z-10 flex-1 flex flex-col items-center justify-center -mt-8 px-6 text-center">
            
            <h1 className="poster-headline text-[38px] font-black text-white leading-normal mb-3 drop-shadow-xl shrink-0">
                {headline}
            </h1>
            
            <h2 className={`poster-subheadline text-xl font-bold mb-8 drop-shadow-md opacity-90 shrink-0`} style={{ color: accentColor }}>
                {subHeadline}
            </h2>

            <div className="poster-image-container relative w-full h-[250px] flex items-center justify-center shrink-0">
                <div 
                  className="poster-accent-blob absolute w-[70%] h-[70%] rounded-full blur-[70px] opacity-25"
                  style={{ backgroundColor: accentColor }}
                ></div>
                
                {activeImage ? (
                    <div 
                        className="poster-image relative z-10 h-full w-full rounded-xl shadow-2xl transition-all duration-500"
                        style={{
                            backgroundImage: `url(${activeImage})`,
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    ></div>
                ) : (
                    <div className="poster-no-image relative z-10 w-64 h-48 bg-white/5 backdrop-blur-sm border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                        No Image Selected
                    </div>
                )}

                <div className={`poster-deco-1 absolute top-0 left-4 text-7xl font-black opacity-20 rotate-[-15deg] select-none`} style={{ color: accentColor }}>?</div>
                <div className={`poster-deco-2 absolute top-[-20px] left-[60px] text-5xl font-black opacity-10 rotate-[10deg] select-none`} style={{ color: accentColor }}>?</div>
            </div>
        </div>

        {/* Footer Section */}
        <div className="poster-footer relative z-10 flex justify-between items-end p-6 w-full bg-gradient-to-t from-black/80 via-black/20 to-transparent shrink-0">
            <div className="flex items-center gap-2">
                <div className={`poster-dot w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]`} style={{ backgroundColor: accentColor, color: accentColor }}></div>
                <span className={`poster-footer-website text-sm font-sans opacity-90`} style={{ color: accentColor }}>
                    {website}
                </span>
            </div>

            <div className={`poster-footer-page text-3xl font-black opacity-40`} style={{ color: accentColor }}>
                {pageNumber}
            </div>
        </div>
      </div>
    </div>
  );
};

export default PosterCanvas;