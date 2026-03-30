import React from 'react';
import { PosterConfig } from '../types';
import { LogoShape } from './Icons';
import './PosterCanvas.css';

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
    brandSubText,
    topRightText,
    website,
    pageNumber,
    customCSS,
    logoUrl
  } = config;

  // Determine which image source to use
  const activeImage = generatedImageBase64 || imageUrl;

  return (
    <div className="poster-wrapper">
      {/* Dynamic Style Tag for Custom CSS */}
      <style dangerouslySetInnerHTML={{ __html: customCSS }} />

      {/* Editor Background Pattern */}
      <div className="poster-editor-pattern"></div>

      <div
        ref={canvasRef}
        dir="rtl"
        lang="ar"
        className="poster-canvas"
        style={{
          backgroundColor: secondaryColor || '#0a1128',
          boxShadow: `0 25px 80px -20px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.1)`
        }}
      >
        {/* Premium Noise Texture */}
        <div className="poster-noise-texture">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>

        {/* Ambient Glows */}
        <div
          className="poster-ambient-glow-top"
          style={{ backgroundColor: accentColor }}
        ></div>
        <div
          className="poster-ambient-glow-bottom"
          style={{ backgroundColor: accentColor }}
        ></div>

        {/* Background Waves Pattern */}
        <div className="poster-background-waves">
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
        <div className="poster-header">
          {/* Right Side: Logo + Brand Name */}
          <div className="poster-header-right">
            <div className="poster-logo-icon">
              {(logoUrl || '/logos/alinvestor white.svg') ? (
                <img src={logoUrl || '/logos/alinvestor white.svg'} alt="Logo" className="poster-logo-image" />
              ) : (
                <LogoShape color={accentColor} />
              )}
            </div>
            <div className="poster-brand-container">
              <span className="poster-brand-main" style={{ color: accentColor }}>
                {topLeftText}
              </span>
              <span className="poster-brand-sub">
                {brandSubText}
              </span>
            </div>
          </div>

          {/* Left Side: Investor Name */}
          <div className="poster-header-left">
            <div className="poster-investor-name">{topRightText}</div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="poster-main-content">

          <h1 className="poster-headline">
            {headline}
          </h1>

          <h2 className="poster-subheadline" style={{ color: accentColor }}>
            {subHeadline}
          </h2>

          <div className="poster-image-container">
            <div
              className="poster-accent-blob"
              style={{ backgroundColor: accentColor }}
            ></div>

            {activeImage ? (
              <div
                className="poster-main-image"
                style={{
                  backgroundImage: `url(${activeImage})`
                }}
              ></div>
            ) : (
              <div className="poster-no-image-placeholder">
                No Image Selected
              </div>
            )}

            <div className="poster-decoration-1" style={{ color: accentColor }}>?</div>
            <div className="poster-decoration-2" style={{ color: accentColor }}>?</div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="poster-footer">
          <div className="poster-footer-left">
            <div className="poster-footer-dot" style={{ backgroundColor: accentColor, color: accentColor }}></div>
            <span className="poster-footer-website" style={{ color: accentColor }}>
              {website}
            </span>
          </div>

          <div className="poster-footer-page" style={{ color: accentColor }}>
            {pageNumber}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterCanvas;