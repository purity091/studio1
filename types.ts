export interface PosterConfig {
  headline: string;
  subHeadline: string;
  topRightText: string;
  topLeftText: string;
  website: string;
  pageNumber: string;
  ctaText: string;
  accentColor: string; // The cyan/teal color
  secondaryColor: string; // The darker blue
  imageUrl: string | null;
  generatedImageBase64: string | null;
  customCSS: string;
  logoUrl: string | null;
}

export interface GeneratedContent {
  headline: string;
  subHeadline: string;
  imagePrompt: string;
}

export enum Tab {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  STYLE = 'STYLE',
  AI = 'AI',
  CSS = 'CSS'
}