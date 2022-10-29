import { CANVAS_COLUMNS, CANVAS_ROWS } from "../Definitions/Maps";
import { getSurroundingObstacles, pixelsToTile } from "../lib/canvasFunctions";
import { Point, TILE_SIZE } from "../lib/definitions";
import { map } from "../Shooter";
import { GameObject } from "./GameObject";

export abstract class MovingObject extends GameObject {
  protected surroundingObstacles: { topLeftPoint: Point }[] = [];
  protected tile = { x: 0, y: 0 };
  protected position: Point = { x: -100, y: -100 };
  protected velocity: number;

  constructor(position: Point, velocity: number, size: number) {
    super(size);
    this.position = position;
    this.drawPosition = position;
    this.velocity = velocity;
    this.size = size;
  }

  protected setPosition(pos: Point) {
    this.position = { x: pos.x, y: pos.y };
    this.drawPosition = { x: Math.round(pos.x), y: Math.round(pos.y) };
  }

  protected shiftPosition(changeX: number, changeY: number) {
    this.setPosition({
      x: this.position.x + changeX,
      y: this.position.y + changeY,
    });
  }

  protected moveAroundObstacle(direction: Point) {}

  protected updateSurroundingObstacles() {
    const currentTile = pixelsToTile({ x: this.drawPosition.x, y: this.drawPosition.y });

    if (currentTile.x !== this.tile.x || currentTile.y !== this.tile.y) {
      this.tile = currentTile;
      this.surroundingObstacles = getSurroundingObstacles(map, { x: this.drawPosition.x, y: this.drawPosition.y });
    }
  }

  protected checkCollision(newPosition: Point): [boolean, boolean] {
    // check if out of map
    if (
      newPosition.x - this.size < 0 ||
      newPosition.y - this.size < 0 ||
      newPosition.x + this.size > TILE_SIZE * CANVAS_COLUMNS ||
      newPosition.y + this.size > TILE_SIZE * CANVAS_ROWS
    ) {
      return [true, false];
    }

    // check collision with obstacles
    for (const { topLeftPoint } of this.surroundingObstacles) {
      const circleDistanceX = Math.abs(newPosition.x - (topLeftPoint.x + TILE_SIZE / 2));
      const circleDistanceY = Math.abs(newPosition.y - (topLeftPoint.y + TILE_SIZE / 2));

      if (circleDistanceX >= TILE_SIZE / 2 + this.size) continue;
      if (circleDistanceY >= TILE_SIZE / 2 + this.size) continue;

      if (circleDistanceX <= TILE_SIZE / 2) return [true, false];
      if (circleDistanceY <= TILE_SIZE / 2) return [true, false];

      const cornerDistance_sq =
        Math.pow(circleDistanceX - TILE_SIZE / 2, 2) + Math.pow(circleDistanceY - TILE_SIZE / 2, 2);

      if (cornerDistance_sq <= this.size * this.size) {
        return [true, true];
      }
    }
    return [false, false];
  }

  abstract move(direction: Point): void;

  getPosition() {
    return this.position;
  }
}
