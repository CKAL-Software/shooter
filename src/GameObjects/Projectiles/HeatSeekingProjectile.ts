import { calculateDistance } from "../../lib/canvasFunctions";
import { Enemy } from "../Enemies/Enemy";
import { Tower } from "../Towers/Tower";
import { Projectile } from "./Projectile";

export class HeatSeekingProjectile extends Projectile {
  protected target: Enemy;

  constructor(ownerTower: Tower, velocity: number, damage: number, size: number, color: string, target: Enemy) {
    super(ownerTower, velocity, damage, size, color);

    this.target = target;
  }

  hitEnemyIfCollision() {
    if (calculateDistance(this.position, this.target.getPosition()) <= this.target.getSize() + this.size) {
      this.hitEnemy(this.target);
    }
  }

  move() {
    const difX = this.target.getPosition().x - this.position.x;
    const difY = this.target.getPosition().y - this.position.y;

    const distance = Math.sqrt(difX * difX + difY * difY);

    const changeX = (difX / distance) * this.velocity;
    const changeY = (difY / distance) * this.velocity;

    this.setPosition({
      x: this.position.x + changeX,
      y: this.position.y + changeY,
    });
  }

  tick() {
    if (this.target.shouldDraw) {
      this.move();
      this.hitEnemyIfCollision();
    } else {
      this.shouldDraw = false;
    }
  }
}
