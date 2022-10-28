import { calculateDirection } from "../lib/canvasFunctions";
import { experienceThresholdsPlayer } from "../lib/definitions";
import { changeDirection } from "../lib/functions";
import { Direction } from "../lib/models";
import { mousePos } from "../Shooter";
import { Pistol } from "../Weapons/Pistol";
import { GameObject } from "./GameObject";

export class Player extends GameObject {
  private moveSpeed = 2.5;
  private health = 100;
  private color = "#c67c16";
  private velocity = { x: 0, y: 0 };
  private currentWeapon = new Pistol();
  private moveDirections: Set<Direction> = new Set();
  private wantFire = false;
  private level = 1;
  private experience = 0;

  constructor() {
    super(15, { x: 200, y: 280 });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.drawPosition.x, this.drawPosition.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  tick() {
    this.currentWeapon.tick();
    this.move();
    if (this.wantFire) {
      this.shoot();
    }
  }

  private move() {
    this.moveDirections.forEach((dir) => this.moveDirection(dir));
  }

  private moveDirection(direction: Direction) {
    let newX = this.drawPosition.x;
    let newY = this.drawPosition.y;

    if (direction === "w") {
      newY -= this.moveSpeed;
    } else if (direction === "a") {
      newX -= this.moveSpeed;
    } else if (direction === "s") {
      newY += this.moveSpeed;
    } else if (direction === "d") {
      newX += this.moveSpeed;
    }

    const [isColliding, mayForce] = this.checkCollision({ x: newX, y: newY });

    if (isColliding) {
      if (!mayForce) {
        // we are not stuck on a corner
        return;
      }

      if (direction === "a" || direction === "d") {
        if (!this.checkCollision({ x: newX, y: newY - this.moveSpeed })[0]) {
          newY -= this.moveSpeed;
        } else if (!this.checkCollision({ x: newX, y: newY + this.moveSpeed })[0]) {
          newY += this.moveSpeed;
        } else {
          return;
        }
      }

      if (direction === "w" || direction === "s") {
        if (!this.checkCollision({ x: newX - this.moveSpeed, y: newY })[0]) {
          newX -= this.moveSpeed;
        } else if (!this.checkCollision({ x: newX + this.moveSpeed, y: newY })[0]) {
          newX += this.moveSpeed;
        } else {
          return;
        }
      }
    }

    this.velocity = { x: newX - this.drawPosition.x, y: newY - this.drawPosition.y };

    this.drawPosition.x = newX;
    this.drawPosition.y = newY;

    this.updateSurroundingObstacles();
  }

  setMoveDirections(moveDirections: Set<Direction>) {
    this.moveDirections = moveDirections;
  }

  setWantFire(wantFire: boolean) {
    this.wantFire = wantFire;
  }

  private shoot() {
    const direction = calculateDirection(this.getPosition(), mousePos);

    const newAngle = Math.random() * 30 - 15;

    this.currentWeapon.fire(changeDirection(direction, newAngle));
  }

  addExperience(experience: number) {
    this.experience += experience;

    while (this.experience >= experienceThresholdsPlayer[this.level - 1]) {
      this.experience -= experienceThresholdsPlayer[this.level - 1];
      this.level++;
    }
  }

  getExperience() {
    return this.experience;
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

  getPosition() {
    return { x: this.drawPosition.x, y: this.drawPosition.y };
  }

  getSize() {
    return this.size;
  }

  getHealth() {
    return this.health;
  }

  inflictDamage(damage: number) {
    this.health -= damage;
  }
}
