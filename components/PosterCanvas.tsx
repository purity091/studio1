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
        className="poster-root relative w-[450px] h-[600px] shadow-2xl flex flex-col overflow-hidden shrink-0 transition-all duration-300"
        style={{
          backgroundColor: secondaryColor || '#0a1128',
          boxShadow: `0 25px 80px -20px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.1)`
        }}
      >
        {/* Premium Noise Texture */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 mix-blend-screen">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>

        {/* Ambient Glows */}
        <div
          className="absolute top-[-10%] right-[-15%] w-[70%] h-[50%] rounded-[100%] blur-[90px] opacity-[0.15] pointer-events-none mix-blend-screen"
          style={{ backgroundColor: accentColor }}
        ></div>
        <div
          className="absolute bottom-[-10%] left-[-15%] w-[60%] h-[50%] rounded-[100%] blur-[90px] opacity-[0.1] pointer-events-none mix-blend-screen z-0"
          style={{ backgroundColor: accentColor }}
        ></div>

        {/* Background Waves Pattern */}
        <div className="poster-bg absolute inset-0 opacity-10 pointer-events-none z-0">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="waves" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
                <path d="M0 10 Q 25 20 50 10 T 100 10" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#waves)" />
          </svg>
        </div>

        {/* Top Header Section */}
        <div className="poster-header relative z-10 flex justify-between items-center px-6 py-6 shrink-0">
          {/* Right Side: Logo + Brand Name */}
          <div className="flex items-center gap-2">
            <div className="poster-logo-icon bg-white/5 p-1 rounded-lg backdrop-blur-sm border border-white/10 w-[36px] h-[36px] flex items-center justify-center overflow-hidden shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <LogoShape color={accentColor} />
              )}
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <span className={`poster-brand-main text-[13px] font-bold leading-none mt-0.5`} style={{ color: accentColor }}>
                {topLeftText.split(' ')[0]} {topLeftText.split(' ')[1]}
              </span>
              <span className="poster-brand-sub text-[9px] text-gray-400 border-b border-gray-600/50 pb-1 pr-4 opacity-90 leading-none mt-0.5">
                {topLeftText.split(' ').slice(2).join(' ')}
              </span>
            </div>
          </div>

          {/* Left Side: Investor Name */}
          <div className="text-left mt-0.5">
            <div className="poster-logo-text text-[15px] font-black text-white font-sans leading-none tracking-wider uppercase opacity-90">{topRightText}</div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="poster-body relative z-10 flex-1 flex flex-col items-center justify-center -mt-8 px-6 text-center">

          <h1 className="poster-headline text-[48px] font-black text-white mb-3 shrink-0"
            style={{ lineHeight: '1.1', textShadow: '0 4px 25px rgba(0,0,0,0.7)' }}>
            {headline}
          </h1>

          <h2 className={`poster-subheadline text-[15px] font-semibold mb-6 shrink-0 opacity-90 max-w-[85%] leading-snug`}
            style={{ color: accentColor, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            {subHeadline}
          </h2>

          <div className="poster-image-container relative w-full h-[250px] flex items-center justify-center shrink-0">
            <div
              className="poster-accent-blob absolute w-[70%] h-[70%] rounded-full blur-[80px] opacity-[0.35] mix-blend-screen"
              style={{ backgroundColor: accentColor }}
            ></div>

            {activeImage ? (
              <div
                className="poster-image relative z-10 h-full w-full rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 transition-all duration-500"
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
        <div className="poster-footer relative z-10 flex justify-between items-end px-6 pb-6 pt-12 w-full bg-gradient-to-t from-black/80 via-black/20 to-transparent shrink-0">
          <div className="flex items-center gap-2 mb-0.5">
            <div className={`poster-dot w-1 h-1 rounded-full shadow-[0_0_6px_currentColor]`} style={{ backgroundColor: accentColor, color: accentColor }}></div>
            <span className={`poster-footer-website text-[9px] font-medium font-sans opacity-70 tracking-widest uppercase`} style={{ color: accentColor }}>
              {website}
            </span>
          </div>

          <div className={`poster-footer-page text-sm font-black opacity-30 tracking-tight leading-none`} style={{ color: accentColor }}>
            {pageNumber}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterCanvas;