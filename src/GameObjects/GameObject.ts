import { getSurroundingObstacles, pixelsToTile } from "../lib/canvasFunctions";
import { Point, TILE_SIZE } from "../lib/definitions";
import { CANVAS_COLUMNS, CANVAS_ROWS } from "../Definitions/Maps";
import { map } from "../Shooter";

export abstract class GameObject {
  protected size: number;
  protected drawPosition: Point = { x: -100, y: -100 };
  public shouldDraw = true;

  constructor(size: number, drawPosition?: Point) {
    this.size = size;
    if (drawPosition) {
      this.drawPosition = drawPosition;
    }
  }

  abstract tick(): void;

  abstract draw(ctx: CanvasRenderingContext2D): void;
}
