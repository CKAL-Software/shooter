import { map } from "../../Shooter";
import { BasicTowerSpec } from "../../Definitions/TowerSpecifications";
import { Tower } from "./Tower";

export class BasicTower extends Tower {
  constructor(notifyUI: () => void) {
    super(BasicTowerSpec, notifyUI);
  }

  canPlace() {
    const isOnGrass = map[this.tilePosition.y][this.tilePosition.x] === " ";

    return isOnGrass && super.canPlace();
  }
}
