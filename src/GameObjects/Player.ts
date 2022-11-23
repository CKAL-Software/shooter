import { MAP_SIZE } from "../Definitions/Maps";
import {
  ANIM_COLLECT_TIME,
  COLOR_DMG,
  COLOR_EXP,
  COLOR_HP_BAR_GREEN,
  COLOR_HP_BAR_RED,
  COLOR_HP_GREEN,
  COLOR_MONEY,
  COLOR_PLAYER,
  experienceThresholdsPlayer,
  MapSide,
  TICK_DURATION_S,
  TILE_SIZE,
} from "../lib/definitions";
import { toUnitVector } from "../lib/functions";
import { Direction } from "../lib/models";
import { PlayerStat, PlayerStats, Stat } from "../lib/skillDefinitions";
import { currentMap, mousePos, numberAnimations } from "../Shooter";
import { Gun } from "../Weapons/Gun";
import { Pistol } from "../Weapons/Pistol";
import { Sniper } from "../Weapons/Sniper";
import { MovingObject } from "./MovingObject";
import { RisingText } from "./RisingText";

export class Player extends MovingObject {
  private health = 10;
  private maxHealth = 10;
  private money = 0;
  private weapons: Gun[] = [new Pistol(), new Sniper()];
  private currentWeapon = this.weapons[0];
  private moveDirections: Set<Direction> = new Set();
  private wantFire = false;
  private level = 1;
  private experience = 0;
  private totalExperience = 0;
  private tintTime = 0;
  private tintColor = "255,0,0";
  private lastExpAnim: RisingText | undefined = undefined;
  private lastExpAnimTimeLeft = 0;
  private lastMoneyAnim: RisingText | undefined = undefined;
  private lastMoneyAnimTimeLeft = 0;
  private lastDmgAnim: RisingText | undefined = undefined;
  private lastDmgAnimTimeLeft = 0;
  private lastHealthAnim: RisingText | undefined = undefined;
  private lastHealthAnimTimeLeft = 0;
  private unusedSkillPoints = 3;

  private baseStats: PlayerStats;
  private stats: PlayerStats;

  private skillPointsUsed: { [k in PlayerStat]?: number } = {};

