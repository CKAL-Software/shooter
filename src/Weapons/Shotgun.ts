import { NormalProjectile } from "../GameObjects/Projectiles/NormalProjectile";
import { calculateDirection } from "../lib/canvasFunctions";
import { Point, TILE_SIZE } from "../lib/definitions";
import { changeDirection } from "../lib/functions";
import { ShotgunSkills, Stat } from "../lib/skillDefinitions";
import { player, projectiles } from "../Shooter";
import { Gun } from "./Gun";

export class Shotgun extends Gun {
  constructor() {
    super({
      name: "Shotgun",
      stats: {
        [Stat.Damage]: 2,
        [Stat.MagSize]: 2,
        [Stat.ReloadSpeed]: 3,
        [Stat.FireRate]: 60,
        [Stat.Velocity]: 2,
        [Stat.Recoil]: 30,
        [Stat.CritChance]: 0,
        [Stat.Range]: TILE_SIZE * 3,
        [Stat.Projectiles]: 7,
        [Stat.Penetration]: 0,
        [Stat.DropChance]: 0,
        [Stat.Burn]: 0,
        [Stat.AmmoCost]: 10,
      },
      projectileSize: 4,
      projectileColor: "black",
      ammo: 2000,
      price: 5,
      skills: ShotgunSkills,
    });
  }

  shoot(target: Point) {
    const direction = calculateDirection(player.getPosition(), target);

    for (let i = 0; i < this.getStat(Stat.Projectiles); i++) {
      const newAngle = Math.random() * this.getStat(Stat.Recoil) - this.getStat(Stat.Recoil) / 2;
      const newDirection = changeDirection(direction, newAngle);

      const damage = this.getDamageForNextBullet();

      projectiles.push(
        new NormalProjectile({
          position: player.getPosition(),
          direction: newDirection,
          velocity: this.getStat(Stat.Velocity),
          damage: damage,
          range: this.getStat(Stat.Range),
          size: this.projectileSize,
          color: this.projectileColor,
          shotByPlayer: true,
          ownerGun: this,
          isCriticalHit: damage > this.getStat(Stat.Damage),
        })
      );
    }
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
