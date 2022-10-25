import { getSurroundingObstacles, pixelsToTile } from "../lib/canvasFunctions";
import { Point, TILE_SIZE } from "../lib/definitions";
import { map } from "../Shooter";

export abstract class GameObject {
  protected size: number;
  protected surroundingObstacles: { topLeftPoint: Point }[] = [];
  protected drawPosition: Point = { x: -100, y: -100 };
  protected tile = { x: 0, y: 0 };
  public shouldDraw = true;

  constructor(size: number, drawPosition?: Point) {
    this.size = size;
    if (drawPosition) {
      this.drawPosition = drawPosition;
    }
  }

  abstract tick(): void;

  abstract draw(ctx: CanvasRenderingContext2D): void;

  protected updateSurroundingObstacles() {
    const currentTile = pixelsToTile({ x: this.drawPosition.x, y: this.drawPosition.y });

    if (currentTile.x !== this.tile.x || currentTile.y !== this.tile.y) {
      this.tile = currentTile;
      this.surroundingObstacles = getSurroundingObstacles(map, { x: this.drawPosition.x, y: this.drawPosition.y });
    }
  }

  protected checkCollision(newPosition: Point): [boolean, boolean | undefined] {
    for (const { topLeftPoint } of this.surroundingObstacles) {
      const circleDistanceX = Math.abs(newPosition.x - (topLeftPoint.x + TILE_SIZE / 2));
      const circleDistanceY = Math.abs(newPosition.y - (topLeftPoint.y + TILE_SIZE / 2));

      if (circleDistanceX >= TILE_SIZE / 2 + this.size) continue;
      if (circleDistanceY >= TILE_SIZE / 2 + this.size) continue;

      if (circleDistanceX <= TILE_SIZE / 2) return [true, undefined];
      if (circleDistanceY <= TILE_SIZE / 2) return [true, undefined];

      const cornerDistance_sq =
        Math.pow(circleDistanceX - TILE_SIZE / 2, 2) + Math.pow(circleDistanceY - TILE_SIZE / 2, 2);

      if (cornerDistance_sq <= this.size * this.size) {
        return [true, circleDistanceY > circleDistanceX];
      }
    }
    return [false, undefined];
  }
}
