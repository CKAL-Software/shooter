import { Point } from "../lib/definitions";
import { GameObject } from "./GameObject";

export abstract class MovingObject extends GameObject {
  protected position: Point = { x: -100, y: -100 };
  protected velocity: number;

  constructor(position: Point, velocity: number, size: number) {
    super(size);
    this.position = position;
    this.velocity = velocity;
    this.size = size;
  }

  protected setPosition(pos: Point) {
    this.position = { x: pos.x, y: pos.y };
    this.drawPosition = { x: Math.round(pos.x), y: Math.round(pos.y) };
    const [isColliding] = this.checkCollision(this.drawPosition);
    if (isColliding) {
      this.shouldDraw = false;
    }
  }

  protected shiftPosition(changeX: number, changeY: number) {
    this.setPosition({
      x: this.position.x + changeX,
      y: this.position.y + changeY,
    });
  }

  abstract move(direction: Point): void;

  getPosition() {
    return this.position;
  }
}
