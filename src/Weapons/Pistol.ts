import { Gun } from "./Gun";

export class Pistol extends Gun {
  constructor() {
    super({
      magazineSize: 6,
      reloadTime: 1.2,
      fireRate: 240,
      velocity: 3,
      projectileSize: 5,
      projectileColor: "black",
      ammo: 300,
    });
  }

  calculateNextProjectilesDamage(): number {
    return Math.round(Math.random() * 3) + 7;
  }
}
