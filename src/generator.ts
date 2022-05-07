function interval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function generateRandomCode() {
  return Math.floor((interval(1, 99999999999999)))
}
