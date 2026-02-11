import { GeneratedContent } from "../types";

export const generatePosterContent = async (topic: string): Promise<GeneratedContent> => {
  try {
    const response = await fetch('/api/generate-content', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate content');
    }

    const data = await response.json();
    return data as GeneratedContent;

  } catch (error) {
    console.error("Text Gen Error:", error);
    throw error;
  }
};

export const generatePosterImage = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('/api/generate-image', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate image');
    }

    const data = await response.json();
    return data.base64;

  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};