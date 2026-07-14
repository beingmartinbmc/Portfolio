/**
 * Shared text utility functions used across components and services.
 */

/**
 * Cleans markdown formatting and special characters from text for speech synthesis.
 */
export function cleanTextForSpeech(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  try {
    return text
      .replace(/\*\*\*(.*?)\*\*\*/g, '$1') // Remove bold italic ***text***
      .replace(/\*\*(.*?)\*\*/g, '$1')     // Remove bold **text**
      .replace(/\*(.*?)\*/g, '$1')         // Remove italic *text*
      .replace(/__(.*?)__/g, '$1')         // Remove bold __text__
      .replace(/_(.*?)_/g, '$1')           // Remove italic _text_
      .replace(/`(.*?)`/g, '$1')           // Remove inline code `text`
      .replace(/```[\s\S]*?```/g, '')      // Remove code blocks
      .replace(/#{1,6}\s*/g, '')           // Remove headers
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Remove images, keep alt text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
      .replace(/[#*`_~()[\]]/g, '')       // Remove remaining markdown chars
      .replace(/\p{Extended_Pictographic}|\uFE0F/gu, '') // Remove emojis
      .replace(/\s+/g, ' ')                // Normalize whitespace
      .trim();
  } catch (error) {
    console.error('Error cleaning text for speech:', error);
    return String(text);
  }
}
