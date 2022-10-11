import { map, projectiles } from "../../Shooter";
import { calculateDirection } from "../../lib/canvasFunctions";
import { TICK_DURATION, TILE_SIZE } from "../../lib/definitions";
import { BoatTowerSpec } from "../../Definitions/TowerSpecifications";
import { Enemy } from "../Enemies/Enemy";
import { NormalProjectile } from "../Projectiles/NormalProjectile";
import { Tower } from "./Tower";

export class BoatTower extends Tower {
  constructor(notifyUI: () => void) {
    super(BoatTowerSpec, notifyUI);
  }

  canPlace() {
    const isInOcean = map[this.tilePosition.y][this.tilePosition.x] === "~";

    return isInOcean && super.canPlace();
  }

  shoot(target: Enemy) {
    const { velocities, damages, size, color, projectileConstructor } = this.spec.projectileSpec;

    const direction = calculateDirection(this.position, target.getPosition());
    const realPos = JSON.parse(JSON.stringify(this.position));

    projectiles.push(
      new (projectileConstructor as typeof NormalProjectile)(
        this,
        velocities[this.level],
        damages[this.level],
        size,
        color,
        direction
      )
    );

    this.position = { x: realPos.x - (direction.y * TILE_SIZE) / 1.3, y: realPos.y + (direction.x * TILE_SIZE) / 1.3 };
    projectiles.push(
      new (projectileConstructor as typeof NormalProjectile)(
        this,
        velocities[this.level],
        damages[this.level],
        size,
        color,
        direction
      )
    );

    this.position = { x: realPos.x + (direction.y * TILE_SIZE) / 1.3, y: realPos.y - (direction.x * TILE_SIZE) / 1.3 };
    projectiles.push(
      new (projectileConstructor as typeof NormalProjectile)(
        this,
        velocities[this.level],
        damages[this.level],
        size,
        color,
        direction
      )
    );

    this.position = realPos;

    this.reloadCounter = 60000 / (this.spec.roundsPerMins[this.level] * TICK_DURATION);
  }
}
