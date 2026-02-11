import React, { useState, useRef, useCallback } from 'react';
import PosterCanvas from './components/PosterCanvas';
import Sidebar from './components/Sidebar';
import { PosterConfig } from './types';
import { toJpeg } from 'html-to-image';

// Placeholder image for the "Hand holding chart" concept
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop";

/**
 * Fetches the Google Font CSS and converts all font URLs to base64 data URIs.
 * html-to-image's built-in getFontEmbedCSS may not capture <link>-loaded Google Fonts,
 * so we manually fetch, parse, and embed them.
 */
const getEmbeddedFontCSS = async (): Promise<string> => {
  try {
    const fontUrl = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap';

    const response = await fetch(fontUrl);
    if (!response.ok) return '';

    let cssText = await response.text();

    // Find all url() references and replace them with base64 data URIs
    const urlRegex = /url\((https?:\/\/[^\)]+)\)/g;
    const matches = [...cssText.matchAll(urlRegex)];
    const uniqueUrls = [...new Set(matches.map(m => m[1]))];

    // Fetch each font file and convert to base64
    await Promise.all(uniqueUrls.map(async (url) => {
      try {
        const fontResponse = await fetch(url);
        if (!fontResponse.ok) return;
        const fontBuffer = await fontResponse.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(fontBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
        const mimeType = url.includes('.woff2') ? 'font/woff2' :
          url.includes('.woff') ? 'font/woff' :
            url.includes('.ttf') ? 'font/truetype' : 'font/woff2';
        // Replace all occurrences of this URL
        cssText = cssText.split(`url(${url})`).join(`url(data:${mimeType};base64,${base64})`);
      } catch (e) {
        console.warn('Failed to embed font file:', url, e);
      }
    }));

    return cssText;
  } catch (e) {
    console.warn('Failed to fetch Google Font CSS:', e);
    return '';
  }
};

// Cache the embedded font CSS so we only fetch once
let cachedFontCSS: string | null = null;

function App() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const [config, setConfig] = useState<PosterConfig>({
    headline: "أتعرف كيفية قراءة مؤشرات القوة الشرائية الحقيقية",
    subHeadline: "تعلم التحليل المالي",
    topRightText: "المستثمر",
    topLeftText: "النهضة الاقتصادية العربية",
    website: "al-investor.com",
    pageNumber: "0",
    ctaText: "اسحب الشاشة",
    accentColor: "#2dd4bf", // Teal-400
    secondaryColor: "#0f172a",
    imageUrl: DEFAULT_IMAGE,
    generatedImageBase64: null,
    customCSS: "",
    logoUrl: null
  });

  const handleDownload = useCallback(async () => {
    if (!canvasRef.current || isDownloading) return;
    setIsDownloading(true);

    try {
      const width = 450;
      const height = 600;

      // Embed Google Fonts as base64 data URIs for the export
      if (cachedFontCSS === null) {
        cachedFontCSS = await getEmbeddedFontCSS();
      }

      const dataUrl = await toJpeg(canvasRef.current, {
        cacheBust: true,
        quality: 0.85,       // JPEG quality — great quality, ~200-500KB instead of 12MB
        pixelRatio: 2,       // 2x resolution (900×1200) — sharp enough for social media
        width: width,
        height: height,
        canvasWidth: width * 2,
        canvasHeight: height * 2,
        backgroundColor: config.secondaryColor || '#0a1128',
        fontEmbedCSS: cachedFontCSS || '',
        style: {
          transform: 'none',
          margin: '0',
          width: `${width}px`,
          height: `${height}px`,
          fontFamily: "'IBM Plex Sans Arabic', sans-serif",
        },
      });

      const link = document.createElement('a');
      link.download = 'ai-investor-poster.jpg';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed", err);
      alert("فشل تحميل الصورة. حاول مرة أخرى.");
    } finally {
      setIsDownloading(false);
    }
  }, [config.secondaryColor, isDownloading]);

  return (
    <div className="flex h-screen w-full bg-slate-950 text-white overflow-hidden font-sans" dir="rtl">
      {/* Left Sidebar (Controls) */}
      <Sidebar
        config={config}
        setConfig={setConfig}
        onDownload={handleDownload}
      />

      {/* Main Preview Area */}
      <PosterCanvas config={config} canvasRef={canvasRef} />
    </div>
  );
}

export default App;