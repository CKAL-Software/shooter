import { drawBall } from "../../lib/canvasFunctions";
import { Point } from "../../lib/definitions";
import { Enemy } from "../Enemies/Enemy";
import { MovingObject, MovingObjectConfig } from "../MovingObject";
import { Player } from "../Player";

export interface ProjectileConfiguration extends MovingObjectConfig {
  direction: Point;
  damage: number;
  shotByPlayer: boolean;
  range: number;
}

export abstract class Projectile extends MovingObject {
  protected damage: number;
  protected direction: Point;
  protected shotByPlayer = false;
  protected rangeLeft = 0;

  constructor(config: ProjectileConfiguration) {
    super(config);
    this.damage = config.damage;
    this.shotByPlayer = config.shotByPlayer;
    this.direction = config.direction;
    this.rangeLeft = config.range;
  }

  abstract hitEnemyIfCollision(): void;

  protected shiftPosition(changeX: number, changeY: number): void {
    super.shiftPosition(changeX, changeY);

    const distance = Math.sqrt(changeX * changeX + changeY * changeY);

    this.rangeLeft -= distance;

    if (this.rangeLeft <= 0) {
      this.shouldDraw = false;
    }
  }

  clearIfCollision() {
    this.updateSurroundingObstacles();
    const [isColliding] = this.checkCollision(this.position);
    if (isColliding) {
      this.shouldDraw = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    drawBall(ctx, this.getDrawPosition(), this.size, this.color);
  }

  hitEnemy(enemyHit: Enemy | Player) {
    enemyHit.inflictDamage(this.damage);
    this.shouldDraw = false;
  }
}
