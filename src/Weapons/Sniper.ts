import { PistolSkills, Stat } from "../lib/skillDefinitions";
import { Gun } from "./Gun";
import { TILE_SIZE } from "../lib/definitions";

export class Sniper extends Gun {
  constructor() {
    super({
      name: "Sniper",
      stats: {
        [Stat.Damage]: 15,
        [Stat.MagSize]: 3,
        [Stat.ReloadSpeed]: 25,
        [Stat.FireRate]: 40,
        [Stat.Velocity]: 400,
        [Stat.Recoil]: 5,
        [Stat.CritChance]: 0.2,
        [Stat.Range]: TILE_SIZE * 5,
        [Stat.Projectiles]: 1,
        [Stat.Penetration]: 0,
        [Stat.DropChance]: 0,
        [Stat.Burn]: 0,
        [Stat.AmmoCost]: 10,
      },
      projectileSize: 4,
      projectileColor: "black",
      ammo: 20,
      price: 50,
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
