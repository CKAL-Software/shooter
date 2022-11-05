import { PistolSkills } from "../lib/skillDefinitions";
import { Gun } from "./Gun";
import { TILE_SIZE } from "../lib/definitions";

export class Pistol extends Gun {
  constructor() {
    super({
      name: "Pistol",
      damage: 7,
      magazineSize: 100,
      reloadTime: 1.2,
      fireRate: 2400,
      velocity: 3,
      recoil: 30,
      critChance: 0,
      range: TILE_SIZE * 5,
      numBullets: 1,
      projectileSize: 5,
      projectileColor: "black",
      ammo: 300,
      skills: PistolSkills,
    });
  }
}
