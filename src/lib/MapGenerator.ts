import { CANVAS_COLUMNS, CANVAS_ROWS, MAP_SIZE } from "../Definitions/Maps";
import { MapSide, Point } from "./definitions";
import { COLOR_MAP_BACKGROUND, COLOR_SHOP } from "./definitions.colors";
import { OBSTACLES, SHOP_GEN_PROBABILITY, TP_GEN_PROBABILITY, TP_SIZE_MAX, TP_SIZE_MIN } from "./definitions.mapgen";
import { flipCoords } from "./functions";
import { drawTile, pathToPoint, tileCenterToPixels } from "./util.canvas";
import { getRandomInt } from "./utils";

export class RandomMap {
  private position: Point;
  private teleporters: Teleporter[];
  private obstacles: Obstacle[];
  private isTileOccupied: boolean[][] = Array.from(new Array(CANVAS_ROWS)).map(() =>
    Array.from(new Array(CANVAS_COLUMNS)).map(() => false)
  );
  private shop: Shop | undefined;
  private tileStates: Map<string, string>;

  constructor(config: { maps: Map<string, RandomMap>; position: Point; rng: () => number; numStructures: number }) {
    this.position = config.position;

    const isHome = config.position.x === 0 && config.position.y === 0;

    this.teleporters = this.generateTeleporters(isHome, config.maps, config.position, config.rng);
    this.obstacles = this.generateObstacles(config.numStructures, config.rng);

    if (isHome || config.rng() < SHOP_GEN_PROBABILITY) {
      this.shop = this.generateShop(config.rng);
    }

    this.tileStates = this.generateTileStates();
  }

  private generateTileStates() {
    const states = new Map<string, string>();

    this.teleporters.forEach((tp) => tp.getTiles().forEach((t) => states.set(posToKey(t), `tp-${tp.getSide()}`)));
    this.shop?.getTiles().forEach((t) => states.set(posToKey(t), "shop"));

    return states;
  }

  private generateObstacles(numStructures: number, rng: () => number): Obstacle[] {
    const obstacles: Obstacle[] = [];

    for (let i = 0; i < numStructures; i++) {
      const structure = OBSTACLES[getRandomInt(0, OBSTACLES.length - 1, rng)];
      const flipOne = getRandomInt(0, 1, rng) === 0;
      const flipTwo = getRandomInt(0, 1, rng) === 0;

      for (let tries = 0; tries < 5; tries++) {
        const row = getRandomInt(0, MAP_SIZE - 1, rng);
        const col = getRandomInt(0, MAP_SIZE - 1, rng);

        const squares = structure.map(([preX, preY]) => {
          const [x, y] = flipCoords(preX, preY, flipOne, flipTwo);
          return { x: x + col, y: y + row };
        });

        if (!this.isOccupied(squares)) {
          obstacles.push(new Obstacle(this, squares));
          break;
        }
      }
    }

    return obstacles;
  }

  addOccupiedSquares(squares: Point[]) {
    squares.forEach(({ x, y }) => (this.isTileOccupied[y][x] = true));
  }

  getTileState(tile: Point) {
    return this.tileStates.get(posToKey(tile)) || "none";
  }

  private isOccupied(points: Point[]): boolean {
    for (const { x, y } of points) {
      if (!this.isTileOccupied[y] || this.isTileOccupied[y][x]) {
        return true;
      }
    }

    return false;
  }

  private generateTeleporters(
    isHome: boolean,
    maps: Map<string, RandomMap>,
    position: Point,
    rng: () => number
  ): Teleporter[] {
    const homeTpStartPosition = Math.round(MAP_SIZE / 2 - 2);

    if (isHome) {
      return [
        new Teleporter(this, "up", 4, homeTpStartPosition),
        new Teleporter(this, "right", 4, homeTpStartPosition),
        new Teleporter(this, "down", 4, homeTpStartPosition),
        new Teleporter(this, "left", 4, homeTpStartPosition),
      ];
    }

    const { x, y } = position;

    const mapAbove = maps.get(posToKey({ x, y: y + 1 }));
    const mapBelow = maps.get(posToKey({ x, y: y - 1 }));
    const mapToTheLeft = maps.get(posToKey({ x: x - 1, y }));
    const mapToTheRight = maps.get(posToKey({ x: x + 1, y }));

    const teleporters: Teleporter[] = [];

    const tpAbove = mapAbove?.getTeleporter("down");
    const tpBelow = mapBelow?.getTeleporter("up");
    const tpToTheRight = mapToTheRight?.getTeleporter("left");
    const tpToTheLeft = mapToTheLeft?.getTeleporter("right");

    if (tpBelow) teleporters.push(tpBelow.getOppositeTeleporter());
    if (tpAbove) teleporters.push(tpAbove.getOppositeTeleporter());
    if (tpToTheLeft) teleporters.push(tpToTheLeft.getOppositeTeleporter());
    if (tpToTheRight) teleporters.push(tpToTheRight.getOppositeTeleporter());

    const missingMapSides = ["up", "down", "left", "right"].filter(
      (side) => !teleporters.find((tp) => tp.getSide() === side)
    ) as MapSide[];

    missingMapSides.forEach((side) => {
      if (rng() < TP_GEN_PROBABILITY) {
        const size = getRandomInt(TP_SIZE_MIN, TP_SIZE_MAX, rng);
        const startPosition = Math.floor(rng() * (MAP_SIZE - 2 - size)) + 1;
        teleporters.push(new Teleporter(this, side, size, startPosition));
      }
    });

    return teleporters;
  }

