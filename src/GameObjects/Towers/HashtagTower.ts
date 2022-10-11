import { map } from "../../Shooter";
import { HashtagTowerSpec } from "../../Definitions/TowerSpecifications";
import { Tower } from "./Tower";
import { FlyingEnemy } from "../Enemies/FlyingEnemy";

export class HashtagTower extends Tower {
  constructor(notifyUI: () => void) {
    super(HashtagTowerSpec, notifyUI);
  }

  canPlace() {
    const isOnGrass = map[this.tilePosition.y][this.tilePosition.x] === " ";

    return isOnGrass && super.canPlace();
  }

  getEnemiesInRange() {
    const enemiesInRange = super.getEnemiesInRange();
    return enemiesInRange.filter((en) => typeof en.enemy !== typeof FlyingEnemy);
  }
}
