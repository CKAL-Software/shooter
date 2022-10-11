import { Point } from "../../lib/definitions";
import { Enemy } from "../Enemies/Enemy";

export class ToughEnemy extends Enemy {
  constructor(path: Point[], hp: number, velocity: number, damage: number, reward: number) {
    super(path, hp, 18, "red", velocity, damage, reward);
  }

  slow(slowAmount: number, slowDuration: number) {
    this.actualVelocity = Math.max(this.velocity / 2, this.actualVelocity - slowAmount / 2);
    this.slowCounter = slowDuration / 2;
  }

  drawHealthBar(ctx: CanvasRenderingContext2D) {
    super.drawHealthBar(ctx, true);
  }
}
