import { CANVAS_COLUMNS, CANVAS_ROWS } from "../Definitions/Maps";
import { GameObject } from "../GameObjects/GameObject";
import { COLOR_MAP_BACKGROUND, Point, TILE_SIZE } from "./definitions";
import { changeDirection, getTileType } from "./functions";
import { MinHeap } from "./minHeap";
import { SNode } from "./models";

export function drawBackground(ctx: CanvasRenderingContext2D, mapLayout: string[][]) {
  ctx.beginPath();

  ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = COLOR_MAP_BACKGROUND;
  ctx.fill();

  drawMap(ctx, mapLayout);

  ctx.closePath();
}

export function drawSquare(ctx: CanvasRenderingContext2D, size: number, x: number, y: number, color: string) {
  ctx.beginPath();

  ctx.rect(x, y, size, size);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.closePath();
}

export function drawTile(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  drawSquare(ctx, TILE_SIZE, x * TILE_SIZE, y * TILE_SIZE, color);
}

export function drawCrosshair(
  ctx: CanvasRenderingContext2D,
  playerPosition: Point,
  mousePosition: Point,
  recoil: number
) {
  const direction = calculateDirection(playerPosition, mousePosition);

  const a = changeDirection(direction, 90);
  const b = changeDirection(direction, -90);

  drawLine(ctx, mousePosition, { x: a.x * recoil + mousePosition.x, y: a.y * recoil + mousePosition.y }, "black");
  drawLine(ctx, mousePosition, { x: b.x * recoil + mousePosition.x, y: b.y * recoil + mousePosition.y }, "black");
}

export function drawLine(ctx: CanvasRenderingContext2D, fromPos: Point, toPos: Point, color: string) {
  ctx.beginPath();
  ctx.moveTo(fromPos.x, fromPos.y);
  ctx.lineTo(toPos.x, toPos.y);
  ctx.strokeStyle = color;
  ctx.stroke();
}

