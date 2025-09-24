export type CategoryColor = "primary" | "secondary" | "accent";

// Simple string hash
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

export function getCategoryColor(key: string): CategoryColor {
  const colors: CategoryColor[] = ["primary", "secondary", "accent"];
  const idx = hashString(key) % colors.length;
  return colors[idx];
}