  constructor() {
    super({ position: { x: 180, y: 280 }, size: 13, velocity: 120, color: COLOR_PLAYER });

    this.baseStats = {
      maxHealth: 100,
      ammoCost: 10,
      damage: 0,
      dropChance: 0,
      velocity: 0,
      range: 0,
      recoil: 0,
      reloadSpeed: 0,
      fireRate: 0,
      burn: 0,
      critChance: 0,
      magSize: 0,
      moveSpeed: 0,
      penetration: 0,
      projectiles: 0,
    };

    this.stats = { ...this.baseStats };
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const drawPos = this.getDrawPosition();

    ctx.beginPath();
    ctx.arc(drawPos.x, drawPos.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    this.drawHealthBar(ctx);
  }

  drawHealthBar(ctx: CanvasRenderingContext2D, doubleLength?: boolean) {
    const width = 40;
    const height = 8;

    const drawPos = this.getDrawPosition();

    ctx.beginPath();
    ctx.rect(
      drawPos.x - (width / 2) * (doubleLength ? 2 : 1),
      drawPos.y - (this.size + height + 4),
      width * (doubleLength ? 2 : 1),
      height
    );
    ctx.fillStyle = COLOR_HP_BAR_RED;
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(
      drawPos.x - (width / 2) * (doubleLength ? 2 : 1),
      drawPos.y - (this.size + height + 4),
      Math.round(width * (doubleLength ? 2 : 1) * (this.health / this.maxHealth)),
      height
    );
    ctx.fillStyle = COLOR_HP_BAR_GREEN;
    ctx.fill();
    ctx.closePath();
  }

  tick() {
    this.tintTime = Math.max(0, this.tintTime - TICK_DURATION_S);
    this.currentWeapon.tick();
    this.move();
    if (this.wantFire) {
      this.shoot();
    }

    this.lastExpAnimTimeLeft = Math.max(0, this.lastExpAnimTimeLeft - TICK_DURATION_S);
    this.lastDmgAnimTimeLeft = Math.max(0, this.lastDmgAnimTimeLeft - TICK_DURATION_S);
    this.lastMoneyAnimTimeLeft = Math.max(0, this.lastMoneyAnimTimeLeft - TICK_DURATION_S);
  }

  changeWeapon(weaponSlot: number) {
    if (weaponSlot < 0 || weaponSlot >= this.weapons.length) {
      return;
    }

    if (this.currentWeapon.isReloading() || this.currentWeapon.isLoadingBulletIntoChamber()) {
      return;
    }

    this.currentWeapon = this.weapons[weaponSlot];
  }

  private move() {
    this.moveDirections.forEach((dir) => this.moveDirection(dir));
  }

  private moveDirection(direction: Direction) {
    let newX = this.position.x;
    let newY = this.position.y;

    const actualVelocity =
      this.moveDirections.size > 1 ? (this.velocity * TICK_DURATION_S) / Math.SQRT2 : this.velocity * TICK_DURATION_S;

    if (direction === "w") {
      newY -= actualVelocity;
    } else if (direction === "a") {
      newX -= actualVelocity;
    } else if (direction === "s") {
      newY += actualVelocity;
    } else if (direction === "d") {
      newX += actualVelocity;
    }

    const [isColliding, mayForce] = this.checkCollision({ x: newX, y: newY });

    if (isColliding) {
      if (!mayForce) {
        // we are not stuck on a corner
        return;
      }

      if (direction === "a" || direction === "d") {
        if (!this.checkCollision({ x: newX, y: newY - this.velocity * TICK_DURATION_S })[0]) {
          newY -= actualVelocity;
        } else if (!this.checkCollision({ x: newX, y: newY + this.velocity * TICK_DURATION_S })[0]) {
          newY += actualVelocity;
        } else {
          return;
        }
      }

      if (direction === "w" || direction === "s") {
        if (!this.checkCollision({ x: newX - this.velocity * TICK_DURATION_S, y: newY })[0]) {
          newX -= actualVelocity;
        } else if (!this.checkCollision({ x: newX + this.velocity * TICK_DURATION_S, y: newY })[0]) {
          newX += actualVelocity;
        } else {
          return;
        }
      }
    }

    this.setPosition({ x: newX, y: newY });

    this.updateSurroundingObstacles();
  }

  setMoveDirections(moveDirections: Set<Direction>) {
    this.moveDirections = moveDirections;
  }

  setWantFire(wantFire: boolean) {
    this.wantFire = wantFire;
  }

  private shoot() {
    this.currentWeapon.fire(mousePos);
  }

  addExperience(experience: number) {
    this.totalExperience += experience;
    this.experience += experience;

    if (this.lastExpAnimTimeLeft > 0) {
      this.lastExpAnim?.setText(Number(this.lastExpAnim.getText()) + experience);
    } else {
      const newAnim = new RisingText(this.position, experience, COLOR_EXP);
      numberAnimations.push(newAnim);
      this.lastExpAnim = newAnim;
    }
    this.lastExpAnimTimeLeft = ANIM_COLLECT_TIME;

    while (this.experience >= experienceThresholdsPlayer[this.level - 1]) {
      this.experience -= experienceThresholdsPlayer[this.level - 1];
      this.level++;
      this.unusedSkillPoints++;
      this.onLevelUp(this.level - 1);
      numberAnimations.push(new RisingText(this.position, "Weapon level up!", COLOR_EXP));
    }
  }

  changeMoney(change: number) {
    if (this.lastMoneyAnimTimeLeft > 0) {
      this.lastMoneyAnim?.setText(Number(this.lastMoneyAnim.getText()) + change);
    } else {
      const newAnim = new RisingText(this.position, change, COLOR_MONEY);
      numberAnimations.push(newAnim);
      this.lastMoneyAnim = newAnim;
    }
    this.lastMoneyAnimTimeLeft = ANIM_COLLECT_TIME;

    this.money += change;
  }

  getTotalExperience() {
    return this.totalExperience;
  }

  onLevelUp(levelIndex: number) {
    const healthIncrease = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5][levelIndex];
    this.maxHealth += healthIncrease;
    this.health += healthIncrease;

    this.velocity += [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1][levelIndex];
  }

  enterTeleporter(side: MapSide) {
    const { x, y } = this.position;
    if (side === "up") {
      this.setPosition({ x, y: MAP_SIZE * TILE_SIZE - TILE_SIZE / 2 });
    } else if (side === "right") {
      this.setPosition({ x: TILE_SIZE / 2, y });
    } else if (side === "down") {
      this.setPosition({ x, y: TILE_SIZE / 2 });
    } else {
      this.setPosition({ x: MAP_SIZE * TILE_SIZE - TILE_SIZE / 2, y: y });
    }

    this.updateSurroundingObstacles();
  }

  upgrade(stat: PlayerStat) {
    const effect = this.getEffect(stat, this.skillPointsUsed[stat] || 0);

    if (!this.skillPointsUsed[stat]) {
      this.skillPointsUsed[stat] = 0;
    } else {
      this.skillPointsUsed[stat]!++;
    }

    if (stat === "magSize") {
      this.stats[stat] = Math.round(this.baseStats[stat] + effect);
    } else {
      this.stats[stat] = this.baseStats[stat] + effect;
    }
  }