export function drawBall(ctx: CanvasRenderingContext2D, position: Point, size: number, color: string) {
  ctx.beginPath();
  ctx.arc(position.x, position.y, size, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

export function drawMap(ctx: CanvasRenderingContext2D, mapLayout: string[][]) {
  for (let x = 0; x < mapLayout[0].length; x++) {
    for (let y = 0; y < mapLayout.length; y++) {
      const tile = mapLayout[y][x];
      if (tile === "x") {
        drawTile(ctx, x, y, "#444444");
      } else if (tile === "~") {
        drawTile(ctx, x, y, "#006fff");
      } else if (tile === "^") {
        drawTile(ctx, x, y, "lightgray");
      } else if (tile === "s") {
        drawTile(ctx, x, y, "green");
      }
    }
  }
}

export function getObstacles(mapLayout: string[][]) {
  const obstacles: { topLeftPoint: Point }[] = [];

  for (let row = 0; row < mapLayout.length; row++) {
    for (let col = 0; col < mapLayout[row].length; col++) {
      if (mapLayout[row][col] === "x") {
        obstacles.push({ topLeftPoint: { x: TILE_SIZE * col, y: TILE_SIZE * row } });
      }
    }
  }

  return obstacles;
}

export function getSurroundingObstacles(mapLayout: string[][], pixelPos: Point) {
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

    if (col < 0 || col > mapLayout[0].length - 1 || row < 0 || row > mapLayout.length - 1) {
      continue;
    }

    if (mapLayout[row][col] === "x") {
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

export function tileCenterToPixels(tilePos: Point) {
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

  if (distance === 0) {
    return { x: 0, y: 0 };
  }

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

export function pathToPoint(mapLayout: string[][], fromPositionPixels: Point, toPositionPixels: Point): SNode[] {
  function h(node: SNode) {
    return calculateDistance(node.pos, toPositionPixels);
  }

  function createNode(tilePos: Point): SNode {
    const { x, y } = tileCenterToPixels(tilePos);
    return { key: tilePos.x + ";" + tilePos.y, pos: { x: x, y: y }, tilePos: tilePos };
  }

  function reconstructPath(cameFrom: { [key in string]: SNode }, current: SNode, startKey: string) {
    const totalPath = [current];
    while (cameFrom[current.key]) {
      current = cameFrom[current.key];
      totalPath.push(current);
      if (current.key === startKey) {
        break;
      }
    }

    totalPath.reverse();
    return totalPath;
  }

  const goalNode = createNode(pixelsToTile(toPositionPixels));

  const fScore: { [key in string]: number } = {};

  const openSet = new MinHeap([], fScore);

  const startNode = createNode(pixelsToTile(fromPositionPixels));
  openSet.add(startNode);

  const cameFrom: { [key in string]: SNode } = {};

  const gScore: { [key in string]: number } = {};
  gScore[startNode.key] = 0;

  fScore[startNode.key] = h(startNode);

  while (Object.keys(openSet).length > 0) {
    const current = openSet.removeHead();

    if (current.key === goalNode.key) {
      return reconstructPath(cameFrom, current, startNode.key);
    }

    const indexDeltas = [
      [0, -1, TILE_SIZE],
      [1, -1, TILE_SIZE * Math.SQRT2],
      [1, 0, TILE_SIZE],
      [1, 1, TILE_SIZE * Math.SQRT2],
      [0, 1, TILE_SIZE],
      [-1, 1, TILE_SIZE * Math.SQRT2],
      [-1, 0, TILE_SIZE],
      [-1, -1, TILE_SIZE * Math.SQRT2],
    ];
    for (const [deltaX, deltaY, cost] of indexDeltas) {
      const neighborX = current.tilePos.x + deltaX;
      const neighborY = current.tilePos.y + deltaY;
      const neighbor = { x: neighborX, y: neighborY };

      // We move diagonally, check no obstacles on either side
      if (cost > TILE_SIZE) {
        if (deltaX === -1 && getTileType(mapLayout, { x: current.tilePos.x - 1, y: current.tilePos.y }) !== " ")
          continue;
        if (deltaX === 1 && getTileType(mapLayout, { x: current.tilePos.x + 1, y: current.tilePos.y }) !== " ")
          continue;
        if (deltaY === -1 && getTileType(mapLayout, { x: current.tilePos.x, y: current.tilePos.y - 1 }) !== " ")
          continue;
        if (deltaY === 1 && getTileType(mapLayout, { x: current.tilePos.x, y: current.tilePos.y + 1 }) !== " ")
          continue;
      }

      if (getTileType(mapLayout, neighbor) === " ") {
        const tentativeGScore = gScore[current.key] + cost;
        const neighbor = createNode({ x: neighborX, y: neighborY });
        if (tentativeGScore < (gScore[neighbor.key] || Number.MAX_SAFE_INTEGER)) {
          cameFrom[neighbor.key] = current;
          gScore[neighbor.key] = tentativeGScore;
          fScore[neighbor.key] = tentativeGScore + h(neighbor);
          if (!openSet.exists(neighbor)) {
            openSet.add(neighbor);
          }
        }
      }
    }
  }

  return [];
}

export function findRandomLocation(mapLayout: string[][], pathTo?: Point) {
  let randomRow = Math.floor(Math.random() * CANVAS_ROWS);
  let randomColumn = Math.floor(Math.random() * CANVAS_COLUMNS);
  let pathFulfilled =
    !pathTo || pathToPoint(mapLayout, tileCenterToPixels({ x: randomColumn, y: randomRow }), pathTo).length > 0;

  while (mapLayout[randomRow][randomColumn] !== " " || !pathFulfilled) {
    randomRow = Math.floor(Math.random() * CANVAS_ROWS);
    randomColumn = Math.floor(Math.random() * CANVAS_COLUMNS);
    pathFulfilled =
      !pathTo || pathToPoint(mapLayout, tileCenterToPixels({ x: randomColumn, y: randomRow }), pathTo).length > 0;
  }

  return tileCenterToPixels({ x: randomColumn, y: randomRow });
}
