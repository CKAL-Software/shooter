import { Point } from "../lib/definitions";
import { GameObject } from "./GameObject";

export class NumberAnimation extends GameObject {
  protected id = "";
  protected ticksLeft = 100;
  protected position = { x: -100, y: -100 };
  protected number = 0;

  constructor(startPosition: Point, number: number) {
    super(0);

    this.position = startPosition;
    this.number = number;
    this.id = (Math.random() * 1000000).toString();
  }

  draw(ctx: CanvasRenderingContext2D): void {}

  tick(): void {
    this.ticksLeft--;

    if (this.ticksLeft < 0) {
      this.shouldDraw = false;
    }
  }

  getNumber() {
    return this.number;
  }

  getX() {
    return this.position.x;
  }

  getY() {
    return this.position.y;
  }

  getId() {
    return this.id;
  }
}
