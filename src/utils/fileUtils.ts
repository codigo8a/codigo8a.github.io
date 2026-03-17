/**
 * Extracts a date string from markdown content if present in the format "Fecha: DD/MM/YYYY"
 * @param {string} content 
 * @returns {string} The extracted date or a default date
 */
export const extractDate = (content: string): string => {
  if (!content) return '01/01/2026';
  const match = content.match(/Fecha:\s*(\d{1,2}\/\d{1,2}\/\d{4})/);
  return match ? match[1] : '01/01/2026';
};

/**
 * Removes the "Fecha: ..." line from the beginning of the content for display
 * @param {string} content 
 * @returns {string} Content without the date header
 */
export const extractContentWithoutDate = (content: string): string => {
  if (!content) return '';
  return content.replace(/^Fecha:\s*\d{1,2}\/\d{1,2}\/\d{4}\n?/gm, '');
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
