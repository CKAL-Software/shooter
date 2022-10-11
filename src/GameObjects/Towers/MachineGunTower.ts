import { map } from "../../Shooter";
import { MachineGunTowerSpec } from "../../Definitions/TowerSpecifications";
import { Tower } from "./Tower";

export class MachineGunTower extends Tower {
  constructor(notifyUI: () => void) {
    super(MachineGunTowerSpec, notifyUI);
  }

  canPlace() {
    const isOnGrass = map[this.tilePosition.y][this.tilePosition.x] === " ";

    return isOnGrass && super.canPlace();
  }
}
