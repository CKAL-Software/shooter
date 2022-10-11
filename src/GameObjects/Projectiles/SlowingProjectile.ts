import { Enemy } from "../Enemies/Enemy";
import { Tower } from "../Towers/Tower";
import { HeatSeekingProjectile } from "./HeatSeekingProjectile";

export class SlowingProjectile extends HeatSeekingProjectile {
  private slow: number;

  constructor(
    ownerTower: Tower,
    velocity: number,
    damage: number,
    slow: number,
    size: number,
    color: string,
    target: Enemy
  ) {
    super(ownerTower, velocity, damage, size, color, target);

    this.slow = slow;
  }

  hitEnemy(enemyHit: Enemy) {
    super.hitEnemy(enemyHit);
    enemyHit.slow(this.slow, 400);
  }
}
