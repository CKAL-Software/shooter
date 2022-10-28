import { drawBall } from "../../lib/canvasFunctions";
import { Point } from "../../lib/definitions";
import { Enemy } from "../Enemies/Enemy";
import { MovingObject } from "../MovingObject";
import { Player } from "../Player";

export interface ProjectileConfiguration {
  startPosition: Point;
  direction: Point;
  velocity: number;
  damage: number;
  size: number;
  color: string;
  shotByPlayer: boolean;
}

export abstract class Projectile extends MovingObject {
  protected color: string;
  protected damage: number;
  protected direction: Point;
  protected shotByPlayer = false;

  constructor(config: ProjectileConfiguration) {
    super(config.startPosition, config.velocity, config.size);
    this.color = config.color;
    this.damage = config.damage;
    this.shotByPlayer = config.shotByPlayer;
    this.direction = config.direction;
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
