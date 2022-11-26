import { drawBall } from "../../lib/util.canvas";
import { Point } from "../../lib/definitions";
import { Gun } from "../../Weapons/Gun";
import { Enemy } from "../Enemies/Enemy";
import { MovingObject, MovingObjectConfig } from "../MovingObject";
import { Player } from "../Player";

export interface ProjectileConfiguration extends MovingObjectConfig {
  direction: Point;
  damage: number;
  shotByPlayer: boolean;
  range: number;
  isCriticalHit: boolean;
  ownerGun?: Gun;
}

export abstract class Projectile extends MovingObject {
  protected damage: number;
  protected direction: Point;
  protected shotByPlayer = false;
  protected rangeLeft = 0;
  protected ownerGun: Gun | undefined;
  protected isCriticalHit: boolean;

  constructor(config: ProjectileConfiguration) {
    super(config);
    this.damage = config.damage;
    this.shotByPlayer = config.shotByPlayer;
    this.direction = config.direction;
    this.rangeLeft = config.range;
    this.ownerGun = config.ownerGun;
    this.isCriticalHit = config.isCriticalHit;
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

  protected clearIfCollision() {
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
    enemyHit.inflictDamage(this.damage, this.isCriticalHit, this.ownerGun);
    this.shouldDraw = false;
  }
}
