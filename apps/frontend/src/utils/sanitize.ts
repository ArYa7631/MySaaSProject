// HTML sanitization utility
// This provides a safe way to sanitize HTML content

export const sanitizeHTML = (html: string): string => {
  if (typeof window === 'undefined') {
    // Server-side: return basic escaped HTML
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  try {
    // Client-side: use DOMPurify if available
    const DOMPurify = require('dompurify')
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'div', 'span', 'table',
        'thead', 'tbody', 'tr', 'th', 'td', 'hr'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'style',
        'width', 'height', 'align'
      ],
      ALLOW_DATA_ATTR: false,
    })
  } catch (error) {
    console.warn('DOMPurify not available, using basic sanitization:', error)
    // Fallback: basic sanitization
    return basicSanitize(html)
  }
}

const basicSanitize = (html: string): string => {
  let clean = html
  
  // Remove potentially dangerous tags
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
  clean = clean.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
  clean = clean.replace(/<embed\b[^<]*>/gi, '')
  clean = clean.replace(/<link\b[^<]*>/gi, '')
  clean = clean.replace(/<meta\b[^<]*>/gi, '')
  
  // Remove dangerous attributes
  clean = clean.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
  clean = clean.replace(/\s*javascript\s*:/gi, '')
  clean = clean.replace(/\s*vbscript\s*:/gi, '')
  clean = clean.replace(/\s*data\s*:/gi, '')
  
  return clean
}
