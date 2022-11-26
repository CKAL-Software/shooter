import { getSeededRandomGenerator } from "./lib/functions";
import { generateRandomMap } from "./lib/MapGenerator";
import { getRandomInt } from "./lib/utils";

const r = getSeededRandomGenerator(getRandomInt(0, 100));

for (let i = 0; i < 5; i++) {
  generateRandomMap({
    maps: new Map(),
    position: { x: 0, y: 0 },
    rng: r,
    numStructures: 3,
  });
}
