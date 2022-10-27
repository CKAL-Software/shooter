import { NormalProjectile } from "../GameObjects/Projectiles/NormalProjectile";
import { experienceThresholdsNormal, Point, TICK_DURATION_S } from "../lib/definitions";
import { player, projectiles } from "../Shooter";

export abstract class Gun {
  protected level = 1;
  protected experience = 0;
  protected magazineAmmo = 0;
  protected ammo: number;
  protected reloadTime: number;
  protected reloadTimeRemaining = 0;
  protected magazineSize: number;
  protected fireRate: number;
  protected fireTimeRemaining = 0;
  protected velocity: number;
  protected projectileSize: number;
  protected projectileColor: string;

  constructor(
    magazineSize: number,
    reloadTime: number,
    fireRate: number,
    velocity: number,
    projectileSize: number,
    projectileColor: string,
    ammo: number
  ) {
    this.ammo = ammo;
    this.reloadTime = reloadTime;
    this.magazineSize = magazineSize;
    this.fireRate = fireRate;
    this.velocity = velocity;
    this.projectileSize = projectileSize;
    this.projectileColor = projectileColor;
    this.reload();
  }

  fire(target: Point) {
    if (this.fireTimeRemaining > 0) {
      return;
    }

    if (this.magazineAmmo === 0) {
      return;
    }

    this.ammo--;
    this.magazineAmmo--;
    this.fireTimeRemaining = 60 / this.fireRate;
    projectiles.push(
      new NormalProjectile(
        player.getPosition(),
        this.velocity,
        this.calculateNextProjectilesDamage(),
        this.projectileSize,
        this.projectileColor,
        target,
        true
      )
    );

    if (this.magazineAmmo === 0) {
      this.initiateReload();
    }
  }

  initiateReload() {
    if (this.reloadTimeRemaining <= 0 && this.ammo > 0) {
      this.reloadTimeRemaining = this.reloadTime;
    }
  }

  reload() {
    this.magazineAmmo = this.ammo >= this.magazineSize ? this.magazineSize : this.ammo;
  }

  tick() {
    this.reloadTimeRemaining -= TICK_DURATION_S;
    this.fireTimeRemaining -= TICK_DURATION_S;

    if (this.reloadTimeRemaining <= 0) {
      this.reload();
    }
  }

  addExperience(experience: number) {
    this.experience += experience;

    while (this.experience >= experienceThresholdsNormal[this.level - 1]) {
      this.experience -= experienceThresholdsNormal[this.level - 1];
      this.level++;
    }
  }

  getLevel() {
    return this.level;
  }

  abstract calculateNextProjectilesDamage(): number;
}
