import { drawBall } from "../../lib/canvasFunctions";
import { Point } from "../../lib/definitions";
import { Enemy } from "../Enemies/Enemy";
import { MovingObject, MovingObjectConfig } from "../MovingObject";
import { Player } from "../Player";

export interface ProjectileConfiguration extends MovingObjectConfig {
  direction: Point;
  damage: number;
  shotByPlayer: boolean;
}

export abstract class Projectile extends MovingObject {
  protected damage: number;
  protected direction: Point;
  protected shotByPlayer = false;

  constructor(config: ProjectileConfiguration) {
    super(config);
    this.damage = config.damage;
    this.shotByPlayer = config.shotByPlayer;
    this.direction = config.direction;
  }

  abstract hitEnemyIfCollision(): void;

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
