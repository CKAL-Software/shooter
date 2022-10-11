import { map } from "../../Shooter";
import { SniperTowerSpec } from "../../Definitions/TowerSpecifications";
import { Tower } from "./Tower";

export class SniperTower extends Tower {
  constructor(notifyUI: () => void) {
    super(SniperTowerSpec, notifyUI);
  }

  canPlace() {
    const isOnGrass = map[this.tilePosition.y][this.tilePosition.x] === " ";

    return isOnGrass && super.canPlace();
  }
}
