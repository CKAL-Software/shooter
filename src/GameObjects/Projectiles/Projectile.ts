import { Enemy } from "../Enemies/Enemy";
import { MovingObject } from "../MovingObject";
import { Tower } from "../Towers/Tower";

export abstract class Projectile extends MovingObject {
  protected ownerTower: Tower;
  protected size: number;
  protected color: string;
  protected damage: number;

  constructor(ownerTower: Tower, velocity: number, damage: number, size: number, color: string) {
    super(ownerTower.getPosition(), velocity);

    this.ownerTower = ownerTower;
    this.size = size;
    this.color = color;
    this.damage = damage;
  }

  abstract hitEnemyIfCollision(): void;

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.drawPosition.x, this.drawPosition.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  hitEnemy(enemyHit: Enemy) {
    enemyHit.inflictDamage(this.damage);
    this.ownerTower.addDamageDealt(this.damage);
    this.shouldDraw = false;
  }
}
