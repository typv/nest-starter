/**
 * Converts camelCase string to Title Case with spaces
 * @param str - The camelCase string (e.g., 'GoogleMeet')
 * @returns Title case string with spaces (e.g., 'Google Meet')
 */
export function camelCaseToTitleCase(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (match) => match.toUpperCase())
    .trim();
}
