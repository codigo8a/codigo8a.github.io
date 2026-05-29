/**
 * Extracts a date string from markdown content if present in the format "Fecha: DD/MM/YYYY" or "Date: DD/MM/YYYY"
 * @param {string} content 
 * @returns {string} The extracted date or a default date
 */
export const extractDate = (content: string): string => {
  if (!content) return '01/01/2026';
  const match = content.match(/(?:Fecha|Date):\s*(\d{1,2}\/\d{1,2}\/\d{4})/);
  return match ? match[1] : '01/01/2026';
};

/**
 * Removes the date header and any YAML frontmatter from the content for display.
 * Handles both "Fecha:" and "Date:" prefixes, and strips --- blocks after the date.
 * @param {string} content 
 * @returns {string} Clean content ready for markdown rendering
 */
export const extractContentWithoutDate = (content: string): string => {
  if (!content) return '';
  // Remove the date line (Fecha: or Date:)
  let cleaned = content.replace(/^(?:Fecha|Date):\s*\d{1,2}\/\d{1,2}\/\d{4}\n?/gm, '');
  // Remove YAML frontmatter block (--- ... ---) that follows the date line
  cleaned = cleaned.replace(/^---\n[\s\S]*?\n---\n?/, '');
  return cleaned;
};

/**
 * Simple identity function for consistency in hook logic
 * @param {string} content 
 * @returns {string}
 */
export const extractRawContent = (content: string): string => {
  if (!content) return '';
  return content;
};
