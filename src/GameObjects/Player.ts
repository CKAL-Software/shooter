import { MAP_SIZE } from "../Definitions/Maps";
import {
  ANIM_COLLECT_TIME,
  COLOR_DMG,
  COLOR_EXP,
  COLOR_HP_BAR_GREEN,
  COLOR_HP_BAR_RED,
  COLOR_MONEY,
  COLOR_PLAYER,
  experienceThresholdsPlayer,
  MapSide,
  TICK_DURATION_S,
  TILE_SIZE,
} from "../lib/definitions";
import { toUnitVector } from "../lib/functions";
import { Direction } from "../lib/models";
import { currentMap, mousePos, numberAnimations as animations } from "../Shooter";
import { Gun } from "../Weapons/Gun";
import { Pistol } from "../Weapons/Pistol";
import { Shotgun } from "../Weapons/Shotgun";
import { MovingObject } from "./MovingObject";
import { RisingText } from "./RisingText";

export class Player extends MovingObject {
  private health = 100;
  private maxHealth = 100;
  private money = 0;
  private weapons: Gun[] = [new Pistol(), new Shotgun()];
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

  constructor() {
    super({ position: { x: 180, y: 280 }, size: 13, velocity: 2.5, color: COLOR_PLAYER });
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

    const actualVelocity = this.moveDirections.size > 1 ? this.velocity / Math.SQRT2 : this.velocity;

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
        if (!this.checkCollision({ x: newX, y: newY - this.velocity })[0]) {
          newY -= actualVelocity;
        } else if (!this.checkCollision({ x: newX, y: newY + this.velocity })[0]) {
          newY += actualVelocity;
        } else {
          return;
        }
      }

      if (direction === "w" || direction === "s") {
        if (!this.checkCollision({ x: newX - this.velocity, y: newY })[0]) {
          newX -= actualVelocity;
        } else if (!this.checkCollision({ x: newX + this.velocity, y: newY })[0]) {
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
      animations.push(newAnim);
      this.lastExpAnim = newAnim;
    }
    this.lastExpAnimTimeLeft = ANIM_COLLECT_TIME;

    while (this.experience >= experienceThresholdsPlayer[this.level - 1]) {
      this.experience -= experienceThresholdsPlayer[this.level - 1];
      this.level++;
      animations.push(new RisingText(this.position, "Level up!", COLOR_EXP));
    }
  }

  changeMoney(change: number) {
    if (this.lastMoneyAnimTimeLeft > 0) {
      this.lastMoneyAnim?.setText(Number(this.lastMoneyAnim.getText()) + change);
    } else {
      const newAnim = new RisingText(this.position, change, COLOR_MONEY);
      animations.push(newAnim);
      this.lastMoneyAnim = newAnim;
    }

    this.lastMoneyAnimTimeLeft = ANIM_COLLECT_TIME;

    this.money += change;
  }

  getTotalExperience() {
    return this.totalExperience;
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

  getTintColor() {
    return this.tintColor;
  }

  getExperience() {
    return this.experience;
  }

  getTeleportSide() {
    const { x, y } = this.tile;
    if (currentMap.layout[y][x] === "~") {
      if (x === 0) return "left";
      if (x === MAP_SIZE - 1) return "right";
      if (y === MAP_SIZE - 1) return "down";
      if (y === 0) return "up";
    }
    return "none";
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

  inflictDamage(damage: number) {
    this.health = Math.max(0, this.health - damage);
    this.setTint(255, 0, 0);

    if (this.lastDmgAnimTimeLeft > 0) {
      this.lastDmgAnim?.setText(Number(this.lastDmgAnim.getText()) + damage);
    } else {
      const newAnim = new RisingText(this.position, damage, COLOR_DMG);
      animations.push(newAnim);
      this.lastDmgAnim = newAnim;
    }

    this.lastDmgAnimTimeLeft = ANIM_COLLECT_TIME;
  }
}
