import { GameObject } from "../GameObjects/GameObject";
import { Point, TILE_SIZE, TOWER_SIZE } from "./definitions";

export function drawBackground(ctx: CanvasRenderingContext2D, map: string[]) {
  ctx.beginPath();

  ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "lightgray";
  ctx.fill();

  drawMap(ctx, map);

  ctx.closePath();
}

export function drawTile(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.beginPath();

  ctx.rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.closePath();
}

export function drawTowerTile(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, border?: boolean) {
  if (border) {
    ctx.beginPath();

    ctx.rect(
      x * TILE_SIZE + (TILE_SIZE - TOWER_SIZE) / 2,
      y * TILE_SIZE + (TILE_SIZE - TOWER_SIZE) / 2,
      TOWER_SIZE,
      TOWER_SIZE
    );
    ctx.fillStyle = "black";

    ctx.fill();

    ctx.closePath();
  }

  ctx.beginPath();

  ctx.rect(
    x * TILE_SIZE + (TILE_SIZE - TOWER_SIZE) / 2 + (border ? 1 : 0),
    y * TILE_SIZE + (TILE_SIZE - TOWER_SIZE) / 2 + (border ? 1 : 0),
    TOWER_SIZE + (border ? -2 : 0),
    TOWER_SIZE + (border ? -2 : 0)
  );
  ctx.fillStyle = color;

  ctx.fill();

  ctx.closePath();
}

export function drawMap(ctx: CanvasRenderingContext2D, map: string[]) {
  for (let x = 0; x < map[0].length; x++) {
    for (let y = 0; y < map.length; y++) {
      if (map[y][x] === "x") {
        drawTile(ctx, x, y, "#444444");
      } else if (map[y][x] === "~") {
        drawTile(ctx, x, y, "#006fff");
      } else if (map[y][x] === "^") {
        drawTile(ctx, x, y, "lightgray");
      }
    }
  }
}

export function getObstacles(map: string[]) {
  const obstacles: { topLeftPoint: Point }[] = [];

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] === "x") {
        obstacles.push({ topLeftPoint: { x: TILE_SIZE * col, y: TILE_SIZE * row } });
      }
    }
  }
}

export function getSurroundingObstacles(map: String[], pixelPos: Point) {
  const tilePos = pixelsToTile(pixelPos);

  const surroundingIndexDeltas = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];

  const obstacles: { topLeftPoint: Point }[] = [];

  for (const [deltaX, deltaY] of surroundingIndexDeltas) {
    const col = tilePos.x + deltaX;
    const row = tilePos.y + deltaY;

    if (col < 0 || col > map[0].length - 1 || row < 0 || row > map.length - 1) {
      continue;
    }

    if (map[row][col] === "x") {
      obstacles.push({ topLeftPoint: { x: TILE_SIZE * col, y: TILE_SIZE * row } });
    }
  }

  return obstacles;
}

export function getMousePos(canvas: HTMLCanvasElement, mouseEvent: MouseEvent) {
  const rect = canvas.getBoundingClientRect();

  return {
    x: Math.round(mouseEvent.clientX + 1 - rect.left),
    y: Math.round(mouseEvent.clientY + 1 - rect.top),
  };
}

export function tileToPixels(tilePos: Point) {
  return {
    x: tilePos.x * TILE_SIZE + TILE_SIZE / 2,
    y: tilePos.y * TILE_SIZE + TILE_SIZE / 2,
  };
}

export function pixelsToTile(pos: Point) {
  return { x: Math.floor(pos.x / TILE_SIZE), y: Math.floor(pos.y / TILE_SIZE) };
}

export function calculateDistance(posA: Point, posB: Point) {
  const difX = posA.x - posB.x;
  const difY = posA.y - posB.y;

  return Math.sqrt(difX * difX + difY * difY);
}

export function calculateDirection(fromPos: Point, toPos: Point) {
  const difX = toPos.x - fromPos.x;
  const difY = toPos.y - fromPos.y;

  const distance = Math.sqrt(difX * difX + difY * difY);

  const changeX = difX / distance;
  const changeY = difY / distance;

  return { x: changeX, y: changeY };
}

export function drawAndCleanupObjects(ctx: CanvasRenderingContext2D, objects: GameObject[]) {
  for (let i = objects.length - 1; i >= 0; i--) {
    if (objects[i].shouldDraw) {
      objects[i].draw(ctx);
    } else {
      objects.splice(i, 1);
    }
  }
}

export function pathToPoint(map: string[], fromPosition: Point, toPosition: Point): Point[] {
  return [];
}
