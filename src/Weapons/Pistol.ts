import { PistolSkills, Stat } from "../lib/skillDefinitions";
import { Gun } from "./Gun";
import { TILE_SIZE } from "../lib/definitions";

export class Pistol extends Gun {
  constructor() {
    super({
      name: "Pistol",
      stats: {
        [Stat.Damage]: 1,
        [Stat.MagSize]: 6,
        [Stat.ReloadSpeed]: 1.6,
        [Stat.FireRate]: 120,
        [Stat.Velocity]: 120,
        [Stat.Recoil]: 30,
        [Stat.CritChance]: 0,
        [Stat.Range]: TILE_SIZE * 5,
        [Stat.Projectiles]: 1,
        [Stat.Penetration]: 0,
        [Stat.DropChance]: 0,
        [Stat.Burn]: 0,
        [Stat.AmmoCost]: 10,
      },
      projectileSize: 5,
      projectileColor: "black",
      ammo: 30000,
      price: 0,
      skills: PistolSkills,
    });
  }

  getLevelBonusStats(levelIndex: number) {
    return {
      [Stat.Damage]: 10,
      [Stat.MagSize]: [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 2][levelIndex],
      [Stat.ReloadSpeed]: -0.5,
      [Stat.FireRate]: -1,
      [Stat.Velocity]: 5,
      [Stat.Recoil]: 3,
      [Stat.CritChance]: 0,
      [Stat.Range]: TILE_SIZE * 5,
      [Stat.Projectiles]: 1,
      [Stat.Penetration]: 0,
      [Stat.DropChance]: 0,
      [Stat.Burn]: 0,
      [Stat.AmmoCost]: 10,
    };
  }
}
