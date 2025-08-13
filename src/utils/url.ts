/**
 * URL sanitization utilities for external links and media
 */

// Trusted video domains
const TRUSTED_VIDEO_DOMAINS = [
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'vimeo.com',
  'www.vimeo.com',
  'player.vimeo.com'
];

/**
 * Ensures an external URL is safe by validating protocol and format
 */
export const ensureSafeExternalUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return '#';
    }
    
    return url;
  } catch {
    // Invalid URL format
    return '#';
  }
};

/**
 * Validates and sanitizes video URLs from trusted domains
 */
export const getTrustedVideoUrl = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    
    // Check if domain is in our whitelist
    const isAllowedDomain = TRUSTED_VIDEO_DOMAINS.some(domain => 
      parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`)
    );
    
    if (!isAllowedDomain) {
      console.warn(`Video URL from untrusted domain blocked: ${parsedUrl.hostname}`);
      return null;
    }
    
    // Only allow https for video content
    if (parsedUrl.protocol !== 'https:') {
      console.warn(`Video URL must use HTTPS: ${url}`);
      return null;
    }
    
    return url;
  } catch {
    console.warn(`Invalid video URL format: ${url}`);
    return null;
  }
};