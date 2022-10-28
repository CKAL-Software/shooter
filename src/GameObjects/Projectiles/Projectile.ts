import { drawBall } from "../../lib/canvasFunctions";
import { Point } from "../../lib/definitions";
import { Enemy } from "../Enemies/Enemy";
import { MovingObject } from "../MovingObject";
import { Player } from "../Player";

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
    drawBall(ctx, this.drawPosition, this.size, this.color);
  }

  hitEnemy(enemyHit: Enemy | Player) {
    enemyHit.inflictDamage(this.damage);
    this.shouldDraw = false;
  }
}
