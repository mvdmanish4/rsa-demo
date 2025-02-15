export function getLighterColor(hex: string): string {
  // Remove the hash if it exists
  hex = hex.replace('#', '');
  
  // Convert hex to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Make it lighter by mixing with white
  r = Math.floor(r + (255 - r) * 0.85);
  g = Math.floor(g + (255 - g) * 0.85);
  b = Math.floor(b + (255 - b) * 0.85);
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}