  private generateShop(rng: () => number) {
    const shopStructure = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    while (true) {
      const row = getRandomInt(0, MAP_SIZE - 1, rng);
      const col = getRandomInt(0, MAP_SIZE - 1, rng);

      const squares = shopStructure.map(([x, y]) => ({ x: x + col, y: y + row }));

      if (!this.isOccupied(squares)) {
        return new Shop(this, squares);
      }
    }
  }

  getTeleporter(side: MapSide) {
    return this.teleporters.find((tp) => tp.getSide() === side);
  }

  getShop() {
    return this.shop;
  }

  getObstacles() {
    return this.obstacles;
  }

  getPosition() {
    return this.position;
  }

  getIndex() {
    return posToKey(this.position);
  }

  getTileOccupation() {
    return this.isTileOccupied;
  }

  getObstacleTiles() {
    const tiles: Point[] = [];

    this.obstacles.forEach((obs) => tiles.push(...obs.getTiles()));

    return tiles;
  }

  getFreeTile(pathTo?: Point) {
    let randomRow = Math.floor(Math.random() * CANVAS_ROWS);
    let randomColumn = Math.floor(Math.random() * CANVAS_COLUMNS);
    let pathFulfilled =
      !pathTo ||
      pathToPoint(this.isTileOccupied, tileCenterToPixels({ x: randomColumn, y: randomRow }), pathTo).length > 0;

    while (this.isTileOccupied[randomRow][randomColumn] || !pathFulfilled) {
      randomRow = Math.floor(Math.random() * CANVAS_ROWS);
      randomColumn = Math.floor(Math.random() * CANVAS_COLUMNS);
      pathFulfilled =
        !pathTo ||
        pathToPoint(this.isTileOccupied, tileCenterToPixels({ x: randomColumn, y: randomRow }), pathTo).length > 0;
    }

    return tileCenterToPixels({ x: randomColumn, y: randomRow });
  }

  tick() {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();

    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = COLOR_MAP_BACKGROUND;
    ctx.fill();

    ctx.closePath();

    this.teleporters.forEach((tp) => tp.draw(ctx));
    this.obstacles.forEach((obs) => obs.draw(ctx));
    this.shop?.draw(ctx);
  }
}

class Shop {
  private tiles: Point[];

  constructor(map: RandomMap, tiles: Point[]) {
    this.tiles = tiles;
    map.addOccupiedSquares(tiles);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.tiles.forEach(({ x, y }) => drawTile(ctx, x, y, COLOR_SHOP));
  }

  getTiles() {
    return this.tiles;
  }
}

class Obstacle {
  private tiles: Point[];

  constructor(map: RandomMap, tiles: Point[]) {
    this.tiles = tiles;
    map.addOccupiedSquares(tiles);
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.tiles.forEach(({ x, y }) => drawTile(ctx, x, y, "#444444"));
  }

  getTiles() {
    return this.tiles;
  }
}

class Teleporter {
  private side: MapSide;
  private size: number;
  private startPosition: number;
  private tiles: Point[];
  private isUnlocked = false;
  private map: RandomMap;

  constructor(map: RandomMap, side: MapSide, size: number, startPosition: number) {
    this.side = side;
    this.size = size;
    this.startPosition = startPosition;
    this.tiles = this.calculateOccupiedSquares();
    this.map = map;
    map.addOccupiedSquares(this.tiles);
  }

  getOppositeTeleporter() {
    return new Teleporter(
      this.map,
      this.side === "down" ? "up" : this.side === "up" ? "down" : this.side === "left" ? "right" : "left",
      this.size,
      this.startPosition
    );
  }

  getTiles() {
    return this.tiles;
  }

  getSide() {
    return this.side;
  }

  getStartPosition() {
    return this.startPosition;
  }

  private calculateOccupiedSquares() {
    const points: Point[] = [];

    let horizontal = true;
    let fixedCoordinate = 0;

    if (this.side === "up") {
      horizontal = true;
      fixedCoordinate = 0;
    } else if (this.side === "right") {
      horizontal = false;
      fixedCoordinate = CANVAS_COLUMNS - 1;
    } else if (this.side === "down") {
      horizontal = true;
      fixedCoordinate = CANVAS_ROWS - 1;
    } else {
      horizontal = false;
      fixedCoordinate = 0;
    }

    for (let i = this.startPosition; i < this.startPosition + this.size; i++) {
      points.push({ x: horizontal ? i : fixedCoordinate, y: horizontal ? fixedCoordinate : i });
    }

    return points;
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.tiles.forEach(({ x, y }) =>
      drawTile(ctx, x, y, this.isUnlocked ? "rgba(0,111,255,1)" : "rgba(0,111,255,0.4)")
    );
  }

  tick() {}
}

export function posToKey(position: Point) {
  return position.x + "," + position.y;
}
