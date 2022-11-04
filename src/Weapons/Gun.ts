import { experienceThresholdsNormal, Point, TICK_DURATION_S } from "../lib/definitions";
import { SkillSheet } from "../lib/models";
import { createSkillSheet, GunSkill, SkillType } from "../lib/skillDefinitions";

export interface GunConfig {
  name: string;
  damage: number;
  magazineSize: number;
  reloadTime: number;
  fireRate: number;
  velocity: number;
  projectileSize: number;
  projectileColor: string;
  ammo: number;
  skills: GunSkill[];
}

// const recoilRecoveryPerSecond = 40;

export abstract class Gun {
  protected level = 1;
  protected experience = 0;
  protected magazineAmmo = 0;
  protected ammo: number;
  protected baseDamage: number;
  protected damage: number;
  protected baseReloadTime: number;
  protected reloadTime: number;
  protected reloadTimeRemaining = 0;
  protected baseMagazineSize: number;
  protected magazineSize: number;
  protected baseFireRate: number;
  protected fireRate: number;
  protected fireTimeRemaining = 0;
  protected baseVelocity: number;
  protected velocity: number;
  protected currentRecoil = 0;
  protected projectileSize: number;
  protected projectileColor: string;
  protected shouldReload = false;
  protected name: string;
  protected skillSheet: SkillSheet = {};
  protected unusedSkillPoints = 27;

  constructor(config: GunConfig) {
    this.name = config.name;
    this.ammo = config.ammo;
    this.damage = config.damage;
    this.baseDamage = config.damage;
    this.reloadTime = config.reloadTime;
    this.baseReloadTime = config.reloadTime;
    this.magazineSize = config.magazineSize;
    this.baseMagazineSize = config.magazineSize;
    this.fireRate = config.fireRate;
    this.baseFireRate = config.fireRate;
    this.velocity = config.velocity;
    this.baseVelocity = config.velocity;
    this.projectileSize = config.projectileSize;
    this.projectileColor = config.projectileColor;

    this.skillSheet = createSkillSheet(config.skills);
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

    this.shoot(target);

    // this.currentRecoil += 15;
  }

  initiateReload() {
    if (this.reloadTimeRemaining === 0 && this.ammo > 0 && this.magazineAmmo !== this.magazineSize) {
      this.reloadTimeRemaining = this.reloadTime;
      this.magazineAmmo = 0;
      this.shouldReload = true;
    }
  }

  getRecoil() {
    return this.currentRecoil;
  }

  reload() {
    this.magazineAmmo = Math.min(this.magazineSize, this.ammo);
    this.shouldReload = false;
  }

  tick() {
    this.reloadTimeRemaining = Math.max(0, this.reloadTimeRemaining - TICK_DURATION_S);
    this.fireTimeRemaining = Math.max(0, this.fireTimeRemaining - TICK_DURATION_S);
    // this.currentRecoil = Math.max(10, this.currentRecoil - recoilRecoveryPerSecond * TICK_DURATION_S);

    if (this.magazineAmmo === 0 && !this.shouldReload) {
      this.initiateReload();
    }

    if (this.shouldReload && this.reloadTimeRemaining <= 0) {
      this.reload();
    }
  }

  addExperience(experience: number) {
    this.experience += experience;

    while (this.experience >= experienceThresholdsNormal[this.level - 1]) {
      this.experience -= experienceThresholdsNormal[this.level - 1];
      this.level++;
      this.unusedSkillPoints++;
    }
  }

  getExperience() {
    return this.experience;
  }

  getReloadProgress() {
    if (!this.shouldReload) {
      return 0;
    }
    return 1 - this.reloadTimeRemaining / this.reloadTime;
  }

  getReloadTime() {
    return this.reloadTime;
  }

  getLevel() {
    return this.level;
  }

  getAmmo() {
    return this.ammo;
  }

  getName() {
    return this.name;
  }

  getMagazineSize() {
    return this.magazineSize;
  }

  upgrade(stat: SkillType) {
    const skill = this.skillSheet[stat];
    if (!skill) {
      throw new Error("An upgrade was request for skill that didn't exist in the gun");
    }

    skill.points++;
    const effect = skill.getEffect(skill.points, this);

    if (stat === "magSize") this.magazineSize = Math.round(this.baseMagazineSize * effect);
    if (stat === "damage") this.damage = Math.round(this.baseDamage * effect);
    if (stat === "reloadSpeed") this.reloadTime = this.baseReloadTime * effect;
  }

  getMagazineAmmo() {
    return this.magazineAmmo;
  }

  getFireRate() {
    return this.fireRate;
  }

  getVelocity() {
    return this.velocity;
  }

  getSkillSheet() {
    return this.skillSheet;
  }

  getSkillPointsUsed(stat: SkillType) {
    return this.skillSheet[stat]?.points || 0;
  }

  getTotalSkillPointsUsed() {
    return Object.values(this.skillSheet).reduce((total, curr) => total + curr.points, 0);
  }

  getUnusedSkillPoints() {
    return this.unusedSkillPoints;
  }

  isReloading() {
    return this.reloadTimeRemaining > 0;
  }

  isLoadingBulletIntoChamber() {
    return this.fireTimeRemaining > 0;
  }

  abstract shoot(target: Point): void;
}