  getEffect(stat: PlayerStat, pointsIndex: number): number {
    if (stat === Stat.MaxHealth) return 5;
    else if (stat === Stat.MoveSpeed) return 15;
    else if (stat === Stat.Damage) return 0.05;
    else if (stat === Stat.CritChance) return 0.03;
    else if (stat === Stat.DropChance) return 0.02;
    else if (stat === Stat.FireRate) return 0.1;
    else if (stat === Stat.MagSize) return 0.2;
    else if (stat === Stat.Penetration) return 0;
    else if (stat === Stat.Range) return 0.1;
    else if (stat === Stat.Recoil) return -0.15 * Math.pow(0.7, pointsIndex);
    else if (stat === Stat.ReloadSpeed) return -0.15 * Math.pow(0.7, pointsIndex);
    else if (stat === Stat.Velocity) return 0.2;

    throw new Error("Called getEffect on a stat that was not provided in method");
  }

  getStat(type: PlayerStat) {
    return this.stats[type];
  }

  getTintColor() {
    return this.tintColor;
  }

  getExperience() {
    return this.experience;
  }

  getTileState() {
    const { x, y } = this.tile;
    const tile = currentMap.layout[y][x];
    if (tile === "~") {
      if (x === 0) return "tp-left";
      if (x === MAP_SIZE - 1) return "tp-right";
      if (y === MAP_SIZE - 1) return "tp-down";
      if (y === 0) return "tp-up";
    } else if (tile === "s") {
      return "shop";
    }

    return "none";
  }

  getName() {
    return "Player";
  }

  getLevel() {
    return this.level;
  }

  getCurrentWeapon() {
    return this.currentWeapon;
  }

  getVelocity() {
    return this.velocity;
  }

  getMoney() {
    return this.money;
  }

  getSkillPointsForStat(stat: PlayerStat) {
    return this.skillPointsUsed[stat] || 0;
  }

  getUnusedSkillPoints() {
    return this.unusedSkillPoints;
  }

  getDirection() {
    const direction = { x: 0, y: 0 };

    this.moveDirections.forEach((dir) => {
      if (dir === "a") {
        direction.x--;
      } else if (dir === "d") {
        direction.x++;
      } else if (dir === "s") {
        direction.y++;
      } else {
        direction.y--;
      }
    });

    return toUnitVector(direction);
  }

  getSize() {
    return this.size;
  }

  getWeapons() {
    return this.weapons;
  }

  getMaxHealth() {
    return this.maxHealth;
  }

  getHealth() {
    return this.health;
  }

  reload() {
    this.currentWeapon.initiateReload();
  }

  getTintIntencity() {
    return 0.35 * (this.tintTime / 0.7);
  }

  setTint(r: number, g: number, b: number) {
    const newTintColor = `${r},${g},${b}`;

    if (this.tintTime > 0 && this.tintColor !== newTintColor) {
      return;
    }

    this.tintTime = 0.7;
    this.tintColor = newTintColor;
  }

  addHealth(health: number) {
    this.health = Math.min(this.maxHealth, this.health + health);
    this.setTint(0, 255, 0);

    if (this.lastHealthAnimTimeLeft > 0) {
      this.lastHealthAnim?.setText(Number(this.lastHealthAnim.getText()) + health);
    } else {
      const newAnim = new RisingText(this.position, health, COLOR_HP_GREEN);
      numberAnimations.push(newAnim);
      this.lastHealthAnim = newAnim;
    }
    this.lastHealthAnimTimeLeft = ANIM_COLLECT_TIME;
  }

  addAmmo(ammo: number, weapon: string) {
    const gun = this.weapons.find((w) => w.getName() === weapon);

    if (!gun) {
      throw new Error("Tried to add ammo to a weapon the player doesn't have");
    }

    gun.addAmmo(ammo);
  }

  inflictDamage(damage: number) {
    const chanceOfHighHit = damage - Math.floor(damage);
    const actualDamage = Math.random() < chanceOfHighHit ? Math.ceil(damage) : Math.floor(damage);

    this.health = Math.max(0, this.health - actualDamage);
    this.setTint(255, 0, 0);

    if (this.lastDmgAnimTimeLeft > 0) {
      this.lastDmgAnim?.setText(Number(this.lastDmgAnim.getText()) + actualDamage);
    } else {
      const newAnim = new RisingText(this.position, actualDamage, COLOR_DMG);
      numberAnimations.push(newAnim);
      this.lastDmgAnim = newAnim;
    }
    this.lastDmgAnimTimeLeft = ANIM_COLLECT_TIME;
  }
}
