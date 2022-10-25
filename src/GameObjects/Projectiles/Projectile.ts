import { Point } from "../../lib/definitions";
import { Enemy } from "../Enemies/Enemy";
import { MovingObject } from "../MovingObject";

export abstract class Projectile extends MovingObject {
  protected color: string;
  protected damage: number;

  constructor(startPosition: Point, velocity: number, damage: number, size: number, color: string) {
    super(startPosition, velocity, size);
    this.color = color;
    this.damage = damage;
  }

  abstract hitEnemyIfCollision(): void;

  clearIfCollision() {
    this.updateSurroundingObstacles();
    const [isColliding] = this.checkCollision(this.drawPosition);
    if (isColliding) {
      this.shouldDraw = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.drawPosition.x, this.drawPosition.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  hitEnemy(enemyHit: Enemy) {
    enemyHit.inflictDamage(this.damage);
    this.shouldDraw = false;
  }
}
