import { ANIM_MIN_REFRESH_TIME, ANIM_TIME, Point, TICK_DURATION_S } from "../lib/definitions";
import { GameObject } from "./GameObject";

export class RisingText extends GameObject {
  private id = "";
  private timeLeft = ANIM_TIME;
  private value: string | number;
  private isCriticalHit: boolean;

  constructor(position: Point, value: string | number, color: string, isCriticalHit?: boolean) {
    super({ position, size: 0, color });

    this.value = value;
    this.id = (Math.random() * 1000000).toString();
    this.isCriticalHit = !!isCriticalHit;
  }

  draw(ctx: CanvasRenderingContext2D): void {}

  tick(): void {
    this.timeLeft -= TICK_DURATION_S;

    if (this.timeLeft < 0) {
      this.shouldDraw = false;
    }
  }

  setText(newText: string | number) {
    this.value = newText;
    this.timeLeft = Math.max(this.timeLeft, ANIM_MIN_REFRESH_TIME);
  }

  getText() {
    return this.value;
  }

  getIsCriticalHit() {
    return this.isCriticalHit;
  }

  getX() {
    return this.position.x;
  }

  getY() {
    return this.position.y - 10;
  }

  getId() {
    return this.id;
  }
}
