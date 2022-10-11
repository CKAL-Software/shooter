import { Enemy } from "../Enemies/Enemy";
import { NormalProjectile } from "./NormalProjectile";

export class PiercingProjectile extends NormalProjectile {
  private numEnemiesHit: number = 0;
  private enemiesHit: Enemy[] = [];

  hitEnemy(enemyHit: Enemy) {
    if (this.enemiesHit.indexOf(enemyHit) !== -1) {
      return;
    }

    enemyHit.inflictDamage(this.damage);
    this.ownerTower.addDamageDealt(this.damage);
    if (this.numEnemiesHit > this.ownerTower.getLevel()) {
      this.shouldDraw = false;
    } else {
      this.enemiesHit.push(enemyHit);
      this.numEnemiesHit++;
    }
  }
}
