export function range(size: number, offset: number = 1) {
  return Array.from({ length: size }, (_, i) => i + offset);
}

export function padCode(code: number) {
  return code.toString().padStart(14, "0");
}