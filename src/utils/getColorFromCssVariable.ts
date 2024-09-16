export function getColorFromCssVariable(cssVariable: string): string {
  return `hsl(${getComputedStyle(document.documentElement).getPropertyValue(
    cssVariable,
  )})`;
}
