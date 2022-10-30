import { Point, TICK_DURATION_S } from "../lib/definitions";
import { GameObject } from "./GameObject";

export class NumberAnimation extends GameObject {
  protected id = "";
  protected timeLeft = 1;
  protected position = { x: -100, y: -100 };
  protected number = 0;

  constructor(position: Point, number: number) {
    super({ position, size: 0, color: "" });

    this.position = position;
    this.number = number;
    this.id = (Math.random() * 1000000).toString();
  }

  draw(ctx: CanvasRenderingContext2D): void {}

  tick(): void {
    this.timeLeft -= TICK_DURATION_S;

    if (this.timeLeft < 0) {
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
