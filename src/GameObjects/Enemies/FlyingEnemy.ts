import { calculateDirection, calculateSraightPath } from "../../lib/canvasFunctions";
import { Point } from "../../lib/definitions";
import { Enemy } from "./Enemy";

export class FlyingEnemy extends Enemy {
  private direction: Point;

  constructor(path: Point[], hp: number, velocity: number, damage: number, reward: number) {
    super(calculateSraightPath(path), hp, 12, "purple", velocity, damage, reward);

    this.direction = calculateDirection(path[0], path[path.length - 1]);
  }

  drawBody(ctx: CanvasRenderingContext2D) {
    const dirX = this.direction.x * 12;
    const dirY = this.direction.y * 12;

    ctx.beginPath();
    ctx.moveTo(this.position.x + 2 * dirX, this.position.y + 2 * dirY);
    ctx.lineTo(this.position.x - dirX + dirY, this.position.y - dirY - dirX);
    ctx.lineTo(this.position.x - dirX - dirY, this.position.y - dirY + dirX);

    ctx.fillStyle = "#bb0091";
    ctx.fill();
    ctx.closePath();
  }
}
