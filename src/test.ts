import { generateRandomMap, getSeededRandomGenerator } from "./lib/functions";
import { getRandomInt } from "./lib/utils";

const r = getSeededRandomGenerator(getRandomInt(0, 100));

for (let i = 0; i < 5; i++) {
  generateRandomMap({
    position: { x: 0, y: 0 },
    rng: r,
    numStructures: 3,
    teleporters: { up: { size: 1 }, right: { size: 2 }, down: { size: 3 }, left: { size: 4 } },
  });
}
