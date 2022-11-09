import { PistolSkills } from "../lib/skillDefinitions";
import { Gun } from "./Gun";
import { TILE_SIZE } from "../lib/definitions";
import { MAP_SIZE } from "../Definitions/Maps";

export class Sniper extends Gun {
  constructor() {
    super({
      name: "Sniper",
      damage: 15,
      magazineSize: 3,
      reloadTime: 2,
      fireRate: 40,
      velocity: 400,
      recoil: 5,
      critChance: 1.2,
      range: TILE_SIZE * MAP_SIZE,
      numBullets: 1,
      projectileSize: 4,
      projectileColor: "black",
      ammo: 20,
      price: 50,
      skills: PistolSkills,
    });
  }

  onLevelUp(levelIndex: number): void {
    this.baseDamage *= 1.5;
    this.baseMagazineSize += [0, 0, 1, 0, 0, 1, 0, 0, 2][levelIndex];
    this.baseReloadTime -= 0.05;
    this.baseRecoil -= 1;
    this.baseVelocity += 0.15;
    this.baseFireRate += 5;
    this.baseRange += 10;
  }
}
