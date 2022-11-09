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
      critChance: 0.2,
      range: TILE_SIZE * MAP_SIZE,
      numBullets: 1,
      projectileSize: 4,
      projectileColor: "black",
      ammo: 20,
      price: 50,
      skills: PistolSkills,
    });
  }

  getLevelBonusStats(levelIndex: number) {
    return {
      damage: this.baseDamage * 0.2,
      magSize: [0, 0, 1, 0, 0, 1, 0, 0, 2][levelIndex],
      reloadTime: -0.05,
      recoil: -0.5,
      velocity: 20,
      fireRate: 5,
      range: 0,
      critChance: 0,
      penetration: 0,
      ammoCost: 0,
      projectiles: 0,
    };
  }
}
