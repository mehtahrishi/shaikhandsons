/**
 * Generate SEO-friendly slug from text
 * Converts to lowercase, removes special characters, replaces spaces with hyphens
 * @param text - The text to convert to slug
 * @returns SEO-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate vehicle slug from brand and model
 * @param make - Vehicle brand/make
 * @param model - Vehicle model
 * @returns Combined slug like "ather-450x"
 */
export function generateVehicleSlug(make: string, model: string): string {
  return generateSlug(`${make} ${model}`);
}
