import { map, projectiles } from "../../Shooter";
import { FreezerTowerSpec } from "../../Definitions/TowerSpecifications";
import { Tower } from "./Tower";
import { SlowingProjectile } from "../Projectiles/SlowingProjectile";
import { TICK_DURATION } from "../../lib/definitions";

export class FreezerTower extends Tower {
  constructor(notifyUI: () => void) {
    super(FreezerTowerSpec, notifyUI);
    super.setTargetingMode("Random");
  }

  canPlace() {
    const isOnGrass = map[this.tilePosition.y][this.tilePosition.x] === " ";

    return isOnGrass && super.canPlace();
  }

  setTargetingMode() {}

  shoot() {
    const enemiesInRange = [...this.getEnemiesInRange()];

    let shotsLeft = this.getLevel() + 1;

    while (enemiesInRange.length > 0 && shotsLeft > 0) {
      const { velocities, damages, size, slows, color, projectileConstructor } = this.spec.projectileSpec;

      const randomIndex = Math.floor(Math.random() * enemiesInRange.length);

      projectiles.push(
        new (projectileConstructor as typeof SlowingProjectile)(
          this,
          velocities[this.getLevel()],
          damages[this.getLevel()],
          slows![this.getLevel()],
          size,
          color,
          enemiesInRange[randomIndex].enemy
        )
      );

      enemiesInRange.splice(randomIndex, 1);

      shotsLeft--;
    }

    this.reloadCounter = 60000 / (this.spec.roundsPerMins[this.level] * TICK_DURATION * 2);
  }
}
