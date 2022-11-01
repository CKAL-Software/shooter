export function getRandomInt(min: number, max: number, rng?: () => number) {
  const randomNumber = rng ? rng() : Math.random();
  return Math.floor(randomNumber * (max + 1 - min) + min);
}
