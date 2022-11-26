import { CANVAS_COLUMNS, CANVAS_ROWS, MAP_SIZE } from "../Definitions/Maps";
import { MapInfo, MapSide, Point, Teleporters } from "./definitions";
import { OBSTACLES, SHOP_GEN_PROBABILITY, TP_GEN_PROBABILITY, TP_SIZE_MAX, TP_SIZE_MIN } from "./definitions.mapgen";
import { flipCoords } from "./functions";
import { getRandomInt } from "./utils";

export function generateRandomMap(config: {
  maps: Map<string, MapInfo>;
  position: Point;
  rng: () => number;
  numStructures: number;
}): MapInfo {
  const mapLayout = Array.from(new Array(CANVAS_ROWS)).map(() => Array.from(new Array(CANVAS_COLUMNS)).map(() => " "));

  const isHome = config.position.x === 0 && config.position.y === 0;
  const homeTpStartPosition = Math.round(MAP_SIZE / 2 - 2);
  const teleporters: Teleporters = isHome
    ? {
        up: { size: 4, startPosition: homeTpStartPosition },
        down: { size: 4, startPosition: homeTpStartPosition },
        left: { size: 4, startPosition: homeTpStartPosition },
        right: { size: 4, startPosition: homeTpStartPosition },
      }
    : getTeleporters(config.maps, config.position, config.rng);

  addTeleportersToMap(mapLayout, teleporters);
  addObstaclesToMap(mapLayout, config.numStructures, config.rng);
  let hasShop = false;
  if (isHome || config.rng() < SHOP_GEN_PROBABILITY) {
    addShopToMap(mapLayout, config.rng);
    hasShop = true;
  }

  return { position: config.position, layout: mapLayout, teleporters, hasShop };
}

function addShopToMap(mapLayout: string[][], rng: () => number) {
  const shop = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ];

  while (true) {
    const row = getRandomInt(0, MAP_SIZE - 1, rng);
    const col = getRandomInt(0, MAP_SIZE - 1, rng);

    let canPlace = true;
    for (const [preX, preY] of shop) {
      const [x, y] = flipCoords(preX, preY, false, false);
      if (!mapLayout[row + y] || mapLayout[row + y][col + x] !== " ") {
        canPlace = false;
        break;
      }
    }

    if (canPlace) {
      for (const [preX, preY] of shop) {
        const [x, y] = flipCoords(preX, preY, false, false);
        mapLayout[row + y][col + x] = "s";
      }
      break;
    }
  }
}

function addObstaclesToMap(mapLayout: string[][], numStructures: number, rng: () => number) {
  for (let i = 0; i < numStructures; i++) {
    const structure = OBSTACLES[getRandomInt(0, OBSTACLES.length - 1, rng)];
    const flipOne = getRandomInt(0, 1, rng) === 0;
    const flipTwo = getRandomInt(0, 1, rng) === 0;
    for (let tries = 0; tries < 5; tries++) {
      const row = getRandomInt(0, MAP_SIZE - 1, rng);
      const col = getRandomInt(0, MAP_SIZE - 1, rng);

      let canPlace = true;
      for (const [preX, preY] of structure) {
        const [x, y] = flipCoords(preX, preY, flipOne, flipTwo);
        if (!mapLayout[row + y] || mapLayout[row + y][col + x] !== " ") {
          canPlace = false;
          break;
        }
      }

      if (canPlace) {
        for (const [preX, preY] of structure) {
          const [x, y] = flipCoords(preX, preY, flipOne, flipTwo);
          mapLayout[row + y][col + x] = "x";
        }
        break;
      }
    }
  }
}

function addTeleportersToMap(map: string[][], teleporters: Teleporters) {
  Object.entries(teleporters).forEach(([side, { size, startPosition }]) => {
    let horizontal = true;
    let fixedCoordinate = 0;

    if (side === "up") {
      horizontal = true;
      fixedCoordinate = 0;
    } else if (side === "right") {
      horizontal = false;
      fixedCoordinate = CANVAS_COLUMNS - 1;
    } else if (side === "down") {
      horizontal = true;
      fixedCoordinate = CANVAS_ROWS - 1;
    } else {
      horizontal = false;
      fixedCoordinate = 0;
    }

    for (let i = startPosition; i < startPosition + size; i++) {
      map[horizontal ? fixedCoordinate : i][horizontal ? i : fixedCoordinate] = "~";
    }
  });
}

export function getPredefinedTeleporters(maps: Map<string, MapInfo>, newMapPosition: Point): Teleporters {
  const mapAbove = maps.get(posToKey({ x: newMapPosition.x, y: newMapPosition.y - 1 }));
  const mapBelow = maps.get(posToKey({ x: newMapPosition.x, y: newMapPosition.y + 1 }));
  const mapToTheLeft = maps.get(posToKey({ x: newMapPosition.x - 1, y: newMapPosition.y }));
  const mapToTheRight = maps.get(posToKey({ x: newMapPosition.x + 1, y: newMapPosition.y }));

  const predefinedTeleporters: Teleporters = {};

  if (mapAbove) predefinedTeleporters["up"] = mapAbove.teleporters["down"];
  if (mapBelow) predefinedTeleporters["down"] = mapBelow.teleporters["up"];
  if (mapToTheLeft) predefinedTeleporters["left"] = mapToTheLeft.teleporters["right"];
  if (mapToTheRight) predefinedTeleporters["right"] = mapToTheRight.teleporters["left"];

  return predefinedTeleporters;
}

function getTeleporters(maps: Map<string, MapInfo>, position: Point, rng: () => number) {
  const teleporters = getPredefinedTeleporters(maps, position);

  const mapSides: MapSide[] = ["up", "down", "left", "right"];

  mapSides.forEach((side) => {
    if (!teleporters[side] && rng() < TP_GEN_PROBABILITY) {
      const size = getRandomInt(TP_SIZE_MIN, TP_SIZE_MAX, rng);
      const startPosition = Math.floor(rng() * (MAP_SIZE - 2 - size)) + 1;
      teleporters[side] = { size, startPosition };
    }
  });

  return teleporters;
}

export function posToKey(position: Point) {
  return position.x + "," + position.y;
}
