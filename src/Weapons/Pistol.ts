import { PistolSkills } from "../lib/skillDefinitions";
import { Gun } from "./Gun";
import { TILE_SIZE } from "../lib/definitions";

export class Pistol extends Gun {
  constructor() {
    super({
      name: "Pistol",
      damage: 1,
      magazineSize: 6,
      reloadTime: 1.6,
      fireRate: 120,
      velocity: 120,
      recoil: 30,
      critChance: 0,
      range: TILE_SIZE * 5,
      numBullets: 1,
      projectileSize: 5,
      projectileColor: "black",
      ammo: 30000,
      price: 0,
      skills: PistolSkills,
    });
  }

  getLevelBonusStats(levelIndex: number) {
    return {
      damage: this.baseDamage * 0.2,
      magSize: [0, 0, 1, 0, 0, 1, 0, 0, 2][levelIndex],
      reloadTime: -0.05,
      recoil: -1,
      velocity: 5,
      fireRate: 3,
      range: 10,
      projectiles: 0,
      penetration: 0,
      ammoCost: 0,
      critChance: 0,
    };
  }
}
