import { CANVAS_COLUMNS, CANVAS_ROWS } from "../Definitions/Maps";
import { GameObject } from "../GameObjects/GameObject";
import { Point, TILE_SIZE } from "./definitions";
import { COLOR_MAP_BACKGROUND, COLOR_SHOP } from "./definitions.colors";
import { changeDirection, isTileOccupied } from "./functions";
import { RandomMap } from "./MapGenerator";
import { MinHeap } from "./minHeap";
import { SNode } from "./models";

export function drawBackground(ctx: CanvasRenderingContext2D, mapLayout: string[][], tpsIsUnlocked: boolean) {
  ctx.beginPath();

  ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = COLOR_MAP_BACKGROUND;
  ctx.fill();

  drawMap(ctx, mapLayout, tpsIsUnlocked);

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

export function drawMap(ctx: CanvasRenderingContext2D, mapLayout: string[][], tpsIsUnlocked: boolean) {
  for (let x = 0; x < mapLayout[0].length; x++) {
    for (let y = 0; y < mapLayout.length; y++) {
      const tile = mapLayout[y][x];
      if (tile === "x") {
        drawTile(ctx, x, y, "#444444");
      } else if (tile === "~") {
        drawTile(ctx, x, y, tpsIsUnlocked ? "rgba(0,111,255,1)" : "rgba(0,111,255,0.4)");
      } else if (tile === "^") {
        drawTile(ctx, x, y, "lightgray");
      } else if (tile === "s") {
        drawTile(ctx, x, y, COLOR_SHOP);
      }
    }
  }
}

export function getObstacleTiles(map: RandomMap) {
  const obstacles: { topLeftPoint: Point }[] = [];

  map
    .getObstacleTiles()
    .forEach(({ x, y }) => obstacles.push({ topLeftPoint: { x: x * TILE_SIZE, y: y * TILE_SIZE } }));

  return obstacles;
}

export function getSurroundingObstacles(map: RandomMap, pixelPos: Point) {
  const { x, y } = pixelsToTile(pixelPos);

  const surroundingTileIndicies = [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
  ];

  const allObstacleTiles = map.getObstacleTiles();

  return allObstacleTiles
    .filter(({ x, y }) => {
      for (const [surrX, surrY] of surroundingTileIndicies) {
        if (x === surrX && y === surrY) {
          return true;
        }
      }
      return false;
    })
    .map(({ x, y }) => ({ topLeftPoint: { x: x * TILE_SIZE, y: y * TILE_SIZE } }));
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

export function pathToPoint(mapLayout: boolean[][], fromPositionPixels: Point, toPositionPixels: Point): SNode[] {
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
        if (deltaX === -1 && isTileOccupied(mapLayout, { x: current.tilePos.x - 1, y: current.tilePos.y })) continue;
        if (deltaX === 1 && isTileOccupied(mapLayout, { x: current.tilePos.x + 1, y: current.tilePos.y })) continue;
        if (deltaY === -1 && isTileOccupied(mapLayout, { x: current.tilePos.x, y: current.tilePos.y - 1 })) continue;
        if (deltaY === 1 && isTileOccupied(mapLayout, { x: current.tilePos.x, y: current.tilePos.y + 1 })) continue;
      }

      if (!isTileOccupied(mapLayout, neighbor)) {
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

export function findRandomLocation(mapLayout: boolean[][], pathTo?: Point) {
  let randomRow = Math.floor(Math.random() * CANVAS_ROWS);
  let randomColumn = Math.floor(Math.random() * CANVAS_COLUMNS);
  let pathFulfilled =
    !pathTo || pathToPoint(mapLayout, tileCenterToPixels({ x: randomColumn, y: randomRow }), pathTo).length > 0;

  while (isTileOccupied(mapLayout, { x: randomColumn, y: randomRow }) || !pathFulfilled) {
    randomRow = Math.floor(Math.random() * CANVAS_ROWS);
    randomColumn = Math.floor(Math.random() * CANVAS_COLUMNS);
    pathFulfilled =
      !pathTo || pathToPoint(mapLayout, tileCenterToPixels({ x: randomColumn, y: randomRow }), pathTo).length > 0;
  }

  return tileCenterToPixels({ x: randomColumn, y: randomRow });
}
