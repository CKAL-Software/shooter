import { GameObject } from "../GameObjects/GameObject";
import { CANVAS_COLUMNS, Point, TILE_SIZE, TOWER_SIZE } from "./definitions";

export function drawBackground(ctx: CanvasRenderingContext2D, map: string[]) {
  ctx.beginPath();

  ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "#00AA00";
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
        drawTile(ctx, x, y, "yellow");
      } else if (map[y][x] === "~") {
        drawTile(ctx, x, y, "#006fff");
      } else if (map[y][x] === "^") {
        drawTile(ctx, x, y, "lightgray");
      }
    }
  }
}

export function calculatePathFromLevel(map: string[]) {
  const nodes: Point[] = [];
  const directions: [number, number][] = [[1, 0]];

  for (let y = 0; nodes.length === 0; y++) {
    if (map[y][0] === "x") {
      nodes.push({ x: 0, y: y });
    }
  }

  let currPos = nodes[0];

  const tries: [number, number][] = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  while (currPos.x !== CANVAS_COLUMNS - 1) {
    for (const trial of tries) {
      const previousNode = nodes[nodes.length - 2];
      if (
        map[currPos.y + trial[1]][currPos.x + trial[0]] === "x" &&
        (nodes.length === 1 || previousNode.x !== currPos.x + trial[0] || previousNode.y !== currPos.y + trial[1])
      ) {
        const newPos = {
          x: currPos.x + trial[0],
          y: currPos.y + trial[1],
        };
        nodes.push(newPos);
        directions.push(trial);
        currPos = newPos;
        break;
      }
    }
  }

  nodes.unshift({ x: nodes[0].x - 1, y: nodes[0].y });
  directions.push([1, 0], [1, 0]);

  const coordinates = nodes.map(tileToPixels);

  const allCoordinates: Point[] = [];

  coordinates.forEach((coord, step) => {
    for (let i = 0; i < TILE_SIZE; i++) {
      allCoordinates.push({
        x: coord.x + directions[step][0] * i,
        y: coord.y + directions[step][1] * i,
      });
    }
  });

  return allCoordinates;
}

export function calculateSraightPath(path: Point[]) {
  const start = path[0];
  const end = path[path.length - 1];

  const direction = calculateDirection(start, end);

  const newPath: Point[] = [start];
  let currentPos = start;

  while (currentPos.x < end.x) {
    currentPos = { x: currentPos.x + direction.x, y: currentPos.y + direction.y };
    newPath.push(currentPos);
  }

  const roundedPath = newPath.map((pos) => ({ x: Math.round(pos.x), y: Math.round(pos.y) }));

  return roundedPath;
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